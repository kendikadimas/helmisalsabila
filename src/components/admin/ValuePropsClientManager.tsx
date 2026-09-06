"use client";

import { useState } from "react";
import { Plus, Trash2, Edit3, Award } from "lucide-react";
import EditModal from "@/components/EditModal";
import { createValueProp, updateValueProp, deleteValueProp } from "@/actions/worksteps";

interface ValuePropItem {
  id: string;
  title: string;
  description: string;
  icon3dName: string;
}

export default function ValuePropsClientManager({ initialItems }: { initialItems: ValuePropItem[] }) {
  const [items, setItems] = useState<ValuePropItem[]>(initialItems);
  const [editingItem, setEditingItem] = useState<ValuePropItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await createValueProp(formData);
    setIsSubmitting(false);
    if (res.success) {
      window.location.reload();
    } else {
      alert(res.error || "Gagal menambah keunggulan.");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateValueProp(editingItem.id, formData);
    setIsSubmitting(false);
    if (res.success) {
      setEditingItem(null);
      window.location.reload();
    } else {
      alert(res.error || "Gagal memperbarui keunggulan.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus keunggulan ini?")) return;
    const res = await deleteValueProp(id);
    if (res.success) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      alert(res.error || "Gagal menghapus.");
    }
  };

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Kenapa Memilih Layanan Saya</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola poin-poin keunggulan nilai (Value Propositions) yang tampil di landing page.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-700 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto font-medium shadow-xs">
          {items.length} Keunggulan
        </span>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Plus className="w-5 h-5 text-teal-600" />
          <span>Tambah Keunggulan Baru</span>
        </h2>

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-slate-700 font-medium">Judul Keunggulan</label>
            <input
              type="text"
              name="title"
              required
              placeholder="Contoh: Harga Terjangkau & Negosiabel"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 font-medium">Icon Visual</label>
            <select
              name="icon3dName"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600"
            >
              <option value="money-bag">Kantong Uang (Harga)</option>
              <option value="medal">Medali Juara (Kualitas)</option>
              <option value="handshake">Jabat Tangan (Dipercaya)</option>
              <option value="users">Tim / Komunitas</option>
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-3">
            <label className="text-slate-700 font-medium">Deskripsi Penjelasan</label>
            <textarea
              name="description"
              rows={2}
              required
              placeholder="Deskripsikan alasan mengapa klien harus memilih Anda..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 leading-relaxed"
            />
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Keunggulan"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Judul Keunggulan</th>
                <th className="p-4">Icon Type</th>
                <th className="p-4">Deskripsi</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((it) => (
                <tr key={it.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-slate-900">{it.title}</td>
                  <td className="p-4 font-mono text-slate-500 text-xs">{it.icon3dName}</td>
                  <td className="p-4 text-slate-600 max-w-md">{it.description}</td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditingItem(it)}
                      className="p-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors border border-amber-200 cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(it.id)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer border border-rose-200"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title={`Edit Keunggulan: ${editingItem?.title || ""}`}
      >
        {editingItem && (
          <form onSubmit={handleUpdate} className="space-y-4 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <label className="text-slate-700 font-medium">Judul Keunggulan</label>
              <input
                type="text"
                name="title"
                required
                defaultValue={editingItem.title}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-medium">Icon Visual</label>
              <select
                name="icon3dName"
                defaultValue={editingItem.icon3dName}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600"
              >
                <option value="money-bag">Kantong Uang (Harga)</option>
                <option value="medal">Medali Juara (Kualitas)</option>
                <option value="handshake">Jabat Tangan (Dipercaya)</option>
                <option value="users">Tim / Komunitas</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-medium">Deskripsi Penjelasan</label>
              <textarea
                name="description"
                rows={3}
                required
                defaultValue={editingItem.description}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 leading-relaxed"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm disabled:opacity-50"
              >
                {isSubmitting ? "Menyimpan..." : "Perbarui"}
              </button>
            </div>
          </form>
        )}
      </EditModal>
    </div>
  );
}
