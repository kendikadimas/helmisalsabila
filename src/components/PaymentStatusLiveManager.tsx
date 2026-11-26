"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  CheckCircle2,
  Clock,
  XCircle,
  ArrowLeft,
  ExternalLink,
  Printer,
  RefreshCw,
  Search,
} from "lucide-react";
import { formatRupiah, formatDateIndo } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { trackPurchase } from "@/lib/analytics";

interface OrderData {
  invoiceNumber: string;
  itemId: string;
  itemTitle: string;
  itemType: "product" | "service";
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED" | "EXPIRED";
  createdAt: string;
  digitalAccessUrl?: string | null;
}

export default function PaymentStatusLiveManager({
  initialOrder,
  contactPhone,
}: {
  initialOrder: OrderData | null;
  contactPhone: string;
}) {
  const [order, setOrder] = useState<OrderData | null>(initialOrder);
  const [status, setStatus] = useState<string>(initialOrder?.status || "PENDING");
  const [digitalUrl, setDigitalUrl] = useState<string | null>(initialOrder?.digitalAccessUrl || null);
  const [isChecking, setIsChecking] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const firePurchaseOnce = useCallback((ord: OrderData) => {
    try {
      const key = `ga_purchased_${ord.invoiceNumber}`;
      if (typeof window !== "undefined" && !window.localStorage.getItem(key)) {
        window.localStorage.setItem(key, "1");
        trackPurchase({
          invoiceNumber: ord.invoiceNumber,
          itemId: ord.itemId,
          itemTitle: ord.itemTitle,
          itemType: ord.itemType,
          amount: ord.amount,
        });
      }
    } catch {
      trackPurchase({
        invoiceNumber: ord.invoiceNumber,
        itemId: ord.itemId,
        itemTitle: ord.itemTitle,
        itemType: ord.itemType,
        amount: ord.amount,
      });
    }
  }, []);

  // Fire purchase event if initial status on page load is already PAID
  useEffect(() => {
    if (status === "PAID" && order?.invoiceNumber) {
      firePurchaseOnce(order);
    }
  }, [status, order, firePurchaseOnce]);

  const checkStatus = useCallback(async () => {
    if (!order?.invoiceNumber) return;
    setIsChecking(true);
    try {
      const res = await fetch(`/api/doku/check-status?invoice=${encodeURIComponent(order.invoiceNumber)}`);
      const data = await res.json();
      if (data.success && data.status) {
        if (data.status !== status) {
          setStatus(data.status);
          if (data.status === "PAID") {
            setDigitalUrl(data.digitalAccessUrl || null);
            firePurchaseOnce(order);
          }
        }
      }
    } catch (e) {
      console.warn("Status check failed:", e);
    } finally {
      setIsChecking(false);
    }
  }, [order, status, firePurchaseOnce]);

  // Auto-poll every 3.5 seconds if status is PENDING (up to 15 cycles)
  useEffect(() => {
    if (status !== "PENDING" || !order?.invoiceNumber || pollCount >= 15) return;

    const timer = setTimeout(() => {
      setPollCount((prev) => prev + 1);
      checkStatus();
    }, 3500);

    return () => clearTimeout(timer);
  }, [status, order, pollCount, checkStatus]);

  // Handle print invoice
  const handlePrint = () => {
    window.print();
  };

  const isPaid = status === "PAID";
  const isPending = status === "PENDING";
  const isFailed = status === "FAILED" || status === "EXPIRED";

  return (
    <>
      {/* Printable Invoice (portal ke body agar hanya invoice yang tercetak, 1 halaman A4) */}
      {order && mounted &&
        createPortal(
          <div id="invoice-print-root" className="hidden print:block bg-white text-slate-900 font-sans">
            <style>{`
              @page { size: A4; margin: 0; }
              @media print {
                body > *:not(#invoice-print-root) { display: none !important; }
                html, body { background: #fff !important; }
                #invoice-print-root { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              }
            `}</style>
            <div className="mx-auto w-[210mm] min-h-[297mm] px-[18mm] py-[16mm] flex flex-col">
              <header className="flex justify-between items-start pb-6 border-b-2 border-slate-900">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight">Helmi Salsabila</h1>
                  <p className="text-[11px] text-slate-500 mt-1">Data &amp; Digital Solutions</p>
                  <p className="text-[11px] text-slate-500">helsenvi.com &middot; admin@helsenvi.com</p>
                  {contactPhone && <p className="text-[11px] text-slate-500">WhatsApp: {contactPhone}</p>}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-extrabold tracking-widest text-slate-900">INVOICE</p>
                  <p className="text-xs font-mono mt-1">{order.invoiceNumber}</p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded text-[11px] font-bold tracking-wide border ${
                      isPaid
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : isPending
                          ? "bg-amber-50 text-amber-800 border-amber-300"
                          : "bg-rose-50 text-rose-800 border-rose-300"
                    }`}
                  >
                    {isPaid ? "LUNAS" : isPending ? "MENUNGGU PEMBAYARAN" : status === "EXPIRED" ? "KEDALUWARSA" : "GAGAL"}
                  </span>
                </div>
              </header>

              <section className="grid grid-cols-2 gap-8 py-6 text-xs">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">Ditagihkan Kepada</p>
                  <p className="font-bold text-sm">{order.customerName}</p>
                  <p className="text-slate-600">{order.customerEmail}</p>
                  {order.customerPhone && <p className="text-slate-600">{order.customerPhone}</p>}
                </div>
                <div className="text-right space-y-1">
                  <p>
                    <span className="text-slate-400">Tanggal Terbit: </span>
                    <span className="font-semibold">{formatDateIndo(order.createdAt)}</span>
                  </p>
                  <p>
                    <span className="text-slate-400">Metode Pembayaran: </span>
                    <span className="font-semibold">DOKU Payment Gateway</span>
                  </p>
                </div>
              </section>

              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-[10px] uppercase tracking-wider">
                    <th className="text-left py-2.5 px-3 font-semibold">Deskripsi</th>
                    <th className="text-center py-2.5 px-3 font-semibold w-14">Qty</th>
                    <th className="text-right py-2.5 px-3 font-semibold w-32">Harga</th>
                    <th className="text-right py-2.5 px-3 font-semibold w-32">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-3.5 px-3">
                      <p className="font-semibold">{order.itemTitle}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {order.itemType === "product" ? "Produk Digital" : "Layanan Jasa"}
                      </p>
                    </td>
                    <td className="py-3.5 px-3 text-center">1</td>
                    <td className="py-3.5 px-3 text-right">{formatRupiah(order.amount)}</td>
                    <td className="py-3.5 px-3 text-right font-semibold">{formatRupiah(order.amount)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-end pt-4">
                <div className="w-64 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>{formatRupiah(order.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t-2 border-slate-900 pt-2 mt-2 text-sm font-extrabold">
                    <span>Total</span>
                    <span>{formatRupiah(order.amount)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                    <span>Status Pembayaran</span>
                    <span className="font-semibold">{isPaid ? "Dibayar" : "Belum dibayar"}</span>
                  </div>
                </div>
              </div>

              <footer className="mt-auto pt-8 border-t border-slate-200 text-[10px] text-slate-400 text-center space-y-0.5">
                <p>Terima kasih atas kepercayaan Anda.</p>
                <p>Dokumen ini diterbitkan secara elektronik dan sah tanpa tanda tangan.</p>
                <p>Pertanyaan terkait invoice? Hubungi kami via WhatsApp dengan menyebutkan nomor invoice.</p>
              </footer>
            </div>
          </div>,
          document.body
        )}
      {/* Screen Card View */}
      <div className="print:hidden w-full max-w-lg bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 text-center">
        {isPaid ? (
          <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto animate-in zoom-in-75 duration-300" />
        ) : isFailed ? (
          <XCircle className="w-14 h-14 text-rose-500 mx-auto" />
        ) : (
          <div className="relative w-14 h-14 mx-auto">
            <Clock className="w-14 h-14 text-amber-500" />
            {isChecking && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            )}
          </div>
        )}

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900">
            {isPaid
              ? "Pembayaran Berhasil!"
              : isFailed
                ? "Pembayaran Dibatalkan / Gagal"
                : "Menunggu Konfirmasi DOKU"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isPaid
              ? "Terima kasih! Pesanan Anda telah terkonfirmasi lunas oleh sistem DOKU."
              : isFailed
                ? "Transaksi tidak diselesaikan atau masa berlaku invoice habis. Anda dapat mencoba checkout ulang."
                : "Sistem sedang memeriksa status transaksi Anda secara berkala..."}
          </p>

          {isPending && (
            <div className="pt-2">
              <button
                type="button"
                onClick={checkStatus}
                disabled={isChecking}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? "animate-spin text-teal-600" : ""}`} />
                <span>{isChecking ? "Memeriksa Status..." : "Periksa Status Sekarang"}</span>
              </button>
            </div>
          )}
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
              <span className="font-bold text-emerald-700">{formatRupiah(order.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tanggal</span>
              <span className="text-slate-700">{formatDateIndo(order.createdAt)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-500">Status</span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                  isPaid
                    ? "bg-emerald-100 text-emerald-700"
                    : isPending
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
        {isPaid && digitalUrl && (
          <a
            href={digitalUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Akses / Unduh Produk Digital Sekarang</span>
          </a>
        )}

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          {order && (
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Cetak Struk / Invoice</span>
            </button>
          )}

          <a
            href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              `Halo Admin, saya konfirmasi pesanan invoice: ${order?.invoiceNumber || "-"}`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <WhatsAppIcon className="w-4 h-4 text-white" fill="currentColor" />
            <span>Bantuan WhatsApp</span>
          </a>
        </div>

        <div className="flex items-center justify-center gap-4 pt-2 border-t border-slate-100 text-xs">
          <Link href="/produk" className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Produk</span>
          </Link>
          {order && (
            <Link
              href="/dashboard"
              className="text-teal-700 hover:text-teal-800 flex items-center gap-1 font-semibold"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Buka Dashboard Produk Saya</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
