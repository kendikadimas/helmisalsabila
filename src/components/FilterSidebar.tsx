"use client";

import { useState } from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

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
  basePath: string;
}

export default function FilterSidebar({
  categories,
  currentCategory,
  currentSort = "populer",
  currentPriceType = "all",
  basePath,
}: FilterSidebarProps) {
  const [catOpen, setCatOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [sortOpen, setSortOpen] = useState(true);

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-6 shadow-xs">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="font-bold text-slate-900 text-sm">Filter</span>
          <Link
            href={basePath}
            className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
          >
            <span>Perbarui</span>
            <RotateCcw className="w-3 h-3" />
          </Link>
        </div>

        {/* 1. Kategori Accordion */}
        <div className="space-y-3">
          <button
            onClick={() => setCatOpen(!catOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-800"
          >
            <span>Kategori</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${catOpen ? "rotate-180" : ""}`} />
          </button>
          {catOpen && (
            <div className="space-y-2 pt-1 text-xs text-slate-600">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`${basePath}?kategori=${cat.slug}`}
                  className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors"
                >
                  <input
                    type="checkbox"
                    readOnly
                    checked={currentCategory === cat.slug}
                    className="w-3.5 h-3.5 rounded text-teal-600 border-slate-300 focus:ring-teal-500 pointer-events-none"
                  />
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 2. Harga Accordion */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => setPriceOpen(!priceOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-800"
          >
            <span>Harga</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${priceOpen ? "rotate-180" : ""}`} />
          </button>
          {priceOpen && (
            <div className="space-y-2 pt-1 text-xs text-slate-600">
              <Link
                href={`${basePath}?harga=gratis`}
                className="flex items-center justify-between cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="harga"
                    readOnly
                    checked={currentPriceType === "gratis"}
                    className="w-3.5 h-3.5 text-teal-600 border-slate-300 focus:ring-teal-500 pointer-events-none"
                  />
                  <span>Gratis</span>
                </div>
                <span className="text-slate-400 text-[11px]">(5)</span>
              </Link>
              <Link
                href={`${basePath}?harga=berbayar`}
                className="flex items-center justify-between cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="harga"
                    readOnly
                    checked={currentPriceType === "berbayar" || currentPriceType === "all"}
                    className="w-3.5 h-3.5 text-teal-600 border-slate-300 focus:ring-teal-500 pointer-events-none"
                  />
                  <span>Berbayar</span>
                </div>
                <span className="text-slate-400 text-[11px]">(812)</span>
              </Link>
            </div>
          )}
        </div>

        {/* 3. Urutkan Accordion */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-800"
          >
            <span>Urutkan</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
          </button>
          {sortOpen && (
            <div className="space-y-2 pt-1 text-xs text-slate-600">
              <Link
                href={`${basePath}?sort=populer`}
                className="flex items-center gap-2 cursor-pointer hover:text-slate-900"
              >
                <input
                  type="radio"
                  name="sort"
                  readOnly
                  checked={currentSort === "populer"}
                  className="w-3.5 h-3.5 text-teal-600 border-slate-300 focus:ring-teal-500 pointer-events-none"
                />
                <span>Paling Populer</span>
              </Link>
              <Link
                href={`${basePath}?sort=terbaru`}
                className="flex items-center gap-2 cursor-pointer hover:text-slate-900"
              >
                <input
                  type="radio"
                  name="sort"
                  readOnly
                  checked={currentSort === "terbaru"}
                  className="w-3.5 h-3.5 text-teal-600 border-slate-300 focus:ring-teal-500 pointer-events-none"
                />
                <span>Paling Baru</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
