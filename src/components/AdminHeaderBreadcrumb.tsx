"use client";

import { usePathname } from "next/navigation";

const ROUTE_LABELS: Record<string, string> = {
  "/admin": "Overview",
  "/admin/services": "Layanan & Portfolio",
  "/admin/work-steps": "Langkah Kerja",
  "/admin/value-props": "Keunggulan Layanan",
  "/admin/products": "Produk Digital",
  "/admin/articles": "Artikel & Blog",
  "/admin/categories": "Kategori",
  "/admin/testimonials": "Testimoni Klien",
  "/admin/orders": "Transaksi DOKU",
  "/admin/settings": "Site Settings",
};

export default function AdminHeaderBreadcrumb() {
  const pathname = usePathname();
  const label = ROUTE_LABELS[pathname] || "Dashboard";

  return (
    <div className="flex items-center gap-2.5 text-sm text-slate-500">
      <span className="font-semibold text-slate-700">Admin</span>
      <span className="text-slate-300">/</span>
      <span className="text-slate-600 font-medium">{label}</span>
    </div>
  );
}

