import { getAllServicesAdmin, deleteService, createService } from "@/actions/services";
import { formatRupiah } from "@/lib/utils";
import { Plus, Trash2, Edit3, ExternalLink } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

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
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Kelola Layanan & Portfolio</h1>
          <p className="text-xs text-slate-400 mt-1">Daftar semua layanan yang ditampilkan di website portofolio.</p>
        </div>
      </div>

      {/* Form Tambah Layanan */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-teal-400 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Tambah Layanan Baru</span>
        </h3>

        <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300">Judul Layanan</label>
            <input
              type="text"
              name="title"
              required
              placeholder="Contoh: Jasa Data Analyst (Python)"
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300">Harga Mulai (Rp)</label>
            <input
              type="number"
              name="priceStartingAt"
              defaultValue="200000"
              placeholder="200000"
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-slate-300">Deskripsi Singkat (Card Preview)</label>
            <input
              type="text"
              name="shortDescription"
              required
              placeholder="Jasa Data Analyst – Olah Data, Visualisasi & Insight Profesional."
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-slate-300">Deskripsi Lengkap (Markdown / Rich Format)</label>
            <textarea
              name="fullDescription"
              rows={5}
              required
              placeholder="Jelaskan detail layanan, tools yang digunakan, output yang didapatkan..."
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors"
            >
              Simpan Layanan
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Layanan */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-700">
            <tr>
              <th className="p-4">Judul Layanan</th>
              <th className="p-4">Harga Mulai</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {services.map((srv) => (
              <tr key={srv.id} className="hover:bg-slate-750">
                <td className="p-4 font-medium text-white">
                  <div>{srv.title}</div>
                  <div className="text-[10px] text-slate-500">/layanan/{srv.slug}</div>
                </td>
                <td className="p-4 font-bold text-emerald-400">{formatRupiah(srv.priceStartingAt)}</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">
                    Aktif
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <Link
                    href={`/layanan/${srv.slug}`}
                    target="_blank"
                    className="inline-flex p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <form action={handleDelete} className="inline-block">
                    <input type="hidden" name="id" value={srv.id} />
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
