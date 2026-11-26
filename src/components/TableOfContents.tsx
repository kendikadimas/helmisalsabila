"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface TocHeading {
  id: string;
  text: string;
}

export default function TableOfContents({
  headings,
  fallbackTitle,
}: {
  headings: TocHeading[];
  fallbackTitle: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const items: TocHeading[] =
    headings.length > 0 ? headings : [{ id: "article-start", text: fallbackTitle }];

  const visibleItems = expanded ? items : items.slice(0, 4);
  const hasMore = items.length > 4;

  return (
    <div className="space-y-3.5">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 bg-[#26A69A] rounded-full shrink-0" />
        <h3 className="font-bold text-slate-900 text-sm">Table of Content</h3>
      </div>

      <div className="p-4 rounded-2xl border border-[#99F6E4] bg-white space-y-2.5 shadow-2xs">
        <div className="space-y-2 text-xs">
          {visibleItems.map((item, idx) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`p-3 rounded-xl flex items-start gap-2.5 transition-colors ${
                idx === 0
                  ? "bg-[#1E3A5F] text-white font-semibold"
                  : "border border-[#38BDF8]/60 bg-[#F8FDFF] text-slate-700 hover:bg-[#E6FAF8]/60"
              }`}
            >
              <span
                className={`font-extrabold shrink-0 ${
                  idx === 0 ? "text-[#F59E0B]" : "text-[#2A5D69]"
                }`}
              >
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="line-clamp-2 leading-snug">{item.text}</span>
            </a>
          ))}
        </div>
        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-start gap-1 text-xs font-semibold text-slate-700 hover:text-[#1E3A5F] pt-1 px-1 cursor-pointer"
          >
            <span>{expanded ? "Tampilkan Lebih Sedikit" : "Lihat Lebih Banyak"}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
