import Link from "next/link";
import { getServices } from "@/actions/services";
import { getProducts } from "@/actions/products";
import { getArticles } from "@/actions/articles";
import {
  Briefcase,
  Package,
  BookOpen,
  Eye,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Layers,
  FileText,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { formatRupiah, formatDateIndo } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [services, products, articles] = await Promise.all([
    getServices(),
    getProducts(),
    getArticles(),
  ]);

  const totalViews = articles.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
  const totalSales = products.reduce((acc, curr) => acc + (curr.totalSales || 0), 0);

  const stats = [
    {
      title: "Layanan Aktif",
      value: services.length,
      subtext: "Layanan jasa & konsultasi",
      icon: Briefcase,
      color: "text-amber-400",
      bgGradient: "from-amber-500/10 via-amber-500/5 to-transparent",
      borderColor: "border-amber-500/20 hover:border-amber-500/40",
      href: "/admin/services",
    },
    {
      title: "Produk Digital",
      value: products.length,
      subtext: `${totalSales.toLocaleString("id-ID")} total terjual`,
      icon: Package,
      color: "text-rose-400",
      bgGradient: "from-rose-500/10 via-rose-500/5 to-transparent",
      borderColor: "border-rose-500/20 hover:border-rose-500/40",
      href: "/admin/products",
    },
    {
      title: "Artikel Diterbitkan",
      value: articles.length,
      subtext: "Postingan blog edukasi",
      icon: BookOpen,
      color: "text-sky-400",
      bgGradient: "from-sky-500/10 via-sky-500/5 to-transparent",
      borderColor: "border-sky-500/20 hover:border-sky-500/40",
      href: "/admin/articles",
    },
    {
      title: "Total Readers Blog",
      value: totalViews.toLocaleString("id-ID"),
      subtext: "Akumulasi total tayangan",
      icon: Eye,
      color: "text-emerald-400",
      bgGradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
      borderColor: "border-emerald-500/20 hover:border-emerald-500/40",
      href: "/admin/articles",
    },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-slate-800/80 p-8 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-[11px] font-semibold text-teal-300">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Helmi Salsabila Content Management Suite</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Selamat datang, Admin!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Pantau performa konten, kelola katalog produk digital, perbarui penawaran layanan profesional, dan publikasikan artikel blog langsung dari satu tempat.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm"
            >
              <span>Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Rich KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-b ${stat.bgGradient} bg-slate-900/60 border ${stat.borderColor} p-6 space-y-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-950 group`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-slate-900 border border-slate-800 ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <div>
                <div className="text-3xl font-extrabold text-white tracking-tight group-hover:text-teal-300 transition-colors">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-slate-300 mt-1">{stat.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{stat.subtext}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Grid: Management Hub + Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Quick Action Center */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-400" />
                <span>Pusat Pengelolaan Konten</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Akses cepat ke masing-masing modul database.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Layanan */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 space-y-4 hover:border-amber-500/30 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                    {services.length} items
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    Layanan & Portfolio
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Ubah deskripsi jasa analisis data, visualisasi BI, dan penawaran freelance.
                  </p>
                </div>
              </div>

              <Link
                href="/admin/services"
                className="w-full mt-4 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors border border-slate-700/60"
              >
                <span>Buka Panel Layanan</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Produk */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 space-y-4 hover:border-rose-500/30 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <Package className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">
                    {products.length} items
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                    Produk Digital
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Atur harga normal, diskon, modul silabus pembelajaran, dan status penjualan.
                  </p>
                </div>
              </div>

              <Link
                href="/admin/products"
                className="w-full mt-4 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors border border-slate-700/60"
              >
                <span>Buka Panel Produk</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Blog */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 space-y-4 hover:border-sky-500/30 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md">
                    {articles.length} posts
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                    Artikel & Edukasi
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Tulis artikel SEO baru, atur trending rank, dan pilih highlight populer.
                  </p>
                </div>
              </div>

              <Link
                href="/admin/articles"
                className="w-full mt-4 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-sky-500/20 hover:text-sky-300 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors border border-slate-700/60"
              >
                <span>Buka Panel Artikel</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Site Settings */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 space-y-4 hover:border-emerald-500/30 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    Config
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Site Identity & Kontak
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Perbarui kontak WhatsApp, tautan donasi Saweria, dan teks hero banner.
                  </p>
                </div>
              </div>

              <Link
                href="/admin/settings"
                className="w-full mt-4 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors border border-slate-700/60"
              >
                <span>Buka Pengaturan</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Published Articles Widget */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-400" />
              <span>Artikel Terkini</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Daftar postingan terakhir di blog.</p>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 divide-y divide-slate-800/70 space-y-3">
            {articles.slice(0, 4).map((art) => (
              <div key={art.id} className="pt-3 first:pt-0 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="text-teal-400 font-semibold">{art.category || "Umum"}</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Eye className="w-3 h-3 text-slate-400" />
                    {art.viewsCount || 0}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white hover:text-teal-300 transition-colors line-clamp-2">
                  <Link href={`/blog/${art.slug}`} target="_blank">
                    {art.title}
                  </Link>
                </h4>
                <div className="text-[10px] text-slate-500 font-mono">
                  {formatDateIndo(art.publishedAt)}
                </div>
              </div>
            ))}

            <div className="pt-4">
              <Link
                href="/admin/articles"
                className="block text-center w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-sky-400 transition-colors border border-slate-700/50"
              >
                Lihat Semua Artikel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
