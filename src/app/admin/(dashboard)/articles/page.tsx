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
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Kelola Artikel Blog</h1>
          <p className="text-sm text-slate-500 mt-1">Publikasi dan atur postingan edukasi di blog.</p>
        </div>
        <span className="text-xs font-mono text-slate-700 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto font-medium shadow-xs">
          {articles.length} Postingan Diterbitkan
        </span>
      </div>

      {/* Form Tambah Artikel */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Plus className="w-5 h-5 text-teal-600" />
          <span>Tulis Artikel Baru</span>
        </h2>

        <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-slate-700 font-medium">Judul Artikel</label>
            <input
              type="text"
              name="title"
              required
              placeholder="Contoh: 3 Headphone JBL Terbaik 2026 dengan Suara Bass Mantap!"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 font-medium">Kategori</label>
            <select
              name="categoryId"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 transition-colors"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 font-medium">Opsi Highlight</label>
            <div className="flex items-center gap-6 pt-2.5 text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                <input type="checkbox" name="isPopular" value="true" className="w-4 h-4 rounded text-teal-600 bg-white border-slate-300 focus:ring-teal-500" />
                <span>Top Populer</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                <input type="checkbox" name="isTrending" value="true" className="w-4 h-4 rounded text-teal-600 bg-white border-slate-300 focus:ring-teal-500" />
                <span>Trending Sidebar</span>
              </label>
            </div>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-slate-700 font-medium">Ringkasan / Excerpt</label>
            <input
              type="text"
              name="excerpt"
              required
              placeholder="Ringkasan singkat artikel..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-slate-700 font-medium">Konten Artikel (Markdown)</label>
            <textarea
              name="content"
              rows={6}
              required
              placeholder="Tulis artikel dengan format markdown (## Sub Bab)..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors leading-relaxed font-mono"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-between pt-2">
            <label className="flex items-center gap-2.5 text-slate-700 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                name="isPublished"
                value="true"
                defaultChecked
                className="w-4 h-4 rounded text-teal-600 bg-white border-slate-300 focus:ring-teal-500"
              />
              <span>Langsung Publikasikan</span>
            </label>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
            >
              Simpan & Terbitkan
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Artikel */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Judul Artikel</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Views</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 pl-6 font-medium text-slate-900 max-w-md truncate">
                    <div className="font-semibold">{art.title}</div>
                    <div className="flex items-center gap-2 pt-1 text-xs">
                      {art.isPopular && (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-200 text-[11px]">
                          Top Populer
                        </span>
                      )}
                      {art.isTrending && (
                        <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-semibold border border-teal-200 text-[11px]">
                          Trending
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">{art.category || "-"}</td>
                  <td className="p-4 text-slate-500 font-mono">{formatDateIndo(art.publishedAt)}</td>
                  <td className="p-4 text-slate-700 font-mono font-medium">{art.viewsCount || 0}</td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <Link
                      href={`/blog/${art.slug}`}
                      target="_blank"
                      className="inline-flex p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 shadow-xs"
                      title="Lihat Website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <form action={handleDelete} className="inline-block">
                      <input type="hidden" name="id" value={art.id} />
                      <button
                        type="submit"
                        className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer border border-rose-200"
                        title="Hapus Artikel"
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
