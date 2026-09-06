import Link from "next/link";
import { getServices } from "@/actions/services";
import { getProducts } from "@/actions/products";
import { getArticles } from "@/actions/articles";
import {
  Briefcase,
  Package,
  BookOpen,
  Eye,
  ArrowRight,
  ExternalLink,
  Tag,
  ListOrdered,
  Award,
  MessageSquareQuote,
  Settings,
} from "lucide-react";
import { formatDateIndo } from "@/lib/utils";

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
      description: "Layanan jasa & portfolio",
      icon: Briefcase,
      cardBg: "bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border-amber-200/90",
      iconBg: "bg-amber-500 text-white shadow-sm shadow-amber-500/30",
      valueColor: "text-amber-900",
      href: "/admin/services",
    },
    {
      title: "Produk Digital",
      value: products.length,
      description: `${totalSales.toLocaleString("id-ID")} total terjual`,
      icon: Package,
      cardBg: "bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-white border-rose-200/90",
      iconBg: "bg-rose-500 text-white shadow-sm shadow-rose-500/30",
      valueColor: "text-rose-900",
      href: "/admin/products",
    },
    {
      title: "Artikel Diterbitkan",
      value: articles.length,
      description: "Postingan blog",
      icon: BookOpen,
      cardBg: "bg-gradient-to-br from-sky-500/10 via-sky-500/5 to-white border-sky-200/90",
      iconBg: "bg-sky-500 text-white shadow-sm shadow-sky-500/30",
      valueColor: "text-sky-900",
      href: "/admin/articles",
    },
    {
      title: "Total Readers Blog",
      value: totalViews.toLocaleString("id-ID"),
      description: "Akumulasi tayangan artikel",
      icon: Eye,
      cardBg: "bg-gradient-to-br from-teal-500/10 via-teal-500/5 to-white border-teal-200/90",
      iconBg: "bg-teal-500 text-white shadow-sm shadow-teal-500/30",
      valueColor: "text-teal-900",
      href: "/admin/articles",
    },
  ];

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Ringkasan data portofolio, produk digital, dan artikel blog.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors self-start sm:self-auto shadow-xs"
        >
          <span>Buka Website</span>
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </Link>
      </div>

      {/* 4 Rich Colored Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className={`p-6 rounded-2xl border ${stat.cardBg} hover:shadow-md transition-all group space-y-4 shadow-xs`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600">{stat.title}</span>
                <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className={`text-3xl font-extrabold tracking-tight ${stat.valueColor}`}>{stat.value}</div>
                <div className="text-xs text-slate-500 mt-1 font-medium">{stat.description}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Grid: Action Cards & Recent Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Quick Access */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Kelola Modul
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/admin/services"
              className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-white border border-amber-200/80 hover:border-amber-300 hover:shadow-md transition-all group flex items-start justify-between space-x-4 shadow-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-500 text-white shadow-xs">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <span className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                    Layanan & Portfolio
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  {services.length} layanan terdaftar
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform mt-0.5" />
            </Link>

            <Link
              href="/admin/products"
              className="p-6 rounded-2xl bg-gradient-to-br from-rose-50/80 via-white to-white border border-rose-200/80 hover:border-rose-300 hover:shadow-md transition-all group flex items-start justify-between space-x-4 shadow-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-rose-500 text-white shadow-xs">
                    <Package className="w-4 h-4" />
                  </div>
                  <span className="text-base font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
                    Produk Digital
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  {products.length} produk aktif
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-rose-500 group-hover:translate-x-1 transition-transform mt-0.5" />
            </Link>

            <Link
              href="/admin/articles"
              className="p-6 rounded-2xl bg-gradient-to-br from-sky-50/80 via-white to-white border border-sky-200/80 hover:border-sky-300 hover:shadow-md transition-all group flex items-start justify-between space-x-4 shadow-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-sky-500 text-white shadow-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    Artikel & Blog
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  {articles.length} postingan diterbitkan
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-sky-500 group-hover:translate-x-1 transition-transform mt-0.5" />
            </Link>

            <Link
              href="/admin/categories"
              className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-white border border-indigo-200/80 hover:border-indigo-300 hover:shadow-md transition-all group flex items-start justify-between space-x-4 shadow-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500 text-white shadow-xs">
                    <Tag className="w-4 h-4" />
                  </div>
                  <span className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                    Kategori
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  Atur kategori artikel & layanan
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-indigo-500 group-hover:translate-x-1 transition-transform mt-0.5" />
            </Link>

            <Link
              href="/admin/testimonials"
              className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-white border border-emerald-200/80 hover:border-emerald-300 hover:shadow-md transition-all group flex items-start justify-between space-x-4 shadow-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500 text-white shadow-xs">
                    <MessageSquareQuote className="w-4 h-4" />
                  </div>
                  <span className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Testimoni Klien
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  Kelola ulasan & logo brand klien
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition-transform mt-0.5" />
            </Link>

            <Link
              href="/admin/work-steps"
              className="p-6 rounded-2xl bg-gradient-to-br from-cyan-50/80 via-white to-white border border-cyan-200/80 hover:border-cyan-300 hover:shadow-md transition-all group flex items-start justify-between space-x-4 shadow-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-cyan-500 text-white shadow-xs">
                    <ListOrdered className="w-4 h-4" />
                  </div>
                  <span className="text-base font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                    Langkah Kerja
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  Tahapan proses kerja di homepage
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-cyan-500 group-hover:translate-x-1 transition-transform mt-0.5" />
            </Link>

            <Link
              href="/admin/value-props"
              className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-white border border-amber-200/80 hover:border-amber-300 hover:shadow-md transition-all group flex items-start justify-between space-x-4 shadow-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-500 text-white shadow-xs">
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                    Keunggulan Layanan
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  Kenapa memilih layanan saya
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform mt-0.5" />
            </Link>

            <Link
              href="/admin/settings"
              className="p-6 rounded-2xl bg-gradient-to-br from-teal-50/80 via-white to-white border border-teal-200/80 hover:border-teal-300 hover:shadow-md transition-all group flex items-start justify-between space-x-4 shadow-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-teal-500 text-white shadow-xs">
                    <Settings className="w-4 h-4" />
                  </div>
                  <span className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    Site Settings
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  Konfigurasi kontak & identitas
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-teal-500 group-hover:translate-x-1 transition-transform mt-0.5" />
            </Link>
          </div>
        </div>

        {/* Right: Recent Articles */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Artikel Terkini
          </h2>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 divide-y divide-slate-100 space-y-4 shadow-xs">
            {articles.slice(0, 4).map((art) => (
              <div key={art.id} className="pt-4 first:pt-0 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="text-teal-700 font-semibold">{art.category || "Umum"}</span>
                  <span className="font-mono text-xs">{art.viewsCount || 0} views</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 hover:text-teal-700 transition-colors line-clamp-2 leading-snug">
                  <Link href={`/blog/${art.slug}`} target="_blank">
                    {art.title}
                  </Link>
                </h3>
                <div className="text-xs text-slate-400 font-mono">
                  {formatDateIndo(art.publishedAt)}
                </div>
              </div>
            ))}

            <div className="pt-4">
              <Link
                href="/admin/articles"
                className="block text-center w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors border border-slate-200 shadow-xs"
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
