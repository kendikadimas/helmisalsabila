"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Eye,
  Check,
  X,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { formatRupiah, formatDateIndo } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { markOrderAsPaidAction } from "@/actions/orders";

interface OrderItem {
  id: string;
  invoiceNumber: string;
  itemType: "product" | "service";
  itemId: string;
  itemTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED" | "EXPIRED";
  paymentUrl: string | null;
  dokuTransactionId: string | null;
  paidAt: string | null;
  createdAt: string;
}

export default function OrdersClientManager({ initialOrders }: { initialOrders: OrderItem[] }) {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PAID" | "PENDING" | "FAILED">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Stats calculation
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let paidCount = 0;
    let pendingCount = 0;

    for (const o of orders) {
      if (o.status === "PAID") {
        totalRevenue += o.amount;
        paidCount++;
      } else if (o.status === "PENDING") {
        pendingCount++;
      }
    }

    return { totalRevenue, paidCount, pendingCount, totalCount: orders.length };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.itemTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "FAILED"
            ? o.status === "FAILED" || o.status === "EXPIRED"
            : o.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = ["Invoice", "Item", "Tipe", "Pembeli", "Email", "Telepon", "Total (IDR)", "Status", "Tanggal"];
    const rows = filteredOrders.map((o) => [
      o.invoiceNumber,
      `"${o.itemTitle.replace(/"/g, '""')}"`,
      o.itemType,
      `"${o.customerName.replace(/"/g, '""')}"`,
      o.customerEmail,
      `'${o.customerPhone}`,
      o.amount,
      o.status,
      o.createdAt,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan-transaksi-doku-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMarkAsPaid = async (orderId: string) => {
    if (!confirm("Tandai pesanan ini sebagai LUNAS secara manual?")) return;
    setIsProcessing(true);
    setFeedback(null);
    try {
      const res = await markOrderAsPaidAction(orderId);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: "PAID", paidAt: new Date().toISOString() } : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: "PAID" } : null));
        }
        setFeedback({ type: "success", message: res.message || "Status berhasil diubah!" });
      } else {
        setFeedback({ type: "error", message: res.error || "Gagal mengubah status" });
      }
    } catch (e: any) {
      setFeedback({ type: "error", message: e.message || "Terjadi kesalahan" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Transaksi DOKU</h1>
          <p className="text-sm text-slate-500 mt-1">
            Riwayat checkout online, status webhook, dan manajemen pesanan customer.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCSV}
          disabled={filteredOrders.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors shadow-xs cursor-pointer self-start sm:self-auto disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export CSV</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Total Omset Lunas</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{formatRupiah(stats.totalRevenue)}</div>
          <div className="text-[11px] text-slate-400 mt-1">{stats.paidCount} transaksi berhasil</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Transaksi Sukses</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.paidCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Pembayaran terverifikasi</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Menunggu Bayar</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.pendingCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Invoice pending</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Total Checkout</span>
            <CreditCard className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{stats.totalCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Semua status</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          {(
            [
              { id: "ALL", label: "Semua" },
              { id: "PAID", label: "Lunas (PAID)" },
              { id: "PENDING", label: "Menunggu" },
              { id: "FAILED", label: "Gagal / Expired" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-slate-900 text-white"
                  : "bg-transparent text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari invoice / pembeli..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
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
                <th className="p-4">Tanggal</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    {orders.length === 0
                      ? "Belum ada transaksi DOKU yang masuk."
                      : "Tidak ada transaksi yang cocok dengan pencarian / filter."}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-6 font-mono font-semibold text-slate-900">{ord.invoiceNumber}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{ord.itemTitle}</div>
                      <div className="text-[11px] text-slate-400 uppercase">{ord.itemType}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{ord.customerName}</div>
                      <div className="text-xs text-slate-500">
                        {ord.customerEmail} • {ord.customerPhone}
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-teal-700">{formatRupiah(ord.amount)}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          ord.status === "PAID"
                            ? "bg-emerald-100 text-emerald-700"
                            : ord.status === "PENDING"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {ord.status === "PAID" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : ord.status === "PENDING" ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{ord.status}</span>
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-xs">{formatDateIndo(ord.createdAt)}</td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {ord.status === "PENDING" && (
                          <button
                            type="button"
                            onClick={() => handleMarkAsPaid(ord.id)}
                            disabled={isProcessing}
                            className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                            title="Tandai Lunas Manual"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Detail Transaksi DOKU</h3>
                <p className="font-mono text-xs text-slate-400 mt-0.5">{selectedOrder.invoiceNumber}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Status</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                    selectedOrder.status === "PAID"
                      ? "bg-emerald-100 text-emerald-700"
                      : selectedOrder.status === "PENDING"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Item Dibeli</span>
                <span className="font-semibold text-slate-800 text-right">{selectedOrder.itemTitle}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Total Nominal</span>
                <span className="font-bold text-emerald-700">{formatRupiah(selectedOrder.amount)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Nama Pembeli</span>
                <span className="font-medium text-slate-800">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Email</span>
                <span className="text-slate-800">{selectedOrder.customerEmail}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">WhatsApp / HP</span>
                <span className="text-slate-800">{selectedOrder.customerPhone}</span>
              </div>
              {selectedOrder.dokuTransactionId && (
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">DOKU Transaction ID</span>
                  <span className="font-mono text-slate-800">{selectedOrder.dokuTransactionId}</span>
                </div>
              )}
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Waktu Transaksi</span>
                <span className="text-slate-800">{formatDateIndo(selectedOrder.createdAt)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2 border-t border-slate-100">
              <a
                href={`https://wa.me/${selectedOrder.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Halo ${selectedOrder.customerName}, kami dari Helmi Salsabila terkait transaksi invoice ${selectedOrder.invoiceNumber}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" fill="currentColor" />
                <span>Hubungi Pembeli</span>
              </a>

              {selectedOrder.status === "PENDING" && (
                <button
                  type="button"
                  onClick={() => handleMarkAsPaid(selectedOrder.id)}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Tandai Lunas</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
