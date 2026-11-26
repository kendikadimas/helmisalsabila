"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Ticket, Edit3 } from "lucide-react";
import EditModal from "@/components/EditModal";
import { formatRupiah } from "@/lib/utils";
import { createVoucher, updateVoucher, toggleVoucher, deleteVoucher, type VoucherItem } from "@/actions/vouchers";

const inputCls =
  "w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors";

function VoucherForm({
  item,
  isSubmitting,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  item?: VoucherItem;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
}) {
  const [type, setType] = useState<"percent" | "fixed">(item?.type || "percent");

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm">
      <div className="space-y-1.5">
        <label className="text-slate-700 font-medium">Kode Voucher</label>
        <input
          name="code"
          required
          defaultValue={item?.code}
          placeholder="Contoh: HELMI20"
          maxLength={30}
          className={`${inputCls} font-mono uppercase`}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-slate-700 font-medium">Tipe Diskon</label>
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as "percent" | "fixed")}
          className={inputCls}
        >
          <option value="percent">Persen (%)</option>
          <option value="fixed">Nominal (Rp)</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-slate-700 font-medium">Nilai {type === "percent" ? "(1-100 %)" : "(Rp)"}</label>
        <input
          name="value"
          type="number"
          min={1}
          max={type === "percent" ? 100 : undefined}
          required
          defaultValue={item?.value}
          placeholder={type === "percent" ? "20" : "25000"}
          className={inputCls}
        />
      </div>

      <div className="space-y-1.5 md:col-span-3">
        <label className="text-slate-700 font-medium">Deskripsi (catatan internal)</label>
        <input name="description" defaultValue={item?.description} placeholder="Contoh: Promo Harbolnas" className={inputCls} />
      </div>

      <div className="space-y-1.5">
        <label className="text-slate-700 font-medium">Minimal Belanja (Rp, opsional)</label>
        <input name="minPurchase" type="number" min={0} defaultValue={item?.minPurchase || ""} placeholder="0" className={inputCls} />
      </div>

      <div className="space-y-1.5">
        <label className="text-slate-700 font-medium">Maks. Potongan (Rp, khusus %)</label>
        <input
          name="maxDiscount"
          type="number"
          min={0}
          disabled={type === "fixed"}
          defaultValue={item?.maxDiscount ?? ""}
          placeholder="Tanpa batas"
          className={`${inputCls} disabled:bg-slate-50 disabled:text-slate-400`}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-slate-700 font-medium">Kuota Pemakaian (opsional)</label>
        <input name="quota" type="number" min={0} defaultValue={item?.quota ?? ""} placeholder="Tanpa batas" className={inputCls} />
      </div>

      <div className="space-y-1.5">
        <label className="text-slate-700 font-medium">Mulai Berlaku (opsional)</label>
        <input name="startsAt" type="date" defaultValue={item?.startsAt} className={inputCls} />
      </div>

      <div className="space-y-1.5">
        <label className="text-slate-700 font-medium">Berakhir (opsional)</label>
        <input name="expiresAt" type="date" defaultValue={item?.expiresAt} className={inputCls} />
      </div>

      <label className="flex items-center gap-2.5 md:self-end pb-3 text-slate-700 font-medium cursor-pointer">
        <input
          name="isActive"
          type="checkbox"
          defaultChecked={item ? item.isActive : true}
          className="w-4 h-4 accent-teal-600"
        />
        Voucher aktif
      </label>

      <div className="md:col-span-3 flex justify-end gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs disabled:opacity-50"
        >
          {isSubmitting ? "Menyimpan..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

function statusOf(v: VoucherItem) {
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Jakarta" });
  if (!v.isActive) return { label: "Nonaktif", cls: "bg-slate-100 text-slate-600 border-slate-200" };
  if (v.expiresAt && v.expiresAt < today) return { label: "Kedaluwarsa", cls: "bg-rose-50 text-rose-700 border-rose-200" };
  if (v.startsAt && v.startsAt > today) return { label: "Terjadwal", cls: "bg-amber-50 text-amber-700 border-amber-200" };
  if (v.quota !== null && v.used >= v.quota) return { label: "Kuota habis", cls: "bg-rose-50 text-rose-700 border-rose-200" };
  return { label: "Aktif", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
}

export default function VouchersClientManager({ initialVouchers }: { initialVouchers: VoucherItem[] }) {
  const router = useRouter();
  const [editingItem, setEditingItem] = useState<VoucherItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createKey, setCreateKey] = useState(0);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await createVoucher(new FormData(e.currentTarget));
    setIsSubmitting(false);
    if (res.success) {
      setCreateKey((k) => k + 1);
      router.refresh();
    } else {
      alert(res.error || "Gagal membuat voucher.");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSubmitting(true);
    const res = await updateVoucher(editingItem.id, new FormData(e.currentTarget));
    setIsSubmitting(false);
    if (res.success) {
      setEditingItem(null);
      router.refresh();
    } else {
      alert(res.error || "Gagal memperbarui voucher.");
    }
  };

  const handleToggle = async (v: VoucherItem) => {
    const res = await toggleVoucher(v.id, !v.isActive);
    if (res.success) router.refresh();
    else alert(res.error);
  };

  const handleDelete = async (v: VoucherItem) => {
    if (!confirm(`Hapus voucher ${v.code}? Riwayat pemakaian pesanan lama tidak terhapus.`)) return;
    const res = await deleteVoucher(v.id);
    if (res.success) router.refresh();
    else alert(res.error);
  };

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Kelola Voucher</h1>
          <p className="text-sm text-slate-500 mt-1">Buat kode promo untuk checkout DOKU, lengkap dengan kuota dan masa berlaku.</p>
        </div>
        <span className="text-xs font-mono text-slate-700 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto font-medium shadow-xs">
          {initialVouchers.length} Voucher
        </span>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Plus className="w-5 h-5 text-teal-600" />
          <span>Tambah Voucher Baru</span>
        </h2>
        <VoucherForm key={createKey} isSubmitting={isSubmitting} submitLabel="Simpan Voucher" onSubmit={handleCreate} />
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Kode</th>
                <th className="p-4">Diskon</th>
                <th className="p-4">Syarat</th>
                <th className="p-4">Terpakai</th>
                <th className="p-4">Periode</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initialVouchers.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Belum ada voucher. Jika baru deploy, jalankan dulu <code>cpanel-patch-vouchers.sql</code>.
                  </td>
                </tr>
              )}
              {initialVouchers.map((v) => {
                const st = statusOf(v);
                return (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-mono font-bold text-slate-900 flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-teal-600" />
                        {v.code}
                      </div>
                      {v.description && <div className="text-[11px] text-slate-500 mt-0.5">{v.description}</div>}
                    </td>
                    <td className="p-4 font-semibold">
                      {v.type === "percent" ? `${v.value}%` : formatRupiah(v.value)}
                      {v.type === "percent" && v.maxDiscount ? (
                        <div className="text-[11px] font-normal text-slate-500">maks. {formatRupiah(v.maxDiscount)}</div>
                      ) : null}
                    </td>
                    <td className="p-4 text-slate-600">{v.minPurchase > 0 ? `Min. ${formatRupiah(v.minPurchase)}` : "-"}</td>
                    <td className="p-4 font-mono">
                      {v.used}
                      {v.quota !== null ? ` / ${v.quota}` : " / ∞"}
                    </td>
                    <td className="p-4 text-slate-600 whitespace-nowrap">
                      {v.startsAt || v.expiresAt ? `${v.startsAt || "…"} s/d ${v.expiresAt || "…"}` : "Tanpa batas"}
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleToggle(v)}
                        title="Klik untuk aktif/nonaktifkan"
                        className={`px-2.5 py-1 rounded-md border text-xs font-semibold cursor-pointer ${st.cls}`}
                      >
                        {st.label}
                      </button>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setEditingItem(v)}
                        className="inline-flex p-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors border border-amber-200 cursor-pointer"
                        title="Edit Voucher"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(v)}
                        className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer border border-rose-200"
                        title="Hapus Voucher"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <EditModal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title={`Edit Voucher: ${editingItem?.code || ""}`}>
        {editingItem && (
          <VoucherForm
            key={editingItem.id}
            item={editingItem}
            isSubmitting={isSubmitting}
            submitLabel="Perbarui Voucher"
            onSubmit={handleUpdate}
            onCancel={() => setEditingItem(null)}
          />
        )}
      </EditModal>
    </div>
  );
}
