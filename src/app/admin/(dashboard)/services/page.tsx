import { getAllServicesAdmin, deleteService, createService } from "@/actions/services";
import { formatRupiah } from "@/lib/utils";
import { Plus, Trash2, ExternalLink, Briefcase, DollarSign, FileText, Sparkles, Tag } from "lucide-react";
import Link from "next/link";

export default async function AdminServicesPage() {
  const services = await getAllServicesAdmin();

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteService(id);
  }

  async function handleCreate(formData: FormData) {
    "use server";
    await createService(formData);
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-semibold text-amber-300 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Katalog Layanan Jasa</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Kelola Layanan & Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tambah, perbarui, atau hapus daftar layanan konsultasi & olah data yang tampil di website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-amber-400 font-bold">
            Total: {services.length} Layanan
          </span>
        </div>
      </div>

      {/* Form Tambah Layanan */}
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tambah Layanan Baru</h3>
              <p className="text-xs text-slate-400">Isi formulir di bawah ini untuk memublikasikan jasa baru.</p>
            </div>
          </div>
        </div>

        <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Judul Layanan</span>
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="Contoh: Jasa Data Analyst & Visualization (Python/Tableau)"
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Harga Mulai (Rp)</span>
            </label>
            <input
              type="number"
              name="priceStartingAt"
              defaultValue="200000"
              placeholder="200000"
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Deskripsi Singkat (Preview Card)</span>
            </label>
            <input
              type="text"
              name="shortDescription"
              required
              placeholder="Jasa Data Analyst – Olah Data, Visualisasi Dashboard & Insight Profesional."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Deskripsi Lengkap (Markdown / Rich Format)</span>
            </label>
            <textarea
              name="fullDescription"
              rows={5}
              required
              placeholder="Jelaskan detail layanan, tools yang digunakan, output yang didapatkan..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all leading-relaxed"
            />
          </div>

          <div className="md:col-span-2 pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan & Publikasikan Layanan</span>
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Layanan */}
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Daftar Layanan Terdaftar</h3>
          <span className="text-xs text-slate-400">Klik icon mata untuk melihat preview di website</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4 pl-6">Judul Layanan</th>
                <th className="p-4">Harga Mulai</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-800/40 transition-colors group">
                  <td className="p-4 pl-6 font-medium text-white max-w-md">
                    <div className="font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                      {srv.title}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                      /layanan/{srv.slug}
                    </div>
                  </td>
                  <td className="p-4 font-bold font-mono text-emerald-400">
                    {formatRupiah(srv.priceStartingAt)}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                      Aktif
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <Link
                      href={`/layanan/${srv.slug}`}
                      target="_blank"
                      className="inline-flex p-2 rounded-xl bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 transition-colors border border-slate-700/60"
                      title="Lihat Halaman Client"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <form action={handleDelete} className="inline-block">
                      <input type="hidden" name="id" value={srv.id} />
                      <button
                        type="submit"
                        className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors cursor-pointer"
                        title="Hapus Layanan"
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
