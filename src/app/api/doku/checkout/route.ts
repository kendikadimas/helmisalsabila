import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { createDokuCheckoutPayment, getDokuConfig } from "@/lib/doku";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { validatePromoCode } from "@/lib/promo";

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

    let itemTitle = "";
    let amount = 0;

    if (itemType === "product") {
      const [product] = await db
        .select()
        .from(schema.products)
        .where(eq(schema.products.id, itemId))
        .limit(1);
      if (!product) {
        return NextResponse.json({ success: false, error: "Produk tidak ditemukan." }, { status: 404 });
      }
      itemTitle = product.title;
      amount = Math.round(parseFloat(String(product.discountedPrice || product.originalPrice || "0")));
    } else {
      const [service] = await db
        .select()
        .from(schema.services)
        .where(eq(schema.services.id, itemId))
        .limit(1);
      if (!service) {
        return NextResponse.json({ success: false, error: "Layanan tidak ditemukan." }, { status: 404 });
      }
      itemTitle = service.title;
      amount = Math.round(parseFloat(String(service.priceStartingAt || "0")));
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Item gratis tidak memerlukan checkout pembayaran." },
        { status: 400 }
      );
    }

    // Apply promo code discount if provided
    if (promoCode) {
      const promoRes = validatePromoCode(promoCode, amount);
      if (promoRes.valid && promoRes.finalAmount) {
        amount = promoRes.finalAmount;
        itemTitle = `${itemTitle} [Kupon ${promoRes.code}]`;
      }
    }

    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
    const origin = host ? `${proto}://${host}` : process.env.NEXT_PUBLIC_APP_URL || "https://helsenvi.com";

    const orderId = `ord-${crypto.randomUUID().slice(0, 12)}`;
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
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

