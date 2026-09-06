import { getSiteSettings, updateSiteSettings } from "@/actions/settings";
import { Settings, Save, Sparkles, Phone, MapPin, HeartHandshake } from "lucide-react";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateSiteSettings(formData);
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-300 mb-2">
          <Settings className="w-3.5 h-3.5" />
          <span>Konfigurasi Global</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Site Settings & Identitas
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Konfigurasi headline landing page, nomor kontak resmi WhatsApp, dan link donasi Saweria.
        </p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <form action={handleUpdate} className="space-y-6 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Headline Hero Section</span>
            </label>
            <input
              type="text"
              name="heroTitle"
              defaultValue={settings?.heroTitle || "Data & Digital Solutions."}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Subtitle Hero Section</span>
            </label>
            <input
              type="text"
              name="heroSubtitle"
              defaultValue={settings?.heroSubtitle || "Masalah ditemukan. Solusi diarahkan. Pilihan terbaik direkomendasikan."}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nomor WhatsApp Resmi</span>
              </label>
              <input
                type="text"
                name="contactPhone"
                defaultValue={settings?.contactPhone || "+6269233221"}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Lokasi / Alamat</span>
              </label>
              <input
                type="text"
                name="contactAddress"
                defaultValue={settings?.contactAddress || "Based in Tangerang, Indonesia"}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
              <span>URL Saweria (Widget Donasi di Detail Artikel)</span>
            </label>
            <input
              type="url"
              name="saweriaUrl"
              defaultValue={settings?.saweriaUrl || "https://saweria.co/helmisalsabila"}
              placeholder="https://saweria.co/username"
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Konfigurasi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
