"use server";

import { db, schema } from "@/db";
import { eq, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

export async function getAllOrdersAdmin() {
  try {
    const session = await getSession();
    if (!session) return [];

    const orders = await db
      .select()
      .from(schema.orders)
      .orderBy(desc(schema.orders.createdAt));

    return orders.map((o) => ({
      ...o,
      amount: parseFloat(String(o.amount || 0)),
      createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: o.updatedAt ? new Date(o.updatedAt).toISOString() : new Date().toISOString(),
      paidAt: o.paidAt ? new Date(o.paidAt).toISOString() : null,
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function markOrderAsPaidAction(orderId: string) {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: "Unauthorized" };

    const [order] = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.id, orderId))
      .limit(1);

    if (!order) return { success: false, error: "Order tidak ditemukan" };

    const wasAlreadyPaid = order.status === "PAID";

    await db
      .update(schema.orders)
      .set({
        status: "PAID",
        paidAt: new Date(),
      })
      .where(eq(schema.orders.id, orderId));

    if (!wasAlreadyPaid && order.itemType === "product") {
      await db
        .update(schema.products)
        .set({ totalSales: sql`${schema.products.totalSales} + 1` })
        .where(eq(schema.products.id, order.itemId));
    }

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { success: true, message: `Order ${order.invoiceNumber} berhasil ditandai LUNAS!` };
  } catch (error: any) {
    return { success: false, error: error.message || "Gagal mengubah status pesanan" };
  }
}
