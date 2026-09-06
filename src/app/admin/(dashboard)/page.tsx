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
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#21262d]">
        <div>
          <h1 className="text-xl font-semibold text-slate-100 tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-slate-400 mt-1">
            Ringkasan data portofolio, produk digital, dan artikel blog.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-xs font-medium text-slate-300 hover:text-white transition-colors self-start sm:self-auto"
        >
          <span>Buka Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="p-5 rounded-xl bg-[#0d1117] border border-[#21262d] hover:border-[#30363d] transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{stat.title}</span>
                <Icon className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
              </div>
              <div className="text-2xl font-bold text-slate-100 mt-3">{stat.value}</div>
              <div className="text-[11px] text-slate-500 mt-1">{stat.description}</div>
            </Link>
          );
        })}
      </div>

      {/* Grid: Action Cards & Recent Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Quick Access */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Kelola Modul
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/admin/services"
              className="p-4 rounded-xl bg-[#0d1117] border border-[#21262d] hover:border-[#30363d] transition-colors group flex items-start justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                    Layanan & Portfolio
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  {services.length} layanan terdaftar
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors mt-0.5" />
            </Link>

            <Link
              href="/admin/products"
              className="p-4 rounded-xl bg-[#0d1117] border border-[#21262d] hover:border-[#30363d] transition-colors group flex items-start justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                    Produk Digital
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  {products.length} produk aktif
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors mt-0.5" />
            </Link>

            <Link
              href="/admin/articles"
              className="p-4 rounded-xl bg-[#0d1117] border border-[#21262d] hover:border-[#30363d] transition-colors group flex items-start justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                    Artikel & Blog
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  {articles.length} postingan diterbitkan
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors mt-0.5" />
            </Link>

            <Link
              href="/admin/settings"
              className="p-4 rounded-xl bg-[#0d1117] border border-[#21262d] hover:border-[#30363d] transition-colors group flex items-start justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 flex items-center justify-center text-xs text-slate-400">⚙</span>
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                    Site Settings
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  Konfigurasi kontak & identitas
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors mt-0.5" />
            </Link>
          </div>
        </div>

        {/* Right: Recent Articles */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Artikel Terkini
          </h2>

          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#21262d] divide-y divide-[#21262d] space-y-3">
            {articles.slice(0, 4).map((art) => (
              <div key={art.id} className="pt-3 first:pt-0 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="text-teal-400/90 font-medium">{art.category || "Umum"}</span>
                  <span>{art.viewsCount || 0} views</span>
                </div>
                <h3 className="text-xs font-medium text-slate-200 hover:text-teal-300 transition-colors line-clamp-2">
                  <Link href={`/blog/${art.slug}`} target="_blank">
                    {art.title}
                  </Link>
                </h3>
                <div className="text-[10px] text-slate-500 font-mono">
                  {formatDateIndo(art.publishedAt)}
                </div>
              </div>
            ))}

            <div className="pt-3">
              <Link
                href="/admin/articles"
                className="block text-center w-full py-1.5 rounded-lg bg-[#161b22] hover:bg-[#21262d] text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Lihat Semua
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
