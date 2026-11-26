"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Receipt,
  LogOut,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronDown,
  FileText,
  KeyRound,
  Mail,
  Loader2,
  AlertCircle,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { formatRupiah, formatDateIndo } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import {
  customerLoginAction,
  customerLogoutAction,
  type CustomerOwnedOrder,
} from "@/actions/customer";

interface CustomerDashboardClientProps {
  session: { email: string; name: string } | null;
  orders: CustomerOwnedOrder[];
  contactPhone: string;
}

export default function CustomerDashboardClient({
  session,
  orders,
  contactPhone,
}: CustomerDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"products" | "history">("products");
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const res = await customerLoginAction(formData);
      if (!res.success) {
        setError(res.error || "Gagal masuk ke dashboard.");
        setIsSubmitting(false);
        return;
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan jaringan.");
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await customerLogoutAction();
    router.refresh();
  };

  const toggleModuleList = (orderId: string) => {
    setExpandedModules((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  // --- NOT LOGGED IN: SIMPLE PASSWORDLESS LOGIN CARD ---
  if (!session) {
    return (
      <div className="min-h-[72vh] flex items-center justify-center px-4 py-14">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#38BDF8] p-7 sm:p-9 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#E6FAF8] border border-[#99F6E4] text-[#2A5D69] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Dashboard Produk Saya
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Masuk tanpa password cukup menggunakan <strong>Email</strong> dan <strong>Nomor Invoice</strong> pembelian Anda.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="cust-email" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#2A5D69]" />
                <span>Alamat Email</span>
              </label>
              <input
                id="cust-email"
                name="email"
                type="email"
                required
                placeholder="email@contoh.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-[#2A5D69]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="cust-invoice" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#2A5D69]" />
                <span>Nomor Invoice</span>
              </label>
              <input
                id="cust-invoice"
                name="invoiceNumber"
                type="text"
                required
                placeholder="INV-1700000000-XXXX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-mono uppercase text-slate-900 focus:outline-none focus:border-[#2A5D69]"
              />
              <p className="text-[11px] text-slate-400">
                Nomor invoice dikirim ke email Anda saat checkout.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#1E3A5F] hover:bg-[#152A45] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center space-y-2 text-xs text-slate-500">
            <p>Lupa nomor invoice atau butuh bantuan?</p>
            <a
              href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                "Halo Admin, saya lupa nomor invoice untuk masuk ke Dashboard Produk Saya."
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" fill="currentColor" />
              <span>Hubungi Admin via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // --- LOGGED IN: SIMPLE CUSTOMER DASHBOARD ---
  const paidOrders = orders.filter((o) => o.status === "PAID");
  const pendingOrders = orders.filter((o) => o.status === "PENDING");

  return (
    <div className="min-h-[75vh] py-10 sm:py-12">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px] space-y-8">
        {/* Top Greeting Banner */}
        <div className="bg-gradient-to-br from-[#FFFDF5] via-[#F2FCFB] to-[#DDF6F5] rounded-3xl border border-[#99F6E4] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#99F6E4] text-[#2A5D69] text-[11px] font-semibold">
              <span>Member Area</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Halo, {session.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">{session.email}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 self-start sm:self-auto transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span>Keluar</span>
          </button>
        </div>

        {/* 3 Compact Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-2xs">
            <div>
              <div className="text-xs text-slate-500 font-medium">Produk &amp; Layanan Dimiliki</div>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">{paidOrders.length}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-2xs">
            <div>
              <div className="text-xs text-slate-500 font-medium">Menunggu Pembayaran</div>
              <div className="text-2xl font-extrabold text-amber-600 mt-1">{pendingOrders.length}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-2xs">
            <div>
              <div className="text-xs text-slate-500 font-medium">Total Transaksi</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{orders.length}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#E6FAF8] text-[#2A5D69] flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Simple Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              activeTab === "products"
                ? "bg-[#1E3A5F] text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Produk Saya ({paidOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              activeTab === "history"
                ? "bg-[#1E3A5F] text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Riwayat Transaksi ({orders.length})</span>
          </button>
        </div>

        {/* TAB 1: OWNED PRODUCTS */}
        {activeTab === "products" && (
          <div>
            {paidOrders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-3">
                <Package className="w-11 h-11 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">Belum Ada Produk Lunas</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Produk digital atau layanan yang pembayarannya sudah terverifikasi <strong>PAID</strong> akan otomatis muncul di sini.
                </p>
                <div className="pt-2">
                  <Link
                    href="/produk"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E3A5F] text-white text-xs font-bold hover:bg-[#152A45] transition-colors"
                  >
                    <span>Jelajahi Produk Digital</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paidOrders.map((ord) => {
                  const isExpanded = !!expandedModules[ord.id];
                  return (
                    <div
                      key={ord.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between space-y-4 shadow-xs"
                    >
                      <div className="space-y-3.5">
                        <div className="aspect-[16/10] bg-slate-100 rounded-xl overflow-hidden relative">
                          {ord.thumbnailUrl ? (
                            <img
                              src={ord.thumbnailUrl}
                              alt={ord.itemTitle}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#1E3A5F] text-white flex items-center justify-center p-4 text-center text-xs font-bold">
                              {ord.itemTitle}
                            </div>
                          )}
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                            DIMILIKI • LUNAS
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="text-[11px] font-mono text-slate-400">
                            {ord.invoiceNumber} • {formatDateIndo(ord.paidAt || ord.createdAt)}
                          </div>
                          <h3 className="font-bold text-slate-900 text-sm leading-snug">{ord.itemTitle}</h3>
                        </div>

                        {/* Collapsible Curriculum Modules if Product has Modules */}
                        {ord.modules.length > 0 && (
                          <div className="border border-slate-200 rounded-xl overflow-hidden">
                            <button
                              type="button"
                              onClick={() => toggleModuleList(ord.id)}
                              className="w-full px-3.5 py-2.5 bg-[#E6FAF8]/70 text-xs font-bold text-[#1E3A5F] flex items-center justify-between cursor-pointer"
                            >
                              <span>Daftar Materi ({ord.modules.length} Modul)</span>
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </button>
                            {isExpanded && (
                              <div className="p-3 space-y-2.5 text-xs bg-white max-h-56 overflow-y-auto">
                                {ord.modules.map((mod) => (
                                  <div key={mod.id} className="space-y-1">
                                    <div className="font-bold text-slate-800">
                                      {mod.moduleNumber} — {mod.title}
                                    </div>
                                    <div className="pl-2 space-y-1">
                                      {mod.lessons.map((lsn) => (
                                        <div key={lsn.id} className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                                          <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                                          <span>{lsn.title}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        {ord.digitalAccessUrl ? (
                          <a
                            href={ord.digitalAccessUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Akses / Unduh Materi</span>
                          </a>
                        ) : (
                          <a
                            href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                              `Halo Admin, saya sudah melunasi invoice ${ord.invoiceNumber} (${ord.itemTitle}) dan ingin meminta link akses materinya.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" fill="currentColor" />
                            <span>Minta Akses ke Admin</span>
                          </a>
                        )}

                        <Link
                          href={`/payment/status?invoice=${encodeURIComponent(ord.invoiceNumber)}`}
                          className="w-full py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Receipt className="w-3.5 h-3.5 text-slate-400" />
                          <span>Lihat &amp; Cetak Struk</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORDER HISTORY */}
        {activeTab === "history" && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-4">Invoice</th>
                    <th className="p-4">Item</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Tanggal</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/70">
                      <td className="p-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                        {ord.invoiceNumber}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">{ord.itemTitle}</div>
                        <div className="text-[11px] text-slate-400 uppercase">{ord.itemType}</div>
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-700 whitespace-nowrap">
                        {formatRupiah(ord.amount)}
                      </td>
                      <td className="p-4 whitespace-nowrap">
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
                      <td className="p-4 text-xs text-slate-500 whitespace-nowrap">
                        {formatDateIndo(ord.createdAt)}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          {ord.status === "PENDING" && ord.paymentUrl && (
                            <a
                              href={ord.paymentUrl}
                              className="px-3 py-1.5 rounded-lg bg-[#1E3A5F] hover:bg-[#152A45] text-white text-xs font-bold"
                            >
                              Bayar
                            </a>
                          )}
                          <Link
                            href={`/payment/status?invoice=${encodeURIComponent(ord.invoiceNumber)}`}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                          >
                            Detail
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
