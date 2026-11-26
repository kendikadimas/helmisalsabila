"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
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
      {/* Printable Invoice Sheet (Only visible when printing) */}
      {order && (
        <div className="hidden print:block fixed inset-0 bg-white p-8 z-[99999] text-slate-900 font-sans">
          <div className="max-w-xl mx-auto border border-slate-300 rounded-2xl p-8 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-200 pb-6">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Helmi Salsabila</h1>
                <p className="text-xs text-slate-500">Bukti Pembayaran Resmi</p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    isPaid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {isPaid ? "LUNAS / BERHASIL" : status}
                </span>
                <p className="text-xs text-slate-400 font-mono mt-1">{order.invoiceNumber}</p>
              </div>
            </div>

            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2.5 text-slate-500">Nama Pembeli</td>
                  <td className="py-2.5 font-semibold text-right">{order.customerName}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2.5 text-slate-500">Email</td>
                  <td className="py-2.5 text-right">{order.customerEmail}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2.5 text-slate-500">Item Pesanan</td>
                  <td className="py-2.5 font-bold text-right">{order.itemTitle}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2.5 text-slate-500">Metode Pembayaran</td>
                  <td className="py-2.5 text-right">DOKU Payment Gateway</td>
                </tr>
                <tr className="border-b border-slate-200 text-sm">
                  <td className="py-3 font-bold text-slate-900">Total Pembayaran</td>
                  <td className="py-3 font-extrabold text-emerald-700 text-right">
                    {formatRupiah(order.amount)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="text-center text-[11px] text-slate-400 pt-4 border-t border-slate-100">
              Terima kasih atas pesanan Anda. Disimpan secara elektronik oleh sistem Helmi Salsabila.
            </div>
          </div>
        </div>
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
