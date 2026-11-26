"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalDataCount: number;
  pageSize: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalDataCount,
  pageSize,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1 && totalDataCount === 0) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const startItem = totalDataCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalDataCount);

  // Generate smart page numbers with ellipsis when totalPages > 6
  const getVisiblePages = (): (number | "...")[] => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages - 1, totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-slate-600 font-medium">
      <div>
        Menampilkan <span className="font-semibold text-slate-900">{startItem}-{endItem}</span> dari{" "}
        <span className="font-semibold text-slate-900">{totalDataCount.toLocaleString("id-ID")}</span> data
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {/* Previous Button */}
          {currentPage > 1 ? (
            <Link
              href={createPageUrl(currentPage - 1)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors font-medium"
              aria-label="Previous Page"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-300 cursor-not-allowed">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </span>
          )}

          {/* Page Numbers */}
          {visiblePages.map((item, idx) =>
            item === "..." ? (
              <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-slate-400">
                ...
              </span>
            ) : item === currentPage ? (
              <span
                key={item}
                className="w-8 h-8 rounded-lg bg-[#1E3A5F] text-white font-bold flex items-center justify-center text-xs shadow-xs"
              >
                {item}
              </span>
            ) : (
              <Link
                key={item}
                href={createPageUrl(item)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-700 font-medium flex items-center justify-center text-xs transition-colors"
              >
                {item}
              </Link>
            )
          )}

          {/* Next Button */}
          {currentPage < totalPages ? (
            <Link
              href={createPageUrl(currentPage + 1)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-900 hover:bg-slate-100 transition-colors font-semibold"
              aria-label="Next Page"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-300 cursor-not-allowed">
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
