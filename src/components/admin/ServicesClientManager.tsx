"use client";

import { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { Plus, Trash2, Edit3, ExternalLink } from "lucide-react";
import Link from "next/link";
import EditModal from "@/components/EditModal";
import ImageUploader from "@/components/ImageUploader";
import { createService, updateService, deleteService } from "@/actions/services";

interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  priceStartingAt: string | null;
  shortDescription: string;
  fullDescription: string;
  thumbnailUrl?: string | null;
}

export default function ServicesClientManager({ initialServices }: { initialServices: ServiceItem[] }) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await createService(formData);
    setIsSubmitting(false);
    if (res.success) {
      window.location.reload();
    } else {
      alert(res.error || "Gagal membuat layanan.");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateService(editingItem.id, formData);
    setIsSubmitting(false);
    if (res.success) {
      setEditingItem(null);
      window.location.reload();
    } else {
      alert(res.error || "Gagal memperbarui layanan.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus layanan ini?")) return;
    const res = await deleteService(id);
    if (res.success) {
      setServices((prev) => prev.filter((s) => s.id !== id));
    } else {
      alert(res.error || "Gagal menghapus layanan.");
    }
  };

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Kelola Layanan</h1>
          <p className="text-sm text-slate-500 mt-1">Daftar layanan portofolio & jasa profesional.</p>
        </div>
        <span className="text-xs font-mono text-slate-700 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto font-medium shadow-xs">
          {services.length} Layanan Terdaftar
        </span>
      </div>

      {/* Form Tambah Layanan */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Plus className="w-5 h-5 text-teal-600" />
          <span>Tambah Layanan Baru</span>
        </h2>

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <label className="text-slate-700 font-medium">Judul Layanan</label>
            <input
              type="text"
              name="title"
              required
              placeholder="Contoh: Jasa Data Analyst (Python)"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 font-medium">Harga Mulai (Rp)</label>
            <input
              type="number"
              name="priceStartingAt"
              defaultValue="200000"
              placeholder="200000"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors font-mono"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-slate-700 font-medium">Deskripsi Singkat (Preview Card)</label>
            <input
              type="text"
              name="shortDescription"
              required
              placeholder="Jasa Data Analyst – Olah Data, Visualisasi Dashboard & Insight."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <ImageUploader
              name="thumbnailUrl"
              label="Thumbnail / Cover Gambar Layanan"
              placeholder="Pilih atau upload gambar thumbnail"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-slate-700 font-medium">Deskripsi Lengkap (Markdown)</label>
            <textarea
              name="fullDescription"
              rows={4}
              required
              placeholder="Jelaskan detail layanan, tools yang digunakan, output yang didapatkan..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors leading-relaxed"
            />
          </div>

          <div className="md:col-span-2 flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Layanan"}
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Layanan */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Judul Layanan</th>
                <th className="p-4">Harga Mulai</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 pl-6 font-medium text-slate-900">
                    <div className="font-semibold">{srv.title}</div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">/layanan/{srv.slug}</div>
                  </td>
                  <td className="p-4 font-mono text-teal-700 font-medium">{formatRupiah(srv.priceStartingAt || 0)}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
                      Aktif
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditingItem(srv)}
                      className="inline-flex p-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors border border-amber-200 cursor-pointer"
                      title="Edit Layanan"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <Link
                      href={`/layanan/${srv.slug}`}
                      target="_blank"
                      className="inline-flex p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 shadow-xs"
                      title="Lihat Website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(srv.id)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer border border-rose-200"
                      title="Hapus Layanan"
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
        title={`Edit Layanan: ${editingItem?.title || ""}`}
      >
        {editingItem && (
          <form onSubmit={handleUpdate} className="space-y-4 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <label className="text-slate-700 font-medium">Judul Layanan</label>
              <input
                type="text"
                name="title"
                required
                defaultValue={editingItem.title}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-medium">Harga Mulai (Rp)</label>
              <input
                type="number"
                name="priceStartingAt"
                required
                defaultValue={editingItem.priceStartingAt || "0"}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-medium">Deskripsi Singkat</label>
              <input
                type="text"
                name="shortDescription"
                required
                defaultValue={editingItem.shortDescription}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 transition-colors"
              />
            </div>

            <ImageUploader
              name="thumbnailUrl"
              label="Thumbnail / Cover Gambar Layanan"
              defaultValue={editingItem.thumbnailUrl}
            />

            <div className="space-y-1.5">
              <label className="text-slate-700 font-medium">Deskripsi Lengkap</label>
              <textarea
                name="fullDescription"
                rows={5}
                required
                defaultValue={editingItem.fullDescription}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 transition-colors leading-relaxed"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs sm:text-sm transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? "Menyimpan..." : "Perbarui Layanan"}
              </button>
            </div>
          </form>
        )}
      </EditModal>
    </div>
  );
}
