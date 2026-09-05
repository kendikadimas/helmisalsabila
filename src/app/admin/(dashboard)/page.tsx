import Link from "next/link";
import { getServices } from "@/actions/services";
import { getProducts } from "@/actions/products";
import { getArticles } from "@/actions/articles";
import { Briefcase, Package, BookOpen, Eye, Plus, ArrowRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const services = await getServices();
  const products = await getProducts();
  const articles = await getArticles();

  const totalViews = articles.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);

  const statCards = [
    { title: "Layanan Aktif", count: services.length, icon: Briefcase, color: "text-amber-400", href: "/admin/services" },
    { title: "Produk Digital", count: products.length, icon: Package, color: "text-rose-400", href: "/admin/products" },
    { title: "Artikel Diterbitkan", count: articles.length, icon: BookOpen, color: "text-sky-400", href: "/admin/articles" },
    { title: "Total Views Blog", count: `${totalViews.toLocaleString("id-ID")}+`, icon: Eye, color: "text-emerald-400", href: "/admin/articles" },
  ];

  return (
    <div className="space-y-10 max-w-6xl">
      {/* Top Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Kelola konten portofolio, layanan, produk digital, dan artikel blog secara instan.
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-3 hover:border-slate-600 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{card.title}</span>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className="text-2xl font-extrabold text-white group-hover:text-teal-300 transition-colors">
                {card.count}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Layanan & Portfolio</h3>
              <p className="text-[11px] text-slate-400">Tambah atau ubah deskripsi jasa</p>
            </div>
          </div>
          <Link
            href="/admin/services"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white flex items-center justify-between transition-colors"
          >
            <span>Kelola Layanan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Produk Digital</h3>
              <p className="text-[11px] text-slate-400">Atur harga, diskon & list materi</p>
            </div>
          </div>
          <Link
            href="/admin/products"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white flex items-center justify-between transition-colors"
          >
            <span>Kelola Produk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Artikel Blog</h3>
              <p className="text-[11px] text-slate-400">Tulis artikel, trending & tags</p>
            </div>
          </div>
          <Link
            href="/admin/articles"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white flex items-center justify-between transition-colors"
          >
            <span>Kelola Artikel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
