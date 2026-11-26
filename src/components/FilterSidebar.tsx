"use client";

import { useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface FilterSidebarProps {
  categories: CategoryOption[];
  currentCategory?: string;
  currentSort?: string;
  currentPriceType?: string;
  freeCount?: number;
  paidCount?: number;
  basePath: string;
}

export default function FilterSidebar({
  categories,
  currentCategory,
  currentSort = "populer",
  currentPriceType,
  freeCount,
  paidCount,
  basePath,
}: FilterSidebarProps) {
  const searchParams = useSearchParams();
  const [catOpen, setCatOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [sortOpen, setSortOpen] = useState(true);

  const buildFilterUrl = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (!value || params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-xs">
        {/* Top Header */}
        <div className="flex items-center justify-between px-1 pb-1">
          <span className="font-bold text-slate-900 text-sm">Filter</span>
          <Link
            href={basePath}
            className="flex items-center gap-1 text-xs text-[#2A5D69] hover:text-[#1E3A5F] font-medium transition-colors"
          >
            <span>Perbarui</span>
            <RotateCcw className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 1. Kategori Accordion */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => setCatOpen(!catOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#E6FAF8] text-xs font-bold text-slate-800 cursor-pointer"
          >
            <span>Kategori</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-600 transition-transform ${catOpen ? "rotate-180" : ""}`} />
          </button>
          {catOpen && (
            <div className="space-y-2.5 px-2 pt-1 text-xs text-slate-600">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={buildFilterUrl("kategori", cat.slug)}
                  className="flex items-center gap-2.5 cursor-pointer hover:text-slate-900 transition-colors"
                >
                  <input
                    type="checkbox"
                    readOnly
                    checked={currentCategory === cat.slug}
                    className="w-3.5 h-3.5 rounded text-teal-600 border-slate-300 focus:ring-teal-500 pointer-events-none"
                  />
                  <span className={currentCategory === cat.slug ? "font-semibold text-slate-900" : ""}>
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 2. Harga Accordion */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => setPriceOpen(!priceOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#E6FAF8] text-xs font-bold text-slate-800 cursor-pointer"
          >
            <span>Harga</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-600 transition-transform ${priceOpen ? "rotate-180" : ""}`} />
          </button>
          {priceOpen && (
            <div className="space-y-2.5 px-2 pt-1 text-xs text-slate-600">
              <Link
                href={buildFilterUrl("harga", "gratis")}
                className="flex items-center justify-between cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="harga"
                    readOnly
                    checked={currentPriceType === "gratis"}
                    className="w-3.5 h-3.5 text-teal-600 border-slate-300 focus:ring-teal-500 pointer-events-none"
                  />
                  <span className={currentPriceType === "gratis" ? "font-semibold text-slate-900" : ""}>
                    Gratis
                  </span>
                </div>
                {typeof freeCount === "number" && (
                  <span className="text-[11px] text-slate-400">({freeCount})</span>
                )}
              </Link>
              <Link
                href={buildFilterUrl("harga", "berbayar")}
                className="flex items-center justify-between cursor-pointer hover:text-slate-900 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="harga"
                    readOnly
                    checked={currentPriceType === "berbayar"}
                    className="w-3.5 h-3.5 text-teal-600 border-slate-300 focus:ring-teal-500 pointer-events-none"
                  />
                  <span className={currentPriceType === "berbayar" ? "font-semibold text-slate-900" : ""}>
                    Berbayar
                  </span>
                </div>
                {typeof paidCount === "number" && (
                  <span className="text-[11px] text-slate-400">({paidCount})</span>
                )}
              </Link>
            </div>
          )}
        </div>

        {/* 3. Urutkan Accordion */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => setSortOpen(!sortOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#E6FAF8] text-xs font-bold text-slate-800 cursor-pointer"
          >
            <span>Urutkan</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-600 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
          </button>
          {sortOpen && (
            <div className="space-y-2.5 px-2 pt-1 text-xs text-slate-600">
              <Link
                href={buildFilterUrl("sort", "populer")}
                className="flex items-center gap-2.5 cursor-pointer hover:text-slate-900 transition-colors"
              >
                <input
                  type="radio"
                  name="sort"
                  readOnly
                  checked={currentSort === "populer"}
                  className="w-3.5 h-3.5 text-teal-600 border-slate-300 focus:ring-teal-500 pointer-events-none"
                />
                <span className={currentSort === "populer" ? "font-semibold text-slate-900" : ""}>
                  Paling Populer
                </span>
              </Link>
              <Link
                href={buildFilterUrl("sort", "terbaru")}
                className="flex items-center gap-2.5 cursor-pointer hover:text-slate-900 transition-colors"
              >
                <input
                  type="radio"
                  name="sort"
                  readOnly
                  checked={currentSort === "terbaru"}
                  className="w-3.5 h-3.5 text-teal-600 border-slate-300 focus:ring-teal-500 pointer-events-none"
                />
                <span className={currentSort === "terbaru" ? "font-semibold text-slate-900" : ""}>
                  Paling Baru
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
