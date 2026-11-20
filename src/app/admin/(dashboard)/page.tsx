import Link from "next/link";
import { getServices } from "@/actions/services";
import { getProducts } from "@/actions/products";
import { getArticles } from "@/actions/articles";
import { getAllOrdersAdmin } from "@/actions/orders";
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
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { formatDateIndo, formatRupiah } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [services, products, articles, orders] = await Promise.all([
    getServices(),
    getProducts(),
    getArticles(),
    getAllOrdersAdmin(),
  ]);

  const totalViews = articles.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
  const totalSales = products.reduce((acc, curr) => acc + (curr.totalSales || 0), 0);

  const paidOrders = orders.filter((o) => o.status === "PAID");
  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const totalRevenue = paidOrders.reduce((acc, curr) => acc + curr.amount, 0);

  const stats = [
    {
      title: "Total Omset DOKU",
      value: formatRupiah(totalRevenue),
      description: `${paidOrders.length} transaksi terverifikasi`,
      icon: TrendingUp,
      cardBg: "bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white border-emerald-200/90",
      iconBg: "bg-emerald-600 text-white shadow-sm shadow-emerald-500/30",
      valueColor: "text-emerald-950 font-mono",
      href: "/admin/orders",
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
      title: "Total Readers Blog",
      value: totalViews.toLocaleString("id-ID"),
      description: `${articles.length} postingan diterbitkan`,
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
            Ringkasan omset penjualan DOKU, produk digital, portofolio, dan blog.
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
              className={`p-6 rounded-2xl border ${stat.cardBg} hover:shadow-md transition-all group shadow-xs`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {stat.title}
                </span>
                <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className={`text-2xl sm:text-3xl font-extrabold ${stat.valueColor} tracking-tight`}>
                {stat.value}
              </div>
              <p className="text-xs text-slate-500 mt-1.5">{stat.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-xs">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Transaksi DOKU Terkini</h2>
              <p className="text-xs text-slate-400">
                {pendingOrders.length > 0
                  ? `${pendingOrders.length} pesanan menunggu pembayaran`
                  : "Semua pesanan termonitor"}
              </p>
            </div>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>Lihat Semua Pesanan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-100">
              <tr>
                <th className="py-2.5 px-3">Invoice</th>
                <th className="py-2.5 px-3">Item</th>
                <th className="py-2.5 px-3">Pembeli</th>
                <th className="py-2.5 px-3">Total</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    Belum ada transaksi online.
                  </td>
                </tr>
              ) : (
                orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">{o.invoiceNumber}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{o.itemTitle}</td>
                    <td className="py-2.5 px-3 text-slate-600">{o.customerName}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{formatRupiah(o.amount)}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          o.status === "PAID"
                            ? "bg-emerald-100 text-emerald-700"
                            : o.status === "PENDING"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {o.status === "PAID" ? (
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        ) : (
                          <Clock className="w-2.5 h-2.5" />
                        )}
                        <span>{o.status}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{formatDateIndo(o.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Grid: Management Modules & Recent Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Quick Access Modules */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Kelola Modul
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/admin/orders"
              className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-white border border-emerald-200/80 hover:border-emerald-300 hover:shadow-md transition-all group flex items-start justify-between space-x-4 shadow-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-xs">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <span className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Pesanan Masuk (DOKU)
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  {orders.length} total pesanan • {pendingOrders.length} pending
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform mt-0.5" />
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
              className="p-6 rounded-2xl bg-gradient-to-br from-teal-50/80 via-white to-white border border-teal-200/80 hover:border-teal-300 hover:shadow-md transition-all group flex items-start justify-between space-x-4 shadow-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-teal-500 text-white shadow-xs">
                    <MessageSquareQuote className="w-4 h-4" />
                  </div>
                  <span className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    Testimoni Klien
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  Ulasan kepuasan klien
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
