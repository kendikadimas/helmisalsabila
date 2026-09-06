import { getAllTestimonialsAdmin, deleteTestimonial, createTestimonial } from "@/actions/testimonials";
import { Plus, Trash2, MessageSquareQuote, Building, User, Image as ImageIcon } from "lucide-react";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonialsAdmin();

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteTestimonial(id);
  }

  async function handleCreate(formData: FormData) {
    "use server";
    await createTestimonial(formData);
  }

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Kelola Testimoni Klien</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tambah, perbarui, atau hapus ulasan kepuasan klien yang tampil di landing page.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-700 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto font-medium shadow-xs">
          {testimonials.length} Testimoni Aktif
        </span>
      </div>

      {/* Form Tambah Testimoni */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Plus className="w-5 h-5 text-teal-600" />
          <span>Tambah Testimoni Baru</span>
        </h2>

        <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <label className="text-slate-700 font-medium flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              <span>Nama Klien / Tokoh</span>
            </label>
            <input
              type="text"
              name="clientName"
              required
              placeholder="Contoh: Regina"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 font-medium flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-400" />
              <span>Nama Perusahaan / Brand</span>
            </label>
            <input
              type="text"
              name="clientCompany"
              required
              defaultValue="FOOM"
              placeholder="Contoh: FOOM, PT Solusi Data, Tokopedia..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 font-medium flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-slate-400" />
              <span>URL Foto Profil (Avatar Kiri Bawah)</span>
            </label>
            <input
              type="text"
              name="avatarUrl"
              defaultValue="/profile-talent.png"
              placeholder="https://... atau /foto-klien.jpg"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-700 font-medium flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-slate-400" />
              <span>URL Logo Perusahaan (Opsional, Kanan Bawah)</span>
            </label>
            <input
              type="text"
              name="companyLogoUrl"
              placeholder="Kosongkan jika ingin menampilkan teks biasa"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-slate-700 font-medium flex items-center gap-1.5">
              <MessageSquareQuote className="w-4 h-4 text-teal-600" />
              <span>Isi Testimoni / Ulasan Klien</span>
            </label>
            <textarea
              name="quote"
              rows={3}
              required
              placeholder="Nilai excellent untuk semuanya: pelayanan, hasil kerja, kesabaran dan kecepatan balas chat..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors leading-relaxed"
            />
          </div>

          <div className="md:col-span-2 flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
            >
              Simpan Testimoni
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Testimoni */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Klien</th>
                <th className="p-4">Brand / Logo Kanan Bawah</th>
                <th className="p-4">Isi Testimoni</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {testimonials.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 pl-6 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shadow-xs overflow-hidden shrink-0">
                        {t.avatarUrl ? (
                          <img src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover" />
                        ) : (
                          <span>{t.clientName.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{t.clientName}</div>
                        <div className="text-xs text-slate-500">{t.clientCompany}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-slate-700">
                    {t.companyLogoUrl ? (
                      <img src={t.companyLogoUrl} alt={t.clientCompany} className="h-6 max-w-[90px] object-contain" />
                    ) : (
                      <span className="font-bold text-slate-900">{t.clientCompany}</span>
                    )}
                  </td>
                  <td className="p-4 max-w-md text-slate-600 leading-relaxed">
                    <p className="line-clamp-2">{t.quote}</p>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <form action={handleDelete} className="inline-block">
                      <input type="hidden" name="id" value={t.id} />
                      <button
                        type="submit"
                        className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer border border-rose-200"
                        title="Hapus Testimoni"
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
