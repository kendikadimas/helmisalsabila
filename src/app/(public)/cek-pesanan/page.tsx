import Link from "next/link";
import { eq, or } from "drizzle-orm";
import { Search, CheckCircle2, Clock, XCircle, ExternalLink, ArrowRight, Package } from "lucide-react";
import { db, schema } from "@/db";
import { formatRupiah, formatDateIndo } from "@/lib/utils";
import { getSiteSettings } from "@/actions/settings";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cek Status Pesanan",
  description: "Lacak status transaksi dan akses produk digital Anda dengan nomor invoice atau email.",
};

function maskEmail(email: string): string {
  const [user, domain] = (email || "").split("@");
  if (!user || !domain) return "***";
  const visible = user.slice(0, Math.min(2, user.length));
  return `${visible}***@${domain}`;
}

export default async function CekPesananPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q || "").trim();

  let ordersList: (typeof schema.orders.$inferSelect)[] = [];

  // Security: Only lookup by exact Invoice Number on public /cek-pesanan to prevent email enumeration & download theft
  if (query) {
    ordersList = await db
      .select()
      .from(schema.orders)
      .where(
        or(
          eq(schema.orders.invoiceNumber, query),
          eq(schema.orders.invoiceNumber, query.toUpperCase())
        )
      )
      .limit(5);
  }

  const settings = await getSiteSettings();
  const contactPhone = settings?.contactPhone || "+6269233221";

  return (
    <div className="min-h-[75vh] py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold">
          <Package className="w-3.5 h-3.5" />
          <span>Tracking Pesanan Digital</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cek Status Pesanan</h1>
        <p className="text-sm text-slate-500">
          Masukkan nomor invoice (contoh: <code className="text-teal-600 bg-slate-100 px-1 py-0.5 rounded">INV-...</code>)
          untuk melacak status pembayaran. Untuk mengunduh materi produk, silakan masuk ke{" "}
          <Link href="/dashboard" className="text-teal-700 font-semibold underline">
            Dashboard Produk Saya
          </Link>
          .
        </p>
      </div>

      {/* Search Bar */}
      <form method="GET" action="/cek-pesanan" className="max-w-xl mx-auto mb-10">
        <div className="relative flex items-center">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Masukkan nomor invoice (INV-...)..."
            required
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm text-slate-900 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all font-mono"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Cari
          </button>
        </div>
      </form>

      {/* Results */}
      {query ? (
        ordersList.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4 max-w-md mx-auto shadow-xs">
            <XCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-base">Pesanan Tidak Ditemukan</h3>
              <p className="text-xs text-slate-500">
                Tidak ada pesanan yang cocok dengan <span className="font-semibold text-slate-700">&quot;{query}&quot;</span>.
                Pastikan nomor invoice atau email sudah benar.
              </p>
            </div>
            <a
              href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                `Halo Admin, saya mencari pesanan saya dengan kata kunci: ${query}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 pt-2"
            >
              <WhatsAppIcon className="w-4 h-4" fill="currentColor" />
              <span>Butuh Bantuan? Hubungi Kami</span>
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-medium text-slate-500">
              Menampilkan {ordersList.length} pesanan untuk: <strong className="text-slate-800">{query}</strong>
            </p>
            {ordersList.map((order) => {
              const isPaid = order.status === "PAID";
              const isPending = order.status === "PENDING";

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all space-y-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="space-y-0.5">
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                        Invoice
                      </div>
                      <div className="font-mono text-sm font-bold text-slate-900">
                        {order.invoiceNumber}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          isPaid
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : isPending
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {isPaid ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : isPending ? (
                          <Clock className="w-3.5 h-3.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        <span>{order.status}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <div className="text-slate-400 mb-0.5">Item</div>
                      <div className="font-semibold text-slate-800 line-clamp-2">{order.itemTitle}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 mb-0.5">Total Bayar</div>
                      <div className="font-bold text-emerald-700 text-sm">
                        {formatRupiah(parseFloat(String(order.amount)))}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 mb-0.5">Pembeli</div>
                      <div className="font-medium text-slate-700 truncate">{order.customerName}</div>
                      <div className="text-[11px] text-slate-400 truncate">{maskEmail(order.customerEmail)}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 mb-0.5">Waktu Transaksi</div>
                      <div className="font-medium text-slate-700">{formatDateIndo(order.createdAt)}</div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
                    {isPaid && (
                      <Link
                        href="/dashboard"
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Masuk Dashboard untuk Akses Produk</span>
                      </Link>
                    )}

                    {isPending && order.paymentUrl && (
                      <a
                        href={order.paymentUrl}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <span>Lanjutkan Pembayaran DOKU</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <a
                      href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Halo Admin, saya konfirmasi pesanan invoice ${order.invoiceNumber} (${order.itemTitle})`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" />
                      <span>Bantuan WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-base">Mudah, Cepat, dan Transparan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Anda tidak perlu login ke akun. Cukup masukkan email atau invoice untuk melihat status pembayaran DOKU dan
              mengunduh materi produk yang telah dibeli.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/produk"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800"
            >
              <span>Jelajahi Produk Digital Lainnya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

