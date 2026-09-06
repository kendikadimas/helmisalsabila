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
    },
    {
      label: "Layanan & Portfolio",
      href: "/admin/services",
      icon: Briefcase,
    },
    {
      label: "Produk Digital",
      href: "/admin/products",
      icon: Package,
    },
    {
      label: "Artikel & Blog",
      href: "/admin/articles",
      icon: BookOpen,
    },
    {
      label: "Site Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Top Header Bar */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-[#0d1117] border-b border-[#21262d] sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center font-bold text-teal-400 text-sm">
            H
          </div>
          <div>
            <h2 className="font-semibold text-sm text-slate-100">helsenvi.com</h2>
            <p className="text-xs text-slate-500">Admin Dashboard</p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-[#161b22] border border-[#30363d] text-slate-300 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 w-64 lg:w-72 bg-[#0d1117] border-r border-[#21262d] p-5 lg:p-6 flex flex-col justify-between shrink-0 transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-8">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center font-bold text-teal-400 text-base">
                H
              </div>
              <div>
                <h2 className="font-bold text-base text-slate-100 tracking-tight">helsenvi.com</h2>
                <p className="text-xs text-slate-400">Admin Dashboard</p>
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
            <div className="px-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Menu Utama
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
                    className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-teal-500/10 text-teal-300 font-semibold border border-teal-500/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-[#161b22] border border-transparent"
                    }`}
                  >
                    <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-teal-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-5 border-t border-[#21262d] space-y-1.5 pb-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-[#161b22] text-sm font-medium transition-colors"
          >
            <span className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-slate-500" />
              <span>Lihat Website</span>
            </span>
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-rose-400/90 hover:text-rose-400 hover:bg-rose-500/10 text-sm font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
