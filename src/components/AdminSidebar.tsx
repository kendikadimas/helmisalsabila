"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Package,
  BookOpen,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  ChevronRight,
} from "lucide-react";

interface AdminSidebarProps {
  logoutAction: () => Promise<void>;
  userEmail?: string;
}

export default function AdminSidebar({ logoutAction, userEmail = "admin@helmisalsabila.com" }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      activeColor: "text-teal-400 bg-teal-500/10 border-teal-500/30",
      badge: null,
    },
    {
      label: "Layanan & Portfolio",
      href: "/admin/services",
      icon: Briefcase,
      activeColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
      badge: null,
    },
    {
      label: "Produk Digital",
      href: "/admin/products",
      icon: Package,
      activeColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
      badge: null,
    },
    {
      label: "Artikel & Blog",
      href: "/admin/articles",
      icon: BookOpen,
      activeColor: "text-sky-400 bg-sky-500/10 border-sky-500/30",
      badge: null,
    },
    {
      label: "Site Settings",
      href: "/admin/settings",
      icon: Settings,
      activeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Top Header Bar */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-[1.5px]">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-teal-400 text-base">
              H
            </div>
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">helsenvi.com</h2>
            <p className="text-[10px] text-teal-400 font-medium">Admin Dashboard</p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar Container - Full height sticky on desktop */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 w-72 bg-slate-950/95 md:bg-slate-950 border-r border-slate-800/80 p-5 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-8">
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-sky-500 to-indigo-500 p-[2px] shadow-lg shadow-teal-500/10">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-extrabold text-white text-lg">
                  H
                </div>
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-white tracking-tight">helsenvi.com</h2>
                <p className="text-[11px] text-teal-400 font-medium">Admin Dashboard</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="space-y-2">
            <div className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Main Menu
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                      isActive
                        ? `${item.activeColor} shadow-md shadow-slate-950`
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 hover:border-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                          isActive ? "text-current" : "text-slate-400 group-hover:text-slate-200"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {isActive ? (
                      <ChevronRight className="w-3.5 h-3.5 opacity-80" />
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Info Widget in Sidebar */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/40 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] font-bold text-teal-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CMS Admin Panel</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Semua perubahan tersinkronisasi otomatis ke website publik.
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-5 border-t border-slate-800/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800/60 text-slate-300 hover:text-white hover:bg-slate-900 text-xs font-medium transition-all group"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-teal-400 group-hover:rotate-12 transition-transform" />
              <span>Pratinjau Live Website</span>
            </span>
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 border border-transparent text-xs font-semibold transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>Keluar dari Admin</span>
              </div>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
