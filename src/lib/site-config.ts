// Konfigurasi situs terpusat. Nilai dapat diubah lewat environment variable, bukan hardcode tersebar.
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://helsenvi.com").replace(/\/$/, "");

// Email kontak/pengirim di sisi server (invoice, notifikasi). Isi CONTACT_EMAIL di .env.
export const CONTACT_EMAIL =
  process.env.CONTACT_EMAIL?.trim() || process.env.SMTP_FROM?.trim() || process.env.SMTP_USER?.trim() || "admin@helsenvi.com";

// Fallback nomor WhatsApp hanya dipakai bila Site Settings belum diisi.
export const FALLBACK_PHONE = process.env.CONTACT_PHONE?.trim() || "+6269233221";
