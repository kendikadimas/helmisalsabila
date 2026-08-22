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
    <div className="bg-[#E6FAF8] py-12 px-4 sm:px-6 lg:px-8 text-center transition-all">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">{subtitle}</p>

        <div className="pt-2 max-w-xl mx-auto">
          <form method="GET" className="relative">
            <input
              type="text"
              name="q"
              defaultValue={defaultValue}
              placeholder={placeholder}
              className="w-full pl-4 pr-11 py-3 bg-white rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-xs transition-all"
            />
            <button
              type="submit"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
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
