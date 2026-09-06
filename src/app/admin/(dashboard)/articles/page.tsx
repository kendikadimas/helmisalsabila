import { getArticles, deleteArticle, createArticle, getAllCategories } from "@/actions/articles";
import { formatDateIndo } from "@/lib/utils";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function AdminArticlesPage() {
  const articles = await getArticles();
  const categories = await getAllCategories("article");

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteArticle(id);
  }

  async function handleCreate(formData: FormData) {
    "use server";
    await createArticle(formData);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#21262d]">
        <div>
          <h1 className="text-xl font-semibold text-slate-100 tracking-tight">Kelola Artikel Blog</h1>
          <p className="text-xs text-slate-400 mt-1">Publikasi dan atur postingan edukasi di blog.</p>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-[#161b22] px-3 py-1 rounded-md border border-[#30363d] self-start sm:self-auto">
          {articles.length} Postingan
        </span>
      </div>

      {/* Form Tambah Artikel */}
      <div className="p-5 rounded-xl bg-[#0d1117] border border-[#21262d] space-y-4">
        <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Plus className="w-4 h-4 text-teal-400" />
          <span>Tulis Artikel Baru</span>
        </h2>

        <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1 md:col-span-2">
            <label className="text-slate-400 font-medium">Judul Artikel</label>
            <input
              type="text"
              name="title"
              required
              placeholder="Contoh: 3 Headphone JBL Terbaik 2026 dengan Suara Bass Mantap!"
              className="w-full p-2.5 bg-[#090d13] border border-[#30363d] rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Kategori</label>
            <select
              name="categoryId"
              className="w-full p-2.5 bg-[#090d13] border border-[#30363d] rounded-lg text-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Opsi Highlight</label>
            <div className="flex items-center gap-4 pt-2 text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input type="checkbox" name="isPopular" value="true" className="rounded text-teal-500 bg-[#090d13] border-[#30363d]" />
                <span>Top Populer</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input type="checkbox" name="isTrending" value="true" className="rounded text-teal-500 bg-[#090d13] border-[#30363d]" />
                <span>Trending Sidebar</span>
              </label>
            </div>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-slate-400 font-medium">Ringkasan / Excerpt</label>
            <input
              type="text"
              name="excerpt"
              required
              placeholder="Ringkasan singkat artikel..."
              className="w-full p-2.5 bg-[#090d13] border border-[#30363d] rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-slate-400 font-medium">Konten Artikel (Markdown)</label>
            <textarea
              name="content"
              rows={6}
              required
              placeholder="Tulis artikel dengan format markdown (## Sub Bab)..."
              className="w-full p-2.5 bg-[#090d13] border border-[#30363d] rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors leading-relaxed font-mono"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-between">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                name="isPublished"
                value="true"
                defaultChecked
                className="rounded text-teal-500 bg-[#090d13] border-[#30363d]"
              />
              <span>Langsung Publikasikan</span>
            </label>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              Simpan & Terbitkan
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Artikel */}
      <div className="rounded-xl bg-[#0d1117] border border-[#21262d] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#161b22] text-slate-400 font-medium border-b border-[#21262d]">
              <tr>
                <th className="p-3.5 pl-4">Judul Artikel</th>
                <th className="p-3.5">Kategori</th>
                <th className="p-3.5">Tanggal</th>
                <th className="p-3.5">Views</th>
                <th className="p-3.5 pr-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262d]">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-[#161b22]/50 transition-colors">
                  <td className="p-3.5 pl-4 font-medium text-slate-200 max-w-sm truncate">
                    <div>{art.title}</div>
                    <div className="flex items-center gap-2 pt-0.5 text-[10px]">
                      {art.isPopular && (
                        <span className="text-amber-400/90 font-medium">Top Populer</span>
                      )}
                      {art.isTrending && (
                        <span className="text-teal-400/90 font-medium">Trending</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-400">{art.category || "-"}</td>
                  <td className="p-3.5 text-slate-400 font-mono">{formatDateIndo(art.publishedAt)}</td>
                  <td className="p-3.5 text-slate-300 font-mono">{art.viewsCount || 0}</td>
                  <td className="p-3.5 pr-4 text-right space-x-2">
                    <Link
                      href={`/blog/${art.slug}`}
                      target="_blank"
                      className="inline-flex p-1.5 rounded-md bg-[#161b22] hover:bg-[#21262d] text-slate-400 hover:text-white transition-colors"
                      title="Lihat Website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <form action={handleDelete} className="inline-block">
                      <input type="hidden" name="id" value={art.id} />
                      <button
                        type="submit"
                        className="p-1.5 rounded-md bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                        title="Hapus Artikel"
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
