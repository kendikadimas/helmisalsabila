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
      href: "/admin/services",
    },
    {
      title: "Produk Digital",
      value: products.length,
      description: `${totalSales.toLocaleString("id-ID")} total terjual`,
      icon: Package,
      href: "/admin/products",
    },
    {
      title: "Artikel Diterbitkan",
      value: articles.length,
      description: "Postingan blog",
      icon: BookOpen,
      href: "/admin/articles",
    },
    {
      title: "Total Readers Blog",
      value: totalViews.toLocaleString("id-ID"),
      description: "Akumulasi tayangan artikel",
      icon: Eye,
      href: "/admin/articles",
    },
  ];

  return (
    <div className="space-y-10 w-full max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#21262d]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-400 mt-1">
            Ringkasan data portofolio, produk digital, dan artikel blog.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-sm font-medium text-slate-200 hover:text-white transition-colors self-start sm:self-auto shadow-sm"
        >
          <span>Buka Website</span>
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </Link>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="p-6 rounded-2xl bg-[#0d1117] border border-[#21262d] hover:border-[#30363d] transition-colors group space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">{stat.title}</span>
                <div className="p-2.5 rounded-xl bg-[#161b22] border border-[#21262d] text-slate-400 group-hover:text-teal-400 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-100 tracking-tight">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1">{stat.description}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Grid: Action Cards & Recent Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Quick Access */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Kelola Modul
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/admin/services"
              className="p-6 rounded-2xl bg-[#0d1117] border border-[#21262d] hover:border-[#30363d] transition-colors group flex items-start justify-between space-x-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-5 h-5 text-amber-400" />
                  <span className="text-base font-semibold text-slate-100 group-hover:text-amber-300 transition-colors">
                    Layanan & Portfolio
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {services.length} layanan terdaftar
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-slate-200 transition-colors mt-0.5" />
            </Link>

            <Link
              href="/admin/products"
              className="p-6 rounded-2xl bg-[#0d1117] border border-[#21262d] hover:border-[#30363d] transition-colors group flex items-start justify-between space-x-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <Package className="w-5 h-5 text-rose-400" />
                  <span className="text-base font-semibold text-slate-100 group-hover:text-rose-300 transition-colors">
                    Produk Digital
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {products.length} produk aktif
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-slate-200 transition-colors mt-0.5" />
            </Link>

            <Link
              href="/admin/articles"
              className="p-6 rounded-2xl bg-[#0d1117] border border-[#21262d] hover:border-[#30363d] transition-colors group flex items-start justify-between space-x-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-5 h-5 text-sky-400" />
                  <span className="text-base font-semibold text-slate-100 group-hover:text-sky-300 transition-colors">
                    Artikel & Blog
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {articles.length} postingan diterbitkan
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-slate-200 transition-colors mt-0.5" />
            </Link>

            <Link
              href="/admin/settings"
              className="p-6 rounded-2xl bg-[#0d1117] border border-[#21262d] hover:border-[#30363d] transition-colors group flex items-start justify-between space-x-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-emerald-400">⚙</span>
                  <span className="text-base font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors">
                    Site Settings
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Konfigurasi kontak & identitas
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-slate-200 transition-colors mt-0.5" />
            </Link>
          </div>
        </div>

        {/* Right: Recent Articles */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Artikel Terkini
          </h2>

          <div className="p-6 rounded-2xl bg-[#0d1117] border border-[#21262d] divide-y divide-[#21262d] space-y-4">
            {articles.slice(0, 4).map((art) => (
              <div key={art.id} className="pt-4 first:pt-0 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="text-teal-400 font-medium">{art.category || "Umum"}</span>
                  <span className="font-mono text-xs">{art.viewsCount || 0} views</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-200 hover:text-teal-300 transition-colors line-clamp-2 leading-snug">
                  <Link href={`/blog/${art.slug}`} target="_blank">
                    {art.title}
                  </Link>
                </h3>
                <div className="text-xs text-slate-500 font-mono">
                  {formatDateIndo(art.publishedAt)}
                </div>
              </div>
            ))}

            <div className="pt-4">
              <Link
                href="/admin/articles"
                className="block text-center w-full py-2.5 rounded-xl bg-[#161b22] hover:bg-[#21262d] text-xs font-semibold text-slate-200 hover:text-white transition-colors border border-[#30363d]"
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
