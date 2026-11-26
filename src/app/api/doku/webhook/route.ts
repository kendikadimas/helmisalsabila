import { NextResponse } from "next/server";
import crypto from "crypto";
import { eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { getDokuConfig, verifyDokuSignature } from "@/lib/doku";
import { sendOrderPaidEmail, sendAdminNewOrderNotification } from "@/lib/email";
import { getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const { clientId: expectedClientId, secretKey } = getDokuConfig();

    const clientId = req.headers.get("client-id") || "";
    const requestId = req.headers.get("request-id") || "";
    const requestTimestamp = req.headers.get("request-timestamp") || "";
    const receivedSignature = req.headers.get("signature") || "";

    if (!expectedClientId || clientId !== expectedClientId) {
      return NextResponse.json({ error: "Invalid client-id" }, { status: 401 });
    }

    const isValid = verifyDokuSignature({
      clientId,
      requestId,
      requestTimestamp,
      requestTarget: "/api/doku/webhook",
      requestBody: rawBody,
      secretKey,
      receivedSignature,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const invoiceNumber = payload?.order?.invoice_number as string | undefined;
    const txStatus = (payload?.transaction?.status as string | undefined)?.toUpperCase();
    const dokuTxId = (payload?.transaction?.original_request_id || requestId) as string;

    if (!invoiceNumber) {
      return NextResponse.json({ error: "Missing invoice_number" }, { status: 400 });
    }

    const [order] = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.invoiceNumber, invoiceNumber))
      .limit(1);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const newStatus: "PAID" | "FAILED" | "EXPIRED" | "PENDING" =
      txStatus === "SUCCESS"
        ? "PAID"
        : txStatus === "EXPIRED"
          ? "EXPIRED"
          : txStatus === "FAILED"
            ? "FAILED"
            : "PENDING";

    const wasAlreadyPaid = order.status === "PAID";

    // Security: Verify paid amount matches order amount in DB
    const webhookAmount = Number(payload?.order?.amount || 0);
    const expectedAmount = Math.round(parseFloat(String(order.amount || 0)));
    if (newStatus === "PAID" && webhookAmount > 0 && webhookAmount !== expectedAmount) {
      console.error(
        `[DOKU Webhook] Amount mismatch for ${invoiceNumber}: expected ${expectedAmount}, got ${webhookAmount}`
      );
      return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
    }

    // Security: Never downgrade an already PAID order if a late EXPIRED/FAILED webhook arrives
    const effectiveStatus = wasAlreadyPaid ? "PAID" : newStatus;

    await db
      .update(schema.orders)
      .set({
        status: effectiveStatus,
        dokuTransactionId: dokuTxId,
        paidAt: effectiveStatus === "PAID" && !wasAlreadyPaid ? new Date() : order.paidAt,
      })
      .where(eq(schema.orders.id, order.id));

    let digitalAccessUrl: string | null = null;

    if (newStatus === "PAID" && !wasAlreadyPaid && order.itemType === "product") {
      const [product] = await db
        .select()
        .from(schema.products)
        .where(eq(schema.products.id, order.itemId))
        .limit(1);

      if (product) {
        digitalAccessUrl = product.digitalAccessUrl || product.purchaseLinkExternal || product.liveDemoUrl || null;
        await db
          .update(schema.products)
          .set({ totalSales: sql`${schema.products.totalSales} + 1` })
          .where(eq(schema.products.id, order.itemId));
      }
    }

    // Audit log webhook transaction
    try {
      await db.insert(schema.webhookLogs).values({
        id: `whl-${crypto.randomUUID().slice(0, 12)}`,
        provider: "doku",
        invoiceNumber,
        status: newStatus,
        payload: rawBody,
        ipAddress: getClientIp(req),
      });
    } catch (logErr: any) {
      console.warn("Failed to write webhook audit log:", logErr.message);
    }

    // Trigger automated email confirmation on successful payment
    if (newStatus === "PAID" && !wasAlreadyPaid) {
      const emailPayload = {
        invoiceNumber: order.invoiceNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        itemTitle: order.itemTitle,
        itemType: order.itemType as "product" | "service",
        amount: parseFloat(String(order.amount)),
        paidAt: new Date(),
        digitalAccessUrl,
      };

      try {
        await Promise.allSettled([
          sendOrderPaidEmail(emailPayload),
          sendAdminNewOrderNotification(emailPayload),
        ]);
      } catch (mailErr: any) {
        console.error("Failed to send order emails:", mailErr.message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DOKU webhook error:", error);
    try {
      await db.insert(schema.webhookLogs).values({
        id: `whl-${crypto.randomUUID().slice(0, 12)}`,
        provider: "doku",
        status: "ERROR",
        payload: "",
        errorMessage: error.message || "Webhook error",
      });
    } catch {}
    return NextResponse.json({ error: error.message || "Webhook error" }, { status: 500 });
  }
}

