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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#21262d]">
        <div>
          <h1 className="text-xl font-semibold text-slate-100 tracking-tight">Kelola Produk Digital</h1>
          <p className="text-xs text-slate-400 mt-1">Daftar produk, kursus, dan modul pembelajaran.</p>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-[#161b22] px-3 py-1 rounded-md border border-[#30363d] self-start sm:self-auto">
          {products.length} Produk
        </span>
      </div>

      {/* Form Tambah Produk */}
      <div className="p-5 rounded-xl bg-[#0d1117] border border-[#21262d] space-y-4">
        <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Plus className="w-4 h-4 text-teal-400" />
          <span>Tambah Produk Baru</span>
        </h2>

        <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1 md:col-span-2">
            <label className="text-slate-400 font-medium">Judul Produk</label>
            <input
              type="text"
              name="title"
              required
              placeholder="Contoh: [LIFETIME ACCESS] - DATA ANALYST BOOTCAMP"
              className="w-full p-2.5 bg-[#090d13] border border-[#30363d] rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Level Badge</label>
            <input
              type="text"
              name="levelBadge"
              defaultValue="Semua Level"
              className="w-full p-2.5 bg-[#090d13] border border-[#30363d] rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Harga Normal (Rp)</label>
            <input
              type="number"
              name="originalPrice"
              defaultValue="350000"
              className="w-full p-2.5 bg-[#090d13] border border-[#30363d] rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Diskon (%)</label>
            <input
              type="number"
              name="discountPercent"
              defaultValue="10"
              className="w-full p-2.5 bg-[#090d13] border border-[#30363d] rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Harga Akhir (Rp)</label>
            <input
              type="number"
              name="discountedPrice"
              defaultValue="200000"
              className="w-full p-2.5 bg-[#090d13] border border-[#30363d] rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors font-mono"
            />
          </div>

          <div className="space-y-1 md:col-span-3">
            <label className="text-slate-400 font-medium">Tentang Produk</label>
            <textarea
              name="aboutProduct"
              rows={4}
              required
              placeholder="Deskripsikan keunggulan produk dan materi yang didapatkan..."
              className="w-full p-2.5 bg-[#090d13] border border-[#30363d] rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors leading-relaxed"
            />
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              Simpan Produk
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Produk */}
      <div className="rounded-xl bg-[#0d1117] border border-[#21262d] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#161b22] text-slate-400 font-medium border-b border-[#21262d]">
              <tr>
                <th className="p-3.5 pl-4">Judul Produk</th>
                <th className="p-3.5">Harga Normal</th>
                <th className="p-3.5">Harga Diskon</th>
                <th className="p-3.5">Terjual</th>
                <th className="p-3.5 pr-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262d]">
              {products.map((prd) => (
                <tr key={prd.id} className="hover:bg-[#161b22]/50 transition-colors">
                  <td className="p-3.5 pl-4 font-medium text-slate-200 max-w-sm truncate">
                    <div>{prd.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono">/produk/{prd.slug}</div>
                  </td>
                  <td className="p-3.5 line-through text-slate-500 font-mono">
                    {formatRupiah(prd.originalPrice)}
                  </td>
                  <td className="p-3.5 font-mono text-teal-400 font-medium">
                    {formatRupiah(prd.discountedPrice)}
                  </td>
                  <td className="p-3.5 text-slate-400 font-mono">
                    {prd.totalSales.toLocaleString("id-ID")} pcs
                  </td>
                  <td className="p-3.5 pr-4 text-right space-x-2">
                    <Link
                      href={`/produk/${prd.slug}`}
                      target="_blank"
                      className="inline-flex p-1.5 rounded-md bg-[#161b22] hover:bg-[#21262d] text-slate-400 hover:text-white transition-colors"
                      title="Lihat Website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <form action={handleDelete} className="inline-block">
                      <input type="hidden" name="id" value={prd.id} />
                      <button
                        type="submit"
                        className="p-1.5 rounded-md bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
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
