import { getArticles, deleteArticle, createArticle, getAllCategories } from "@/actions/articles";
import { formatDateIndo } from "@/lib/utils";
import { Plus, Trash2, ExternalLink, Eye, Flame } from "lucide-react";
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
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Kelola Artikel Blog</h1>
        <p className="text-xs text-slate-400 mt-1">Publikasi artikel, atur headline populer, trending rank, dan kategori.</p>
      </div>

      {/* Form Tambah Artikel */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Tulis Artikel Baru</span>
        </h3>

        <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1 md:col-span-2">
            <label className="text-slate-300">Judul Artikel</label>
            <input
              type="text"
              name="title"
              required
              placeholder="Contoh: 3 Headphone JBL Terbaik 2026 dengan Suara Bass Mantap!"
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300">Kategori</label>
            <select
              name="categoryId"
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-teal-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300">Opsi Headline / Trending</label>
            <div className="flex items-center gap-4 pt-2 text-slate-300">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" name="isPopular" value="true" className="rounded text-teal-600" />
                <span>Top Hero Populer</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" name="isTrending" value="true" className="rounded text-teal-600" />
                <span>Trending Sidebar</span>
              </label>
            </div>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-slate-300">Ringkasan / Excerpt (Meta Description)</label>
            <input
              type="text"
              name="excerpt"
              required
              placeholder="Ringkasan singkat artikel untuk preview..."
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-slate-300">Isi Konten Artikel</label>
            <textarea
              name="content"
              rows={8}
              required
              placeholder="Tulis artikel dengan format heading (## Judul Sub Bab), list, dan paragraf..."
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-slate-300">
              <input
                type="checkbox"
                name="isPublished"
                value="true"
                defaultChecked
                className="rounded text-teal-600"
              />
              <span>Langsung Publikasikan (Publish)</span>
            </label>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors"
            >
              Simpan & Terbitkan
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Artikel */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-700">
            <tr>
              <th className="p-4">Judul Artikel</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Tanggal Rilis</th>
              <th className="p-4">Views</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {articles.map((art) => (
              <tr key={art.id} className="hover:bg-slate-750">
                <td className="p-4 font-medium text-white max-w-sm">
                  <div className="truncate">{art.title}</div>
                  <div className="flex items-center gap-2 pt-1 text-[10px]">
                    {art.isPopular && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                        Top Populer
                      </span>
                    )}
                    {art.isTrending && (
                      <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5" /> Trending #{art.trendingRank || 1}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-slate-400">{art.category || "-"}</td>
                <td className="p-4 text-slate-400">{formatDateIndo(art.publishedAt)}</td>
                <td className="p-4 text-slate-300 flex items-center gap-1 mt-4">
                  <Eye className="w-3 h-3 text-teal-400" />
                  <span>{art.viewsCount || 0}</span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <Link
                    href={`/blog/${art.slug}`}
                    target="_blank"
                    className="inline-flex p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <form action={handleDelete} className="inline-block">
                    <input type="hidden" name="id" value={art.id} />
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
