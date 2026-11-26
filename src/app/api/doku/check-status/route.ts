import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const ip = getClientIp(req);
    const limit = checkRateLimit(`status-check:${ip}`, { maxRequests: 60, windowSeconds: 60 });
    if (!limit.allowed) {
      return NextResponse.json({ success: false, error: "Too many status checks" }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const invoiceNumber = searchParams.get("invoice");

    if (!invoiceNumber) {
      return NextResponse.json({ success: false, error: "Missing invoice parameter" }, { status: 400 });
    }

    const [order] = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.invoiceNumber, invoiceNumber))
      .limit(1);

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    let digitalAccessUrl: string | null = null;
    if (order.status === "PAID" && order.itemType === "product") {
      const [prod] = await db
        .select({
          digitalAccessUrl: schema.products.digitalAccessUrl,
          purchaseLinkExternal: schema.products.purchaseLinkExternal,
          liveDemoUrl: schema.products.liveDemoUrl,
        })
        .from(schema.products)
        .where(eq(schema.products.id, order.itemId))
        .limit(1);
      if (prod) {
        digitalAccessUrl = prod.digitalAccessUrl || prod.purchaseLinkExternal || prod.liveDemoUrl || null;
      }
    }

    return NextResponse.json({
      success: true,
      status: order.status,
      invoiceNumber: order.invoiceNumber,
      amount: order.amount,
      paidAt: order.paidAt,
      digitalAccessUrl,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to check status" }, { status: 500 });
  }
}
