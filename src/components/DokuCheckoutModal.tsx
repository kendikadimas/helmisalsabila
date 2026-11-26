"use client";

import { useState } from "react";
import { CreditCard, X, Loader2, AlertCircle, ShieldCheck, Tag, Check } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { trackBeginCheckout } from "@/lib/analytics";
import type { PromoResult } from "@/lib/promo";

interface DokuCheckoutModalProps {
  itemType: "product" | "service";
  itemId: string;
  itemTitle: string;
  amount: string | number;
  buttonLabel?: string;
  className?: string;
}

export default function DokuCheckoutModal({
  itemType,
  itemId,
  itemTitle,
  amount,
  buttonLabel = "Beli Sekarang (DOKU)",
  className = "w-full py-3.5 px-4 rounded-xl bg-[#1E3A5F] hover:bg-[#162E4A] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer",
}: DokuCheckoutModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoResult | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numericAmount = parseFloat(String(amount || "0"));
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return null;
  }

  const effectiveAmount = appliedPromo?.finalAmount || numericAmount;

  const handleApplyPromo = async () => {
    setPromoError(null);
    if (!promoInput.trim()) return;

    setIsApplyingPromo(true);
    try {
      const r = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput, itemType, itemId }),
      });
      const res: PromoResult = await r.json();
      if (res.valid) {
        setAppliedPromo(res);
      } else {
        setPromoError(res.message);
        setAppliedPromo(null);
      }
    } catch {
      setPromoError("Gagal memeriksa kode promo. Coba lagi.");
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/doku/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemType,
          itemId,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          promoCode: appliedPromo?.code || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Gagal memproses pembayaran DOKU.");
        setIsSubmitting(false);
        return;
      }

      window.location.href = data.paymentUrl;
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan jaringan.");
      setIsSubmitting(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    trackBeginCheckout({
      itemId,
      itemTitle,
      itemType,
      amount: effectiveAmount,
    });
  };

  return (
    <>
      <button type="button" onClick={handleOpen} className={className}>
        <CreditCard className="w-4 h-4" />
        <span>{buttonLabel}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm">Checkout Pembayaran DOKU</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Tutup modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              {/* Item & Price Box */}
              <div className="p-3.5 rounded-xl bg-[#E6FAF8] border border-[#99F6E4] flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] text-slate-500 uppercase font-semibold">
                    {itemType === "product" ? "Produk Digital" : "Layanan"}
                  </div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">{itemTitle}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[11px] text-slate-500">Total</div>
                  {appliedPromo ? (
                    <div>
                      <span className="text-[11px] text-slate-400 line-through mr-1.5">
                        {formatRupiah(numericAmount)}
                      </span>
                      <span className="font-extrabold text-emerald-700 text-sm sm:text-base">
                        {formatRupiah(effectiveAmount)}
                      </span>
                    </div>
                  ) : (
                    <div className="font-extrabold text-emerald-700 text-sm sm:text-base">
                      {formatRupiah(numericAmount)}
                    </div>
                  )}
                </div>
              </div>

              {/* Promo Code Section */}
              <div className="space-y-1.5 pt-0.5">
                <label className="font-medium text-slate-700 text-xs flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-teal-600" />
                  <span>Punya Kode Kupon / Promo?</span>
                </label>
                {appliedPromo ? (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{appliedPromo.message}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="Masukkan kode promo"
                      className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-xs uppercase focus:outline-none focus:border-teal-600"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={isApplyingPromo}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
                    >
                      {isApplyingPromo ? "Memeriksa..." : "Terapkan"}
                    </button>
                  </div>
                )}
                {promoError && <p className="text-[11px] text-rose-600">{promoError}</p>}
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="doku-customer-name" className="font-medium text-slate-700 text-xs">
                  Nama Lengkap
                </label>
                <input
                  id="doku-customer-name"
                  name="customerName"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="doku-customer-email" className="font-medium text-slate-700 text-xs">
                  Alamat Email
                </label>
                <input
                  id="doku-customer-email"
                  name="customerEmail"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi@example.com"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="doku-customer-phone" className="font-medium text-slate-700 text-xs">
                  Nomor WhatsApp / HP
                </label>
                <input
                  id="doku-customer-phone"
                  name="customerPhone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 text-xs sm:text-sm font-mono"
                />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Mendukung QRIS, Virtual Account (BCA, Mandiri, BRI, BNI), E-Wallet, & Kartu Kredit via DOKU.</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <span>Lanjut ke Pembayaran ({formatRupiah(effectiveAmount)})</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
