import { getArticles, deleteArticle, createArticle, getAllCategories } from "@/actions/articles";
import { formatDateIndo } from "@/lib/utils";
import { Plus, Trash2, ExternalLink, BookOpen, Eye, Flame, FileText, Tag, Sparkles } from "lucide-react";
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
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-[11px] font-semibold text-sky-300 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Katalog Artikel & Blog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Kelola Artikel Blog
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Publikasi postingan baru, kelola tag headline populer, dan trending sidebar rank.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-sky-400 font-bold">
            Total: {articles.length} Postingan
          </span>
        </div>
      </div>

      {/* Form Tambah Artikel */}
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tulis & Terbitkan Artikel Baru</h3>
              <p className="text-xs text-slate-400">Tulis ide atau tutorial menarik untuk pembaca blog.</p>
            </div>
          </div>
        </div>

        <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Judul Artikel</span>
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="Contoh: 3 Headphone JBL Terbaik 2026 dengan Suara Bass Mantap!"
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Kategori</span>
            </label>
            <select
              name="categoryId"
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-teal-400" />
              <span>Opsi Highlight & Trending</span>
            </label>
            <div className="flex items-center gap-4 pt-2 text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input type="checkbox" name="isPopular" value="true" className="rounded text-sky-500 bg-slate-950 border-slate-800 focus:ring-sky-500" />
                <span>Top Hero Populer</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input type="checkbox" name="isTrending" value="true" className="rounded text-sky-500 bg-slate-950 border-slate-800 focus:ring-sky-500" />
                <span>Trending Sidebar</span>
              </label>
            </div>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              <span>Ringkasan / Excerpt (Meta Preview)</span>
            </label>
            <input
              type="text"
              name="excerpt"
              required
              placeholder="Ringkasan singkat artikel untuk kartu preview..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              <span>Isi Konten Artikel (Markdown Format)</span>
            </label>
            <textarea
              name="content"
              rows={8}
              required
              placeholder="Tulis artikel dengan format heading (## Sub Bab), list, dan paragraf..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all leading-relaxed font-mono"
            />
          </div>

          <div className="md:col-span-2 pt-2 flex items-center justify-between">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                name="isPublished"
                value="true"
                defaultChecked
                className="rounded text-sky-500 bg-slate-950 border-slate-800 focus:ring-sky-500"
              />
              <span>Langsung Publikasikan (Publish Live)</span>
            </label>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan & Publikasikan</span>
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Artikel */}
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Daftar Artikel Blog</h3>
          <span className="text-xs text-slate-400">Total pembaca & kategori</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4 pl-6">Judul Artikel</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Tanggal Rilis</th>
                <th className="p-4">Views</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="p-4 pl-6 font-medium text-white max-w-sm">
                    <div className="font-bold text-slate-100 group-hover:text-sky-300 transition-colors truncate">
                      {art.title}
                    </div>
                    <div className="flex items-center gap-2 pt-1 text-[10px]">
                      {art.isPopular && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                          Top Populer
                        </span>
                      )}
                      {art.isTrending && (
                        <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 font-bold flex items-center gap-1">
                          <Flame className="w-3 h-3" /> Trending
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-slate-400 font-semibold">{art.category || "-"}</td>
                  <td className="p-4 text-slate-400 font-mono">{formatDateIndo(art.publishedAt)}</td>
                  <td className="p-4 font-mono font-bold text-teal-400">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>{art.viewsCount || 0}</span>
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <Link
                      href={`/blog/${art.slug}`}
                      target="_blank"
                      className="inline-flex p-2 rounded-xl bg-slate-800 hover:bg-sky-500/20 hover:text-sky-300 text-slate-300 transition-colors border border-slate-700/60"
                      title="Lihat Artikel Client"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <form action={handleDelete} className="inline-block">
                      <input type="hidden" name="id" value={art.id} />
                      <button
                        type="submit"
                        className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors cursor-pointer"
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
