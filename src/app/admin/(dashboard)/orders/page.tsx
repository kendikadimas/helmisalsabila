import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { formatRupiah, formatDateIndo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt));

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Transaksi DOKU</h1>
          <p className="text-sm text-slate-500 mt-1">Riwayat checkout dan status pembayaran payment gateway DOKU.</p>
        </div>
        <span className="text-xs font-mono text-slate-700 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto font-medium shadow-xs">
          {orders.length} Transaksi
        </span>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Invoice</th>
                <th className="p-4">Item</th>
                <th className="p-4">Pembeli</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Belum ada transaksi DOKU.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-6 font-mono font-semibold text-slate-900">{ord.invoiceNumber}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{ord.itemTitle}</div>
                      <div className="text-[11px] text-slate-400 uppercase">{ord.itemType}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{ord.customerName}</div>
                      <div className="text-xs text-slate-500">{ord.customerEmail} • {ord.customerPhone}</div>
                    </td>
                    <td className="p-4 font-mono font-bold text-teal-700">{formatRupiah(ord.amount)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          ord.status === "PAID"
                            ? "bg-emerald-100 text-emerald-700"
                            : ord.status === "PENDING"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-slate-500 font-mono text-xs">{formatDateIndo(ord.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

