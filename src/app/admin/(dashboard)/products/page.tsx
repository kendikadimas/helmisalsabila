import { getAllProductsAdmin, deleteProduct, createProduct } from "@/actions/products";
import { formatRupiah } from "@/lib/utils";
import { Plus, Trash2, ExternalLink, Package, DollarSign, Percent, Tag, Award, Sparkles } from "lucide-react";
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
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[11px] font-semibold text-rose-300 mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Katalog Produk Digital</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Kelola Produk Digital
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Atur harga normal, diskon promo, level badge, dan deskripsi produk digital.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-rose-400 font-bold">
            Total: {products.length} Produk
          </span>
        </div>
      </div>

      {/* Form Tambah Produk */}
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tambah Produk Digital Baru</h3>
              <p className="text-xs text-slate-400">Isi informasi produk digital yang akan dijual.</p>
            </div>
          </div>
        </div>

        <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-rose-400" />
              <span>Judul Produk</span>
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="Contoh: [LIFETIME ACCESS] - PERSONAL BRANDING BUILDER [BASIC]"
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Level Badge</span>
            </label>
            <input
              type="text"
              name="levelBadge"
              defaultValue="Semua Level"
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" />
              <span>Harga Normal (Rp)</span>
            </label>
            <input
              type="number"
              name="originalPrice"
              defaultValue="350000"
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-sky-400" />
              <span>Diskon (%)</span>
            </label>
            <input
              type="number"
              name="discountPercent"
              defaultValue="10"
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Harga Akhir Diskon (Rp)</span>
            </label>
            <input
              type="number"
              name="discountedPrice"
              defaultValue="200000"
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-mono"
            />
          </div>

          <div className="space-y-1.5 md:col-span-3">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Tentang Produk & Keunggulan</span>
            </label>
            <textarea
              name="aboutProduct"
              rows={4}
              required
              placeholder="Deskripsikan keunggulan produk dan apa saja yang didapatkan..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all leading-relaxed"
            />
          </div>

          <div className="md:col-span-3 pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan & Publikasikan Produk</span>
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Produk */}
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Daftar Produk Digital</h3>
          <span className="text-xs text-slate-400">Status harga & penjualan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4 pl-6">Judul Produk</th>
                <th className="p-4">Harga Normal</th>
                <th className="p-4">Harga Diskon</th>
                <th className="p-4">Terjual</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {products.map((prd) => (
                <tr key={prd.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="p-4 pl-6 font-medium text-white max-w-sm">
                    <div className="font-bold text-slate-100 group-hover:text-rose-300 transition-colors truncate">
                      {prd.title}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                      /produk/{prd.slug}
                    </div>
                  </td>
                  <td className="p-4 line-through text-slate-500 font-mono">
                    {formatRupiah(prd.originalPrice)}
                  </td>
                  <td className="p-4 font-bold font-mono text-emerald-400">
                    {formatRupiah(prd.discountedPrice)}
                  </td>
                  <td className="p-4 text-slate-300 font-mono">
                    {prd.totalSales.toLocaleString("id-ID")} pcs
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <Link
                      href={`/produk/${prd.slug}`}
                      target="_blank"
                      className="inline-flex p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 transition-colors border border-slate-700/60"
                      title="Lihat Halaman Client"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <form action={handleDelete} className="inline-block">
                      <input type="hidden" name="id" value={prd.id} />
                      <button
                        type="submit"
                        className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors cursor-pointer"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
