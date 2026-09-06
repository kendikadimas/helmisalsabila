import Link from "next/link";
import type { Metadata } from "next";
import { Star } from "lucide-react";
import SearchBanner from "@/components/SearchBanner";
import FilterSidebar from "@/components/FilterSidebar";
import Pagination from "@/components/Pagination";
import { getProducts, getProductsCount } from "@/actions/products";
import { getAllCategories } from "@/actions/articles";
import { formatRupiah } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Produk Digital & E-Course | Helmi Salsabila",
  description:
    "Katalog template spreadsheet, mini course praktis, dan aset digital siap pakai untuk kebutuhan profesional dan bisnis.",
};

const PAGE_SIZE = 9;

export default async function ProdukPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategori?: string; sort?: string; harga?: string; page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const offset = (currentPage - 1) * PAGE_SIZE;

  const [products, categories, totalCount] = await Promise.all([
    getProducts({
      searchQuery: params.q,
      categorySlug: params.kategori,
      priceType: params.harga,
      sortBy: params.sort,
      limit: PAGE_SIZE,
      offset,
    }),
    getAllCategories("product"),
    getProductsCount({
      searchQuery: params.q,
      categorySlug: params.kategori,
      priceType: params.harga,
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="space-y-10 pb-16">
      {/* Soft Aqua Search Banner */}
      <SearchBanner
        title="Produk"
        subtitle="Temukan produk digital menarik yang sesuai dengan kebutuhan Anda"
        placeholder="Cari nama produk..."
        defaultValue={params.q || ""}
      />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filter (Categories from DB) */}
          <div className="lg:col-span-1">
            <FilterSidebar
              categories={categories}
              currentCategory={params.kategori}
              currentSort={params.sort}
              currentPriceType={params.harga}
              basePath="/produk"
            />
          </div>

          {/* Product Cards Grid (3 Columns) */}
          <div className="lg:col-span-3 space-y-8">
            {products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                Tidak ada produk digital yang sesuai dengan filter atau pencarian Anda.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((prd) => (
                  <Link
                    key={prd.id}
                    href={`/produk/${prd.slug}`}
                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[16/11] bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden flex items-center justify-center text-white p-6">
                        <div className="w-28 h-36 bg-gradient-to-tr from-amber-500 to-teal-400 rounded-lg shadow-2xl p-3 flex flex-col justify-between text-slate-950 font-extrabold text-xs transform group-hover:scale-105 transition-transform">
                          <span className="text-[10px] tracking-wider uppercase">DIGITAL PRODUCT</span>
                          <span className="text-center text-xs leading-tight font-bold">Product Ideas</span>
                          <div className="flex items-center justify-end gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-2 h-2 fill-slate-900 text-slate-900" />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-[#1E3A5F] transition-colors line-clamp-2">
                          {prd.title}
                        </h3>
                      </div>
                    </div>

                    <div className="px-5 pb-5 flex items-center justify-between border-t border-slate-100 text-xs">
                      <span className="font-bold text-emerald-600 text-sm">{formatRupiah(prd.discountedPrice)}</span>
                      <span className="text-slate-400">Terjual : {prd.totalSales.toLocaleString("id-ID")}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalDataCount={totalCount}
              pageSize={PAGE_SIZE}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
