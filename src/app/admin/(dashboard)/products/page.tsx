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
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Kelola Produk Digital</h1>
        <p className="text-xs text-slate-400 mt-1">Atur harga, diskon, modul kurikulum, dan status produk digital.</p>
      </div>

      {/* Form Tambah Produk */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </h3>

        <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1 md:col-span-2">
            <label className="text-slate-300">Judul Produk</label>
            <input
              type="text"
              name="title"
              required
              placeholder="Contoh: [LIFETIME ACCESS] - PERSONAL BRANDING BUILDER [BASIC]"
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300">Level Badge</label>
            <input
              type="text"
              name="levelBadge"
              defaultValue="Semua Level"
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300">Harga Asli / Normal (Rp)</label>
            <input
              type="number"
              name="originalPrice"
              defaultValue="350000"
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300">Diskon (%)</label>
            <input
              type="number"
              name="discountPercent"
              defaultValue="10"
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300">Harga Akhir / Diskon (Rp)</label>
            <input
              type="number"
              name="discountedPrice"
              defaultValue="200000"
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="space-y-1 md:col-span-3">
            <label className="text-slate-300">Tentang Produk</label>
            <textarea
              name="aboutProduct"
              rows={4}
              required
              placeholder="Deskripsikan keunggulan produk dan apa saja yang didapatkan..."
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="md:col-span-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors"
            >
              Simpan Produk
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Produk */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-700">
            <tr>
              <th className="p-4">Judul Produk</th>
              <th className="p-4">Harga Normal</th>
              <th className="p-4">Harga Diskon</th>
              <th className="p-4">Terjual</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {products.map((prd) => (
              <tr key={prd.id} className="hover:bg-slate-750">
                <td className="p-4 font-medium text-white max-w-xs truncate">
                  <div>{prd.title}</div>
                  <div className="text-[10px] text-slate-500">/produk/{prd.slug}</div>
                </td>
                <td className="p-4 line-through text-slate-500">{formatRupiah(prd.originalPrice)}</td>
                <td className="p-4 font-bold text-emerald-400">{formatRupiah(prd.discountedPrice)}</td>
                <td className="p-4 text-slate-300">{prd.totalSales.toLocaleString("id-ID")} pcs</td>
                <td className="p-4 text-right space-x-2">
                  <Link
                    href={`/produk/${prd.slug}`}
                    target="_blank"
                    className="inline-flex p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <form action={handleDelete} className="inline-block">
                    <input type="hidden" name="id" value={prd.id} />
                    <button
                      type="submit"
                      className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors"
                      title="Hapus"
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
  );
}
