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
    <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
      <h3 className="font-bold text-slate-900 text-sm">Table of Content</h3>
      <div className="space-y-2 text-xs">
        {visibleItems.map((item, idx) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`p-3 rounded-lg flex items-center gap-2 transition-colors ${
              idx === 0
                ? "bg-[#1E3A5F] text-white font-medium"
                : "border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span className={`font-extrabold ${idx === 0 ? "text-teal-300" : "text-slate-400"}`}>
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span className="truncate">{item.text}</span>
          </a>
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-slate-900 pt-1 cursor-pointer"
        >
          <span>{expanded ? "Tampilkan Lebih Sedikit" : "Lihat Lebih Banyak"}</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      )}
    </div>
  );
}

