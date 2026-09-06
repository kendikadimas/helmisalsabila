"use client";

import { useState } from "react";
import { Plus, Trash2, Edit3, MessageSquareQuote, User, Building } from "lucide-react";
import EditModal from "@/components/EditModal";
import ImageUploader from "@/components/ImageUploader";
import { createTestimonial, updateTestimonial, deleteTestimonial } from "@/actions/testimonials";

interface TestimonialItem {
  id: string;
  clientName: string;
  clientCompany: string;
  avatarUrl?: string | null;
  companyLogoUrl?: string | null;
  quote: string;
  rating?: number;
  orderIndex?: number;
}

export default function TestimonialsClientManager({
  initialTestimonials,
}: {
  initialTestimonials: TestimonialItem[];
}) {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await createTestimonial(formData);
    setIsSubmitting(false);
    if (res.success) {
      window.location.reload();
    } else {
      alert(res.error || "Gagal membuat testimoni.");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("id", editingItem.id);
    const res = await updateTestimonial(formData);
    setIsSubmitting(false);
    if (res.success) {
      setEditingItem(null);
      window.location.reload();
    } else {
      alert(res.error || "Gagal memperbarui testimoni.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus testimoni ini?")) return;
    const res = await deleteTestimonial(id);
    if (res.success) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } else {
      alert(res.error || "Gagal menghapus testimoni.");
    }
  };

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Kelola Testimoni Klien</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tambah, perbarui, atau hapus ulasan kepuasan klien yang tampil di landing page.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-700 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto font-medium shadow-xs">
          {testimonials.length} Testimoni Aktif
        </span>
      </div>

      {/* Form Tambah Testimoni */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Plus className="w-5 h-5 text-teal-600" />
          <span>Tambah Testimoni Baru</span>
        </h2>

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <label className="text-slate-700 font-medium flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              <span>Nama Klien / Tokoh</span>
            </label>
            <input
              type="text"
              name="clientName"
              required
              placeholder="Contoh: Regina"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 font-medium flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-400" />
              <span>Nama Perusahaan / Brand</span>
            </label>
            <input
              type="text"
              name="clientCompany"
              required
              defaultValue="FOOM"
              placeholder="Contoh: FOOM, PT Solusi Data..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <ImageUploader
              name="avatarUrl"
              label="Foto Profil (Avatar Kiri Bawah)"
              defaultValue="/profile-talent.png"
              placeholder="Upload foto profil klien"
            />
          </div>

          <div className="space-y-1.5">
            <ImageUploader
              name="companyLogoUrl"
              label="Logo Perusahaan (Kanan Bawah)"
              defaultValue="/foom-logo.svg"
              placeholder="Upload logo perusahaan"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-slate-700 font-medium flex items-center gap-1.5">
              <MessageSquareQuote className="w-4 h-4 text-teal-600" />
              <span>Isi Testimoni / Ulasan Klien</span>
            </label>
            <textarea
              name="quote"
              rows={3}
              required
              placeholder="Nilai excellent untuk semuanya: pelayanan, hasil kerja, kesabaran dan kecepatan balas chat..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors leading-relaxed"
            />
          </div>

          <div className="md:col-span-2 flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Testimoni"}
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Testimoni */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Klien</th>
                <th className="p-4">Brand / Logo Kanan Bawah</th>
                <th className="p-4">Isi Testimoni</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 pl-6 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shadow-xs overflow-hidden shrink-0">
                        {t.avatarUrl ? (
                          <img src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover" />
                        ) : (
                          <span>{t.clientName.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{t.clientName}</div>
                        <div className="text-xs text-slate-500">{t.clientCompany}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-slate-700">
                    {t.companyLogoUrl ? (
                      <img src={t.companyLogoUrl} alt={t.clientCompany} className="h-6 max-w-[90px] object-contain" />
                    ) : (
                      <span className="font-bold text-slate-900">{t.clientCompany}</span>
                    )}
                  </td>
                  <td className="p-4 max-w-md text-slate-600 leading-relaxed">
                    <p className="line-clamp-2">{t.quote}</p>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditingItem(t)}
                      className="inline-flex p-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors border border-amber-200 cursor-pointer"
                      title="Edit Testimoni"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(t.id)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer border border-rose-200"
                      title="Hapus Testimoni"
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
        title={`Edit Testimoni: ${editingItem?.clientName || ""}`}
      >
        {editingItem && (
          <form onSubmit={handleUpdate} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-700 font-medium">Nama Klien / Tokoh</label>
                <input
                  type="text"
                  name="clientName"
                  required
                  defaultValue={editingItem.clientName}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-medium">Nama Perusahaan / Brand</label>
                <input
                  type="text"
                  name="clientCompany"
                  required
                  defaultValue={editingItem.clientCompany}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 transition-colors"
                />
              </div>
            </div>

            <ImageUploader
              name="avatarUrl"
              label="Foto Profil (Avatar Kiri Bawah)"
              defaultValue={editingItem.avatarUrl}
            />

            <ImageUploader
              name="companyLogoUrl"
              label="Logo Perusahaan (Kanan Bawah)"
              defaultValue={editingItem.companyLogoUrl}
            />

            <div className="space-y-1.5">
              <label className="text-slate-700 font-medium">Isi Testimoni / Ulasan Klien</label>
              <textarea
                name="quote"
                rows={4}
                required
                defaultValue={editingItem.quote}
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
                {isSubmitting ? "Menyimpan..." : "Perbarui Testimoni"}
              </button>
            </div>
          </form>
        )}
      </EditModal>
    </div>
  );
}
