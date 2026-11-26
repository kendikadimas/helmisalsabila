import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { createDokuCheckoutPayment, getDokuConfig } from "@/lib/doku";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { validatePromoCode, resolveItemPrice } from "@/lib/promo";
import { SITE_URL } from "@/lib/site-config";

const CheckoutSchema = z.object({
  itemType: z.enum(["product", "service"]).default("product"),
  itemId: z.string().min(1),
  customerName: z.string().trim().min(2, "Nama lengkap minimal 2 karakter"),
  customerEmail: z.string().trim().email("Format email tidak valid"),
  customerPhone: z.string().trim().min(8, "Nomor HP/WhatsApp minimal 8 digit"),
  promoCode: z.string().trim().optional(),
});

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const limit = checkRateLimit(`checkout:${ip}`, { maxRequests: 10, windowSeconds: 60 });
    if (!limit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak permintaan. Silakan tunggu ${limit.resetInSeconds} detik sebelum mencoba lagi.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = CheckoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Data tidak valid." },
        { status: 400 }
      );
    }

    const { clientId, secretKey } = getDokuConfig();
    if (!clientId || !secretKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Pembayaran DOKU belum dikonfigurasi (DOKU_CLIENT_ID / DOKU_SECRET_KEY belum diisi di .env).",
        },
        { status: 503 }
      );
    }

    const { itemType, itemId, customerName, customerEmail, customerPhone, promoCode } = parsed.data;

    const item = await resolveItemPrice(itemType, itemId);
    if (!item) {
      return NextResponse.json(
        { success: false, error: itemType === "product" ? "Produk tidak ditemukan." : "Layanan tidak ditemukan." },
        { status: 404 }
      );
    }
    const itemTitle = item.title;
    let amount = item.amount;
    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Item gratis tidak memerlukan checkout pembayaran." },
        { status: 400 }
      );
    }

    // Voucher dihitung ulang di server dari database; kode tidak valid ditolak (bukan diabaikan diam-diam).
    let voucherCode: string | null = null;
    let discountAmount = 0;
    if (promoCode) {
      const promoRes = await validatePromoCode(promoCode, amount);
      if (!promoRes.valid || !promoRes.finalAmount) {
        return NextResponse.json({ success: false, error: promoRes.message }, { status: 400 });
      }
      voucherCode = promoRes.code;
      discountAmount = promoRes.discountAmount || 0;
      amount = promoRes.finalAmount;
    }
    const rawHost = req.headers.get("host") || "";
    const isAllowedLocal = rawHost.startsWith("localhost:") || rawHost.startsWith("127.0.0.1:");
    const origin = isAllowedLocal ? `http://${rawHost}` : SITE_URL;
    const orderId = `ord-${crypto.randomUUID().slice(0, 12)}`;
    // Cryptographically random 10-hex-char suffix (40 bits entropy) to prevent invoice guessing/enumeration
    const randomSuffix = crypto.randomBytes(5).toString("hex").toUpperCase();
    const invoiceNumber = `INV-${Date.now()}-${randomSuffix}`;
    const digitsOnly = customerPhone.replace(/[^0-9]/g, "");
    const normalizedPhone = digitsOnly.startsWith("0")
      ? `62${digitsOnly.slice(1)}`
      : digitsOnly.startsWith("62")
        ? digitsOnly
        : `62${digitsOnly}`;

    await db.insert(schema.orders).values({
      id: orderId,
      invoiceNumber,
      itemType,
      itemId,
      itemTitle,
      customerName,
      customerEmail,
      customerPhone: normalizedPhone,
      amount: amount.toFixed(2),
      status: "PENDING",
    });

    if (voucherCode) {
      try {
        await db.insert(schema.voucherRedemptions).values({
          id: crypto.randomUUID(),
          voucherCode,
          orderId,
          discountAmount,
        });
      } catch (e) {
        console.error("Failed to record voucher redemption:", e);
      }
    }

    const dokuRes = await createDokuCheckoutPayment({
      invoiceNumber,
      amount,
      itemId,
      itemName: itemTitle,
      customerId: orderId,
      customerName,
      customerEmail,
      customerPhone: normalizedPhone,
      callbackUrl: `${origin}/payment/status?invoice=${encodeURIComponent(invoiceNumber)}`,
      callbackUrlCancel: `${origin}/payment/status?invoice=${encodeURIComponent(invoiceNumber)}&cancelled=1`,
    });

    await db
      .update(schema.orders)
      .set({ paymentUrl: dokuRes.paymentUrl })
      .where(eq(schema.orders.id, orderId));

    return NextResponse.json({
      success: true,
      invoiceNumber,
      paymentUrl: dokuRes.paymentUrl,
    });
  } catch (error: any) {
    console.error("DOKU checkout error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Gagal membuat transaksi DOKU." },
      { status: 500 }
    );
  }
}

