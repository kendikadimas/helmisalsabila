"use client";

import { useState } from "react";
import { Plus, Trash2, Tag } from "lucide-react";
import { createCategory, deleteCategory } from "@/actions/categories";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  type: string;
}

export default function CategoriesClientManager({
  initialCategories,
}: {
  initialCategories: CategoryItem[];
}) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await createCategory(formData);
    setIsSubmitting(false);
    if (res.success) {
      window.location.reload();
    } else {
      alert(res.error || "Gagal membuat kategori.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return;
    const res = await deleteCategory(id);
    if (res.success) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert(res.error || "Gagal menghapus kategori.");
    }
  };

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Kelola Kategori</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tambah atau hapus kategori untuk pengelompokan artikel blog dan layanan.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-700 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto font-medium shadow-xs">
          {categories.length} Kategori Terdaftar
        </span>
      </div>

      {/* Form Tambah Kategori */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Plus className="w-5 h-5 text-teal-600" />
          <span>Tambah Kategori Baru</span>
        </h2>

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-slate-700 font-medium">Nama Kategori</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Contoh: IT Solution, Data Analyst, Tutorial..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 font-medium">Tipe Kategori</label>
            <select
              name="type"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 transition-colors"
            >
              <option value="article">Artikel / Blog</option>
              <option value="service">Layanan / Portfolio</option>
              <option value="product">Produk Digital</option>
              <option value="general">Umum</option>
            </select>
          </div>

          <div className="md:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Kategori"}
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Kategori */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Nama Kategori</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Tipe</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-slate-900 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-teal-600" />
                    <span>{c.name}</span>
                  </td>
                  <td className="p-4 font-mono text-slate-500">{c.slug}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 uppercase">
                      {c.type}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer border border-rose-200"
                      title="Hapus Kategori"
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
    </div>
  );
}
