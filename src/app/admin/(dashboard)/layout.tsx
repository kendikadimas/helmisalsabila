import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Package,
  BookOpen,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { logoutAction } from "@/actions/auth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center font-serif font-bold text-xl">
              H
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">CMS Admin</h2>
              <span className="text-[10px] text-teal-400 font-semibold">Portofolio & Blog</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-medium text-slate-400">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-teal-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/services"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Layanan & Portfolio</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Package className="w-4 h-4 text-rose-400" />
              <span>Produk Digital</span>
            </Link>

            <Link
              href="/admin/articles"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Artikel & Blog</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>Site Settings</span>
            </Link>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white text-xs transition-colors"
          >
            <span>Lihat Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main CMS Content Body */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-screen bg-slate-900">{children}</main>
    </div>
  );
}
