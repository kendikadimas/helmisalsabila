import { getAllProductsAdmin, deleteProduct, createProduct } from "@/actions/products";
import { formatRupiah } from "@/lib/utils";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteProduct(id);
  }

  async function handleCreate(formData: FormData) {
    "use server";
    await createProduct(formData);
  }

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Kelola Produk Digital</h1>
          <p className="text-sm text-slate-500 mt-1">Daftar produk, e-book, kursus, dan modul materi digital.</p>
        </div>
        <span className="text-xs font-mono text-slate-700 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto font-medium shadow-xs">
          {products.length} Produk Digital
        </span>
      </div>

      {/* Form Tambah Produk */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Plus className="w-5 h-5 text-teal-600" />
          <span>Tambah Produk Baru</span>
        </h2>

        <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs sm:text-sm">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-slate-700 font-medium">Judul Produk</label>
            <input
              type="text"
              name="title"
              required
              placeholder="Contoh: [LIFETIME ACCESS] - DATA ANALYST BOOTCAMP"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 font-medium">Level Badge</label>
            <input
              type="text"
              name="levelBadge"
              defaultValue="Semua Level"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 font-medium">Harga Normal (Rp)</label>
            <input
              type="number"
              name="originalPrice"
              defaultValue="350000"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 font-medium">Diskon (%)</label>
            <input
              type="number"
              name="discountPercent"
              defaultValue="10"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 font-medium">Harga Akhir / Diskon (Rp)</label>
            <input
              type="number"
              name="discountedPrice"
              defaultValue="200000"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors font-mono"
            />
          </div>

          <div className="space-y-1.5 md:col-span-3">
            <label className="text-slate-700 font-medium">Tentang Produk</label>
            <textarea
              name="aboutProduct"
              rows={4}
              required
              placeholder="Deskripsikan keunggulan produk dan materi yang didapatkan..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors leading-relaxed"
            />
          </div>

          <div className="md:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
            >
              Simpan Produk
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Produk */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Judul Produk</th>
                <th className="p-4">Harga Normal</th>
                <th className="p-4">Harga Diskon</th>
                <th className="p-4">Terjual</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((prd) => (
                <tr key={prd.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 pl-6 font-medium text-slate-900 max-w-sm truncate">
                    <div className="font-semibold">{prd.title}</div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">/produk/{prd.slug}</div>
                  </td>
                  <td className="p-4 line-through text-slate-400 font-mono">
                    {formatRupiah(prd.originalPrice)}
                  </td>
                  <td className="p-4 font-mono text-teal-700 font-medium">
                    {formatRupiah(prd.discountedPrice)}
                  </td>
                  <td className="p-4 text-slate-600 font-mono">
                    {prd.totalSales.toLocaleString("id-ID")} pcs
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <Link
                      href={`/produk/${prd.slug}`}
                      target="_blank"
                      className="inline-flex p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 shadow-xs"
                      title="Lihat Website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <form action={handleDelete} className="inline-block">
                      <input type="hidden" name="id" value={prd.id} />
                      <button
                        type="submit"
                        className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer border border-rose-200"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
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
