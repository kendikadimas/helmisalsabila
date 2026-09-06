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

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 text-xs text-slate-500 font-medium">
      <div>
        Menampilkan <span className="font-bold text-slate-800">{startItem}-{endItem}</span> dari{" "}
        <span className="font-bold text-slate-800">{totalDataCount}</span> data
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          {/* Previous Button */}
          {currentPage > 1 ? (
            <Link
              href={createPageUrl(currentPage - 1)}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs flex items-center justify-center"
              aria-label="Previous Page"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <div className="p-2 rounded-lg border border-slate-100 bg-slate-50 text-slate-300 opacity-50 cursor-not-allowed flex items-center justify-center">
              <ArrowLeft className="w-3.5 h-3.5" />
            </div>
          )}

          {/* Page Numbers */}
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isCurrent = pageNum === currentPage;

            return isCurrent ? (
              <span
                key={pageNum}
                className="w-8 h-8 rounded-lg bg-[#1E3A5F] text-white font-bold flex items-center justify-center text-xs shadow-xs"
              >
                {pageNum}
              </span>
            ) : (
              <Link
                key={pageNum}
                href={createPageUrl(pageNum)}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium flex items-center justify-center text-xs transition-colors shadow-2xs"
              >
                {pageNum}
              </Link>
            );
          })}

          {/* Next Button */}
          {currentPage < totalPages ? (
            <Link
              href={createPageUrl(currentPage + 1)}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs flex items-center justify-center"
              aria-label="Next Page"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <div className="p-2 rounded-lg border border-slate-100 bg-slate-50 text-slate-300 opacity-50 cursor-not-allowed flex items-center justify-center">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
