import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-24 text-center">
      <div className="max-w-md space-y-6">
        <span className="inline-block text-6xl font-black text-[#1E3A5F]">404</span>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Halaman Tidak Ditemukan</h1>
          <p className="text-sm text-slate-500">
            Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tautannya salah.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1E3A5F] text-white text-xs font-semibold hover:bg-[#152842] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
