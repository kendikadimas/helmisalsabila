import Link from "next/link";
import { MousePointer } from "lucide-react";
import SearchBanner from "@/components/SearchBanner";
import FilterSidebar from "@/components/FilterSidebar";
import Pagination from "@/components/Pagination";
import { getServices } from "@/actions/services";
import { getAllCategories } from "@/actions/articles";
import { formatRupiah } from "@/lib/utils";

export default async function LayananPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategori?: string; sort?: string; harga?: string }>;
}) {
  const params = await searchParams;

  const [services, categories] = await Promise.all([
    getServices({
      searchQuery: params.q,
      categorySlug: params.kategori,
      priceType: params.harga,
      sortBy: params.sort,
    }),
    getAllCategories("service"),
  ]);

  return (
    <div className="space-y-10 pb-16">
      {/* Soft Aqua Search Banner */}
      <SearchBanner
        title="Layanan & Portfolio"
        subtitle="Solusi profesional untuk berbagai kebutuhan data dan digital Anda"
        placeholder="Cari nama layanan..."
        defaultValue={params.q || ""}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Filter */}
          <div className="lg:col-span-1">
            <FilterSidebar
              categories={categories}
              currentCategory={params.kategori}
              currentSort={params.sort}
              currentPriceType={params.harga}
              basePath="/layanan"
            />
          </div>

          {/* Right Services Grid */}
          <div className="lg:col-span-3 space-y-8">
            {services.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                Tidak ada layanan yang sesuai dengan filter atau pencarian Anda.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {services.map((srv) => (
                  <Link
                    key={srv.id}
                    href={`/layanan/${srv.slug}`}
                    className="group bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[16/10] bg-slate-950 rounded-xl relative overflow-hidden flex items-center justify-center p-3">
                        {srv.slug.includes("data-analyst") ? (
                          <div className="w-full h-full bg-[#020B14] rounded-lg flex flex-col items-center justify-center text-center p-3 relative overflow-hidden">
                            <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-600/30 rounded-full blur-xl pointer-events-none" />
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-cyan-600/20 rounded-full blur-xl pointer-events-none" />

                            <span className="absolute top-2 left-2.5 text-[8px] sm:text-[9px] tracking-wider text-cyan-200 font-bold uppercase">
                              WITHHELS
                            </span>
                            <h4 className="text-2xl sm:text-3xl font-black text-cyan-100 tracking-wider my-1 uppercase font-sans">
                              DATA ANALYST
                            </h4>
                            <div className="relative inline-flex items-center gap-1 px-3.5 py-0.5 bg-[#A5F3FC] text-slate-950 font-extrabold text-[10px] sm:text-[11px] tracking-wide mt-1.5 shadow-xs">
                              <span>SWIPE TO PORTFOLIO</span>
                              <MousePointer className="w-3.5 h-3.5 text-red-500 fill-red-500 absolute -bottom-2 -right-1 transform -rotate-12" />
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 text-cyan-400 text-[10px] font-bold">✦</span>
                          </div>
                        ) : srv.slug.includes("data-entry") ? (
                          <div className="w-full h-full bg-white rounded-lg flex flex-col items-center justify-center p-3 border border-slate-200 text-slate-900 text-center">
                            <div className="text-[9px] font-bold text-slate-500 mb-2">
                              Document to Website & Website to Document
                            </div>
                            <div className="flex items-center justify-center gap-4 w-full px-2">
                              <div className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px]">
                                Document
                              </div>
                              <div className="text-red-500 font-extrabold text-sm">⇄</div>
                              <div className="bg-orange-500 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                                Website
                              </div>
                            </div>
                            <div className="flex items-center justify-center gap-1.5 mt-2">
                              <span className="px-1 py-0.5 rounded bg-blue-600 text-white text-[8px] font-bold">W</span>
                              <span className="px-1 py-0.5 rounded bg-green-600 text-white text-[8px] font-bold">X</span>
                              <span className="px-1 py-0.5 rounded bg-orange-600 text-white text-[8px] font-bold">P</span>
                              <span className="px-1 py-0.5 rounded bg-emerald-600 text-white text-[8px] font-bold">E</span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full bg-slate-50 rounded-lg flex flex-col items-center justify-center p-3 border border-slate-200 text-slate-900 text-center relative">
                            <div className="px-2.5 py-0.5 rounded-full bg-[#1E3A5F] text-white text-[9px] font-bold mb-1">
                              Solusi
                            </div>
                            <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                              {srv.title.split("(")[0]}
                            </h4>
                            <span className="text-[10px] text-slate-600 font-medium">
                              untuk Skripsi, Tesis & Penelitian
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="pt-3 pb-1 px-1">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#1E3A5F] transition-colors line-clamp-2">
                          {srv.title}
                        </h3>
                      </div>
                    </div>

                    <div>
                      <div className="border-t border-slate-100 my-2.5" />
                      <div className="px-1 pb-1 flex items-center gap-2 text-xs">
                        <span className="text-slate-500 font-normal">Harga Mulai</span>
                        <span className="font-bold text-[#059669] text-xs sm:text-sm">{formatRupiah(srv.priceStartingAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination Component */}
            <Pagination totalDataText={`Menampilkan 1-${services.length} dari ${services.length} data`} />
          </div>
        </div>
      </div>
    </div>
  );
}
