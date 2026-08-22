import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  totalDataText?: string;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 68,
  totalDataText = "Menampilkan 1-15 dari 1.250 data",
}: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 border-t border-slate-100 text-xs text-slate-500">
      <div>{totalDataText}</div>

      <div className="flex items-center gap-1.5 font-medium">
        <button
          disabled={currentPage <= 1}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <button className="w-8 h-8 rounded-lg bg-[#1E3A5F] text-white font-bold flex items-center justify-center shadow-xs">
          1
        </button>
        <button className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors">
          2
        </button>
        <button className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors">
          3
        </button>
        <span className="px-1 text-slate-400">...</span>
        <button className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors">
          67
        </button>
        <button className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-colors">
          68
        </button>

        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
