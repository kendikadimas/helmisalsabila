import { Search } from "lucide-react";

interface SearchBannerProps {
  title: string;
  subtitle: string;
  placeholder?: string;
  defaultValue?: string;
}

export default function SearchBanner({
  title,
  subtitle,
  placeholder = "Cari...",
  defaultValue = "",
}: SearchBannerProps) {
  return (
    <div className="bg-gradient-to-br from-[#FFFDF5] via-[#F2FCFB] to-[#DDF6F5] py-12 sm:py-14 px-4 sm:px-6 lg:px-8 text-center rounded-b-[28px] border-b border-[#99F6E4]/40 transition-all">
      <div className="max-w-3xl mx-auto space-y-3.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">{title}</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">{subtitle}</p>

        <div className="pt-2.5 max-w-xl mx-auto">
          <form method="GET" className="relative">
            <input
              type="text"
              name="q"
              defaultValue={defaultValue}
              placeholder={placeholder}
              className="w-full pl-5 pr-12 py-3.5 bg-white rounded-xl border border-[#2A5D69]/35 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-[#2A5D69] shadow-xs transition-all"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 hover:text-teal-600 transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
