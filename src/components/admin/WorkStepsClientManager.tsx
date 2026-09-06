"use client";

import { useState } from "react";
import { Plus, Trash2, Edit3, ListOrdered } from "lucide-react";
import EditModal from "@/components/EditModal";
import { createWorkStep, updateWorkStep, deleteWorkStep } from "@/actions/worksteps";

interface WorkStepItem {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
}

export default function WorkStepsClientManager({ initialSteps }: { initialSteps: WorkStepItem[] }) {
  const [steps, setSteps] = useState<WorkStepItem[]>(initialSteps);
  const [editingItem, setEditingItem] = useState<WorkStepItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await createWorkStep(formData);
    setIsSubmitting(false);
    if (res.success) {
      window.location.reload();
    } else {
      alert(res.error || "Gagal menambah langkah kerja.");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateWorkStep(editingItem.id, formData);
    setIsSubmitting(false);
    if (res.success) {
      setEditingItem(null);
      window.location.reload();
    } else {
      alert(res.error || "Gagal memperbarui langkah kerja.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus langkah kerja ini?")) return;
    const res = await deleteWorkStep(id);
    if (res.success) {
      setSteps((prev) => prev.filter((s) => s.id !== id));
    } else {
      alert(res.error || "Gagal menghapus.");
    }
  };

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Langkah Kerja (CTA Home)</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola tahapan kerja (01-04) di samping formulir kontak landing page.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-700 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto font-medium shadow-xs">
          {steps.length} Langkah
        </span>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Plus className="w-5 h-5 text-teal-600" />
          <span>Tambah Langkah Kerja</span>
        </h2>

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-5 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <label className="text-slate-700 font-medium">Nomor Urut</label>
            <input
              type="text"
              name="stepNumber"
              required
              defaultValue={`0${steps.length + 1}`}
              placeholder="01, 02..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 font-mono font-bold"
            />
          </div>

          <div className="space-y-1.5 md:col-span-3">
            <label className="text-slate-700 font-medium">Judul Tahapan</label>
            <input
              type="text"
              name="title"
              required
              placeholder="Contoh: Konsultasi & Briefing Awal"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600"
            />
          </div>

          <div className="space-y-1.5 md:col-span-4">
            <label className="text-slate-700 font-medium">Penjelasan Langkah</label>
            <textarea
              name="description"
              rows={2}
              required
              placeholder="Jelaskan apa yang dilakukan pada tahap ini..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 leading-relaxed"
            />
          </div>

          <div className="md:col-span-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Langkah"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">No</th>
                <th className="p-4">Tahapan Kerja</th>
                <th className="p-4">Deskripsi</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {steps.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 pl-6 font-mono font-bold text-teal-700">{s.stepNumber}</td>
                  <td className="p-4 font-semibold text-slate-900">{s.title}</td>
                  <td className="p-4 text-slate-600 max-w-md">{s.description}</td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditingItem(s)}
                      className="p-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors border border-amber-200 cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
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
        title={`Edit Langkah: ${editingItem?.stepNumber || ""}`}
      >
        {editingItem && (
          <form onSubmit={handleUpdate} className="space-y-4 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <label className="text-slate-700 font-medium">Nomor Urut</label>
              <input
                type="text"
                name="stepNumber"
                required
                defaultValue={editingItem.stepNumber}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 font-mono font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-medium">Judul Tahapan</label>
              <input
                type="text"
                name="title"
                required
                defaultValue={editingItem.title}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-700 font-medium">Deskripsi</label>
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
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm disabled:opacity-50"
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
