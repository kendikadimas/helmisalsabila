"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Package,
  BookOpen,
  Tag,
  ListOrdered,
  Award,
  Ticket,
  MessageSquareQuote,
  CreditCard,
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

  const navGroups = [
    {
      title: "Ringkasan",
      items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
    },
    {
      title: "Penjualan",
      items: [
        { label: "Transaksi DOKU", href: "/admin/orders", icon: CreditCard },
        { label: "Produk Digital", href: "/admin/products", icon: Package },
        { label: "Voucher", href: "/admin/vouchers", icon: Ticket },
      ],
    },
    {
      title: "Konten Website",
      items: [
        { label: "Layanan & Portfolio", href: "/admin/services", icon: Briefcase },
        { label: "Langkah Kerja", href: "/admin/work-steps", icon: ListOrdered },
        { label: "Keunggulan Layanan", href: "/admin/value-props", icon: Award },
        { label: "Testimoni Klien", href: "/admin/testimonials", icon: MessageSquareQuote },
      ],
    },
    {
      title: "Blog",
      items: [
        { label: "Artikel & Blog", href: "/admin/articles", icon: BookOpen },
        { label: "Kategori", href: "/admin/categories", icon: Tag },
      ],
    },
    {
      title: "Sistem",
      items: [{ label: "Site Settings", href: "/admin/settings", icon: Settings }],
    },
  ];
  return (
    <>
      {/* Mobile Top Header Bar */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-[#0F172A] border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src="/logoku-1.png" alt="Logo" className="w-9 h-9 rounded-full ring-2 ring-white/80" />
          <div>
            <h2 className="font-semibold text-sm text-white">helsenvi.com</h2>
            <p className="text-xs text-slate-400">Admin Dashboard</p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Sidebar Container - Dark Slate Navy */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 w-64 lg:w-72 bg-[#0F172A] text-slate-300 border-r border-slate-800 p-5 lg:p-6 flex flex-col gap-3 shrink-0 transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-6 flex-1 min-h-0 overflow-y-auto pr-1 -mr-1">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3.5">
              <img src="/logoku-1.png" alt="Logo" className="w-10 h-10 rounded-full ring-2 ring-white/80 shadow-sm" />
              <div>
                <h2 className="font-bold text-base text-white tracking-tight">helsenvi.com</h2>
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
          <nav className="space-y-5">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1.5">
                <div className="px-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  {group.title}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-teal-500/15 text-teal-300 font-semibold border border-teal-500/30 shadow-xs"
                            : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent"
                        }`}
                      >
                        <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-teal-400" : "text-slate-400"}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
        {/* Bottom Actions */}
        <div className="pt-5 border-t border-slate-800 space-y-1.5 pb-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 text-sm font-medium transition-colors"
          >
            <span className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <span>Lihat Website</span>
            </span>
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-sm font-medium transition-colors cursor-pointer"
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
