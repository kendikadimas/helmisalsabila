import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { getSiteSettings } from "@/actions/settings";
import PaymentStatusLiveManager from "@/components/PaymentStatusLiveManager";

export const dynamic = "force-dynamic";

export default async function PaymentStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ invoice?: string; cancelled?: string }>;
}) {
  const params = await searchParams;
  const invoice = params.invoice || "";
  const isCancelled = params.cancelled === "1";

  const [order] = invoice
    ? await db.select().from(schema.orders).where(eq(schema.orders.invoiceNumber, invoice)).limit(1)
    : [];

  let digitalAccessUrl: string | null = null;
  if (order && order.status === "PAID" && order.itemType === "product") {
    const [prod] = await db
      .select({
        purchaseLinkExternal: schema.products.purchaseLinkExternal,
        liveDemoUrl: schema.products.liveDemoUrl,
      })
      .from(schema.products)
      .where(eq(schema.products.id, order.itemId))
      .limit(1);

    if (prod) {
      digitalAccessUrl = prod.purchaseLinkExternal || prod.liveDemoUrl || null;
    }
  }

  const settings = await getSiteSettings();
  const contactPhone = settings?.contactPhone || "+6269233221";

  const orderData = order
    ? {
        invoiceNumber: order.invoiceNumber,
        itemId: order.itemId,
        itemTitle: order.itemTitle,
        itemType: order.itemType as "product" | "service",
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        amount: parseFloat(String(order.amount)),
        status: (isCancelled ? "FAILED" : order.status) as "PENDING" | "PAID" | "FAILED" | "EXPIRED",
        createdAt: order.createdAt.toISOString(),
        digitalAccessUrl,
      }
    : null;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <PaymentStatusLiveManager initialOrder={orderData} contactPhone={contactPhone} />
    </div>
  );
}
