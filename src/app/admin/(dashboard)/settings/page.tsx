import { getSiteSettings, updateSiteSettings } from "@/actions/settings";
import { Save } from "lucide-react";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateSiteSettings(formData);
  }

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="pb-4 border-b border-[#21262d]">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">Site Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Konfigurasi hero section, kontak WhatsApp, dan URL Saweria.</p>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1117] border border-[#21262d]">
        <form action={handleUpdate} className="space-y-6 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <label className="font-medium text-slate-300">Headline Hero Section</label>
            <input
              type="text"
              name="heroTitle"
              defaultValue={settings?.heroTitle || "Data & Digital Solutions."}
              className="w-full p-3 bg-[#090d13] border border-[#30363d] rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-slate-300">Subtitle Hero Section</label>
            <input
              type="text"
              name="heroSubtitle"
              defaultValue={settings?.heroSubtitle || "Masalah ditemukan. Solusi diarahkan. Pilihan terbaik direkomendasikan."}
              className="w-full p-3 bg-[#090d13] border border-[#30363d] rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="font-medium text-slate-300">Nomor WhatsApp Resmi</label>
              <input
                type="text"
                name="contactPhone"
                defaultValue={settings?.contactPhone || "+6269233221"}
                className="w-full p-3 bg-[#090d13] border border-[#30363d] rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-slate-300">Lokasi / Alamat</label>
              <input
                type="text"
                name="contactAddress"
                defaultValue={settings?.contactAddress || "Based in Tangerang, Indonesia"}
                className="w-full p-3 bg-[#090d13] border border-[#30363d] rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-slate-300">URL Saweria (Donasi Artikel)</label>
            <input
              type="url"
              name="saweriaUrl"
              defaultValue={settings?.saweriaUrl || "https://saweria.co/helmisalsabila"}
              placeholder="https://saweria.co/username"
              className="w-full p-3 bg-[#090d13] border border-[#30363d] rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500 transition-colors font-mono"
            />
          </div>

          <div className="pt-4 border-t border-[#21262d] flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
