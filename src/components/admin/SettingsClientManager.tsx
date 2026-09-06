"use client";

import { useState } from "react";
import { Save, Lock, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { updateSiteSettings } from "@/actions/settings";
import { changePasswordAction } from "@/actions/auth";

export default function SettingsClientManager({ settings }: { settings: any }) {
  const [siteSuccess, setSiteSuccess] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handleSiteUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSiteSuccess(null);
    const formData = new FormData(e.currentTarget);
    const res = await updateSiteSettings(formData);
    setIsSubmitting(false);
    if (res.success) {
      setSiteSuccess("Pengaturan website berhasil disimpan!");
      setTimeout(() => setSiteSuccess(null), 4000);
    } else {
      alert(res.error || "Gagal menyimpan pengaturan.");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsChangingPass(true);
    setPassSuccess(null);
    setPassError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const res = await changePasswordAction(formData);
    setIsChangingPass(false);

    if (res.success) {
      setPassSuccess(res.message || "Password berhasil diperbarui!");
      form.reset();
      setTimeout(() => setPassSuccess(null), 4000);
    } else {
      setPassError(res.error || "Gagal mengubah password.");
    }
  };

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Site Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Konfigurasi hero section, kontak WhatsApp, media sosial, dan keamanan akun.</p>
      </div>

      {/* 1. Form Site Configuration */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <span>Identitas & Konten Website</span>
        </h2>

        {siteSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{siteSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSiteUpdate} className="space-y-6 text-xs sm:text-sm">
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

          {/* Social Media Links */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <h3 className="font-semibold text-slate-800 text-sm">Tautan Media Sosial Resmi</h3>
            <p className="text-xs text-slate-500">Tautan ini otomatis terpasang di Hero, Footer, dan CTA halaman utama.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">LinkedIn Profile URL</label>
                <input
                  type="url"
                  name="linkedin"
                  defaultValue={settings?.socialLinks?.linkedin || "https://linkedin.com"}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 transition-colors font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Instagram Profile URL</label>
                <input
                  type="url"
                  name="instagram"
                  defaultValue={settings?.socialLinks?.instagram || "https://instagram.com"}
                  placeholder="https://instagram.com/username"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 transition-colors font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Threads Profile URL</label>
                <input
                  type="url"
                  name="threads"
                  defaultValue={settings?.socialLinks?.threads || "https://threads.net"}
                  placeholder="https://threads.net/@username"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 transition-colors font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Dribbble Portfolio URL</label>
                <input
                  type="url"
                  name="dribbble"
                  defaultValue={settings?.socialLinks?.dribbble || "https://dribbble.com"}
                  placeholder="https://dribbble.com/username"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 transition-colors font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">YouTube Channel URL</label>
                <input
                  type="url"
                  name="youtube"
                  defaultValue={settings?.socialLinks?.youtube || "https://youtube.com"}
                  placeholder="https://youtube.com/@channel"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 transition-colors font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">TikTok Profile URL</label>
                <input
                  type="url"
                  name="tiktok"
                  defaultValue={settings?.socialLinks?.tiktok || "https://tiktok.com"}
                  placeholder="https://tiktok.com/@username"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 transition-colors font-mono"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-medium text-slate-600">Facebook Page / Profile URL</label>
                <input
                  type="url"
                  name="facebook"
                  defaultValue={settings?.socialLinks?.facebook || "https://facebook.com"}
                  placeholder="https://facebook.com/profile"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 transition-colors font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Form Ganti Password */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-teal-600" />
          <span>Keamanan & Ganti Password Admin</span>
        </h2>

        {passSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{passSuccess}</span>
          </div>
        )}

        {passError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{passError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 text-xs sm:text-sm max-w-md">
          <div className="space-y-1.5">
            <label className="font-medium text-slate-700">Password Saat Ini</label>
            <input
              type="password"
              name="currentPassword"
              required
              placeholder="••••••••"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-slate-700">Password Baru</label>
            <input
              type="password"
              name="newPassword"
              required
              placeholder="Minimal 6 karakter"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-slate-700">Konfirmasi Password Baru</label>
            <input
              type="password"
              name="confirmPassword"
              required
              placeholder="Ulangi password baru"
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isChangingPass}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>{isChangingPass ? "Memperbarui..." : "Update Password"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
