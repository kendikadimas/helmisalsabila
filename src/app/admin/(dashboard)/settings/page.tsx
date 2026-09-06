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
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Site Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Konfigurasi hero section, kontak WhatsApp, dan URL Saweria.</p>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <form action={handleUpdate} className="space-y-6 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <label className="font-medium text-slate-700">Headline Hero Section</label>
            <input
              type="text"
              name="heroTitle"
              defaultValue={settings?.heroTitle || "Data & Digital Solutions."}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-slate-700">Subtitle Hero Section</label>
            <input
              type="text"
              name="heroSubtitle"
              defaultValue={settings?.heroSubtitle || "Masalah ditemukan. Solusi diarahkan. Pilihan terbaik direkomendasikan."}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="font-medium text-slate-700">Nomor WhatsApp Resmi</label>
              <input
                type="text"
                name="contactPhone"
                defaultValue={settings?.contactPhone || "+6269233221"}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-slate-700">Lokasi / Alamat</label>
              <input
                type="text"
                name="contactAddress"
                defaultValue={settings?.contactAddress || "Based in Tangerang, Indonesia"}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-slate-700">URL Saweria (Donasi Artikel)</label>
            <input
              type="url"
              name="saweriaUrl"
              defaultValue={settings?.saweriaUrl || "https://saweria.co/helmisalsabila"}
              placeholder="https://saweria.co/username"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 transition-colors font-mono"
            />
          </div>

          {/* Counter Banner Stats */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h3 className="font-semibold text-slate-800 text-sm">Angka Counter Stats Ribbon (Landing Page)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Tahun Pengalaman</label>
                <input
                  type="text"
                  name="statsYears"
                  defaultValue={settings?.statsCounters?.years || "5+"}
                  placeholder="5+"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 transition-colors font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Klien Sudah Percaya</label>
                <input
                  type="text"
                  name="statsClients"
                  defaultValue={settings?.statsCounters?.clients || "100+"}
                  placeholder="100+"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 transition-colors font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Project Selesai</label>
                <input
                  type="text"
                  name="statsProjects"
                  defaultValue={settings?.statsCounters?.projects || "100%"}
                  placeholder="100%"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 transition-colors font-mono font-bold"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
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
