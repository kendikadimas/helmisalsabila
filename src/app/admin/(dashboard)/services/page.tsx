import { getAllServicesAdmin, deleteService, createService } from "@/actions/services";
import { formatRupiah } from "@/lib/utils";
import { Plus, Trash2, ExternalLink } from "lucide-react";
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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#21262d]">
        <div>
          <h1 className="text-xl font-semibold text-slate-100 tracking-tight">Kelola Layanan</h1>
          <p className="text-xs text-slate-400 mt-1">Daftar layanan portofolio & jasa profesional.</p>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-[#161b22] px-3 py-1 rounded-md border border-[#30363d] self-start sm:self-auto">
          {services.length} Layanan
        </span>
      </div>

      {/* Form Tambah Layanan */}
      <div className="p-5 rounded-xl bg-[#0d1117] border border-[#21262d] space-y-4">
        <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Plus className="w-4 h-4 text-teal-400" />
          <span>Tambah Layanan Baru</span>
        </h2>

        <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Judul Layanan</label>
            <input
              type="text"
              name="title"
              required
              placeholder="Contoh: Jasa Data Analyst (Python)"
              className="w-full p-2.5 bg-[#090d13] border border-[#30363d] rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Harga Mulai (Rp)</label>
            <input
              type="number"
              name="priceStartingAt"
              defaultValue="200000"
              placeholder="200000"
              className="w-full p-2.5 bg-[#090d13] border border-[#30363d] rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors font-mono"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-slate-400 font-medium">Deskripsi Singkat (Preview Card)</label>
            <input
              type="text"
              name="shortDescription"
              required
              placeholder="Jasa Data Analyst – Olah Data, Visualisasi Dashboard & Insight."
              className="w-full p-2.5 bg-[#090d13] border border-[#30363d] rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-slate-400 font-medium">Deskripsi Lengkap (Markdown)</label>
            <textarea
              name="fullDescription"
              rows={4}
              required
              placeholder="Jelaskan detail layanan, tools yang digunakan, output yang didapatkan..."
              className="w-full p-2.5 bg-[#090d13] border border-[#30363d] rounded-lg text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors leading-relaxed"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              Simpan Layanan
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Layanan */}
      <div className="rounded-xl bg-[#0d1117] border border-[#21262d] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#161b22] text-slate-400 font-medium border-b border-[#21262d]">
              <tr>
                <th className="p-3.5 pl-4">Judul Layanan</th>
                <th className="p-3.5">Harga Mulai</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21262d]">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-[#161b22]/50 transition-colors">
                  <td className="p-3.5 pl-4 font-medium text-slate-200">
                    <div>{srv.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono">/layanan/{srv.slug}</div>
                  </td>
                  <td className="p-3.5 font-mono text-teal-400">{formatRupiah(srv.priceStartingAt)}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-medium text-[10px]">
                      Aktif
                    </span>
                  </td>
                  <td className="p-3.5 pr-4 text-right space-x-2">
                    <Link
                      href={`/layanan/${srv.slug}`}
                      target="_blank"
                      className="inline-flex p-1.5 rounded-md bg-[#161b22] hover:bg-[#21262d] text-slate-400 hover:text-white transition-colors"
                      title="Lihat Website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <form action={handleDelete} className="inline-block">
                      <input type="hidden" name="id" value={srv.id} />
                      <button
                        type="submit"
                        className="p-1.5 rounded-md bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
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
