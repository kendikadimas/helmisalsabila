import { and, eq, gte, or, sql } from "drizzle-orm";
import { db, schema } from "@/db";

export interface PromoResult {
  valid: boolean;
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  finalAmount?: number;
  message: string;
}

const MIN_DOKU_AMOUNT = 1000;
// Pesanan PENDING dihitung memakai kuota hanya selama jendela ini, agar checkout yang ditinggalkan tidak mengunci kuota.
const PENDING_HOLD_MS = 2 * 60 * 60 * 1000;

const formatIdr = (n: number) => `Rp${n.toLocaleString("id-ID")}`;

export async function resolveItemPrice(
  itemType: "product" | "service",
  itemId: string
): Promise<{ title: string; amount: number } | null> {
  if (itemType === "product") {
    const [product] = await db.select().from(schema.products).where(eq(schema.products.id, itemId)).limit(1);
    if (!product) return null;
    return {
      title: product.title,
      amount: Math.round(parseFloat(String(product.discountedPrice || product.originalPrice || "0"))),
    };
  }
  const [service] = await db.select().from(schema.services).where(eq(schema.services.id, itemId)).limit(1);
  if (!service) return null;
  return { title: service.title, amount: Math.round(parseFloat(String(service.priceStartingAt || "0"))) };
}

export async function countVoucherUsage(code: string): Promise<number> {
  const cutoff = new Date(Date.now() - PENDING_HOLD_MS);
  const [row] = await db
    .select({ used: sql<number>`count(*)` })
    .from(schema.voucherRedemptions)
    .innerJoin(schema.orders, eq(schema.orders.id, schema.voucherRedemptions.orderId))
    .where(
      and(
        eq(schema.voucherRedemptions.voucherCode, code),
        or(
          eq(schema.orders.status, "PAID"),
          and(eq(schema.orders.status, "PENDING"), gte(schema.orders.createdAt, cutoff))
        )
      )
    );
  return Number(row?.used || 0);
}

export async function validatePromoCode(rawCode: string, originalAmount: number): Promise<PromoResult> {
  const code = (rawCode || "").trim().toUpperCase();
  if (!code) return { valid: false, code: "", message: "Kode promo tidak boleh kosong." };

  const notFound: PromoResult = {
    valid: false,
    code,
    message: "Kode promo tidak ditemukan atau sudah tidak berlaku.",
  };

  try {
    const [voucher] = await db.select().from(schema.vouchers).where(eq(schema.vouchers.code, code)).limit(1);
    if (!voucher || !voucher.isActive) return notFound;

    const now = Date.now();
    if (voucher.startsAt && voucher.startsAt.getTime() > now) {
      return { valid: false, code, message: "Kode promo belum berlaku." };
    }
    if (voucher.expiresAt && voucher.expiresAt.getTime() < now) {
      return { valid: false, code, message: "Kode promo sudah kedaluwarsa." };
    }
    if (voucher.minPurchase > 0 && originalAmount < voucher.minPurchase) {
      return { valid: false, code, message: `Minimal belanja ${formatIdr(voucher.minPurchase)} untuk kode ini.` };
    }
    if (voucher.quota !== null && (await countVoucherUsage(code)) >= voucher.quota) {
      return { valid: false, code, message: "Kuota kode promo sudah habis." };
    }

    let discount =
      voucher.type === "percent"
        ? Math.round((originalAmount * voucher.value) / 100)
        : Math.min(voucher.value, originalAmount);
    if (voucher.type === "percent" && voucher.maxDiscount) discount = Math.min(discount, voucher.maxDiscount);

    const finalAmount = Math.max(MIN_DOKU_AMOUNT, originalAmount - discount);
    const label = voucher.type === "percent" ? `${voucher.value}%` : formatIdr(originalAmount - finalAmount);

    return {
      valid: true,
      code,
      discountAmount: originalAmount - finalAmount,
      discountPercent: voucher.type === "percent" ? voucher.value : undefined,
      finalAmount,
      message: `Kupon ${code} aktif: hemat ${label}!`,
    };
  } catch (error) {
    console.error("Voucher validation error:", error);
    return notFound;
  }
}
