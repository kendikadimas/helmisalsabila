import Link from "next/link";
import { eq } from "drizzle-orm";
import { CheckCircle2, Clock, XCircle, ArrowLeft, ExternalLink, Search } from "lucide-react";
import { db, schema } from "@/db";
import { formatRupiah, formatDateIndo } from "@/lib/utils";
import { getSiteSettings } from "@/actions/settings";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import PaymentStatusAnalytics from "@/components/PaymentStatusAnalytics";

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

  const status = order?.status || (isCancelled ? "FAILED" : "PENDING");

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      {order && (
        <PaymentStatusAnalytics
          invoiceNumber={order.invoiceNumber}
          itemId={order.itemId}
          itemTitle={order.itemTitle}
          itemType={order.itemType as "product" | "service"}
          amount={parseFloat(String(order.amount))}
          status={status}
        />
      )}

      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 text-center">
        {status === "PAID" ? (
          <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
        ) : status === "FAILED" || status === "EXPIRED" ? (
          <XCircle className="w-14 h-14 text-rose-500 mx-auto" />
        ) : (
          <Clock className="w-14 h-14 text-amber-500 mx-auto" />
        )}

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900">
            {status === "PAID"
              ? "Pembayaran Berhasil!"
              : status === "FAILED" || status === "EXPIRED"
                ? "Pembayaran Dibatalkan / Gagal"
                : "Menunggu Pembayaran"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {status === "PAID"
              ? "Terima kasih! Pesanan Anda telah terkonfirmasi lunas oleh sistem DOKU."
              : status === "FAILED" || status === "EXPIRED"
                ? "Transaksi tidak diselesaikan. Anda dapat mencoba checkout ulang atau menghubungi kami."
                : "Jika Anda sudah melakukan pembayaran, status akan otomatis diperbarui dalam beberapa saat."}
          </p>
        </div>

        {order && (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-left space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">No. Invoice</span>
              <span className="font-mono font-bold text-slate-900">{order.invoiceNumber}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500">Item</span>
              <span className="font-semibold text-slate-900 text-right">{order.itemTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Pembeli</span>
              <span className="text-slate-800">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Pembayaran</span>
              <span className="font-bold text-emerald-700">{formatRupiah(parseFloat(String(order.amount)))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tanggal</span>
              <span className="text-slate-700">{formatDateIndo(order.createdAt)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-500">Status</span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                  status === "PAID"
                    ? "bg-emerald-100 text-emerald-700"
                    : status === "PENDING"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-rose-100 text-rose-700"
                }`}
              >
                {status}
              </span>
            </div>
          </div>
        )}

        {/* Digital Product Delivery Button */}
        {status === "PAID" && digitalAccessUrl && (
          <a
            href={digitalAccessUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Akses / Unduh Produk Digital Sekarang</span>
          </a>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/produk"
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Produk</span>
          </Link>
          <a
            href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              `Halo, saya ingin konfirmasi pesanan invoice: ${invoice || "-"}`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <WhatsAppIcon className="w-4 h-4 text-white" fill="currentColor" />
            <span>Hubungi Admin</span>
          </a>
        </div>

        {order && (
          <div className="pt-2 border-t border-slate-100">
            <Link
              href={`/cek-pesanan?q=${encodeURIComponent(order.invoiceNumber)}`}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-700 font-medium"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Simpan & Cek di Halaman Pelacakan Pesanan</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
