import Link from "next/link";
import type { Metadata } from "next";
import { Star } from "lucide-react";
import SearchBanner from "@/components/SearchBanner";
import FilterSidebar from "@/components/FilterSidebar";
import Pagination from "@/components/Pagination";
import { getProducts, getProductsCount } from "@/actions/products";
import { getAllCategories } from "@/actions/articles";
import { formatRupiah } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Produk Digital & E-Course",
  description:
    "Katalog template spreadsheet, mini course praktis, dan aset digital siap pakai untuk kebutuhan profesional dan bisnis.",
};

const PAGE_SIZE = 15;

export default async function ProdukPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategori?: string; sort?: string; harga?: string; page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const offset = (currentPage - 1) * PAGE_SIZE;

  let products: any[] = [];
  let categories: any[] = [];
  let totalCount = 0;
  let freeCount = 0;
  let paidCount = 0;
  let totalPages = 1;

  try {
    const res = await Promise.all([
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
      getProductsCount({
        searchQuery: params.q,
        categorySlug: params.kategori,
        priceType: "gratis",
      }),
      getProductsCount({
        searchQuery: params.q,
        categorySlug: params.kategori,
        priceType: "berbayar",
      }),
    ]);

    products = res[0] || [];
    categories = res[1] || [];
    totalCount = res[2] || 0;
    freeCount = res[3] || 0;
    paidCount = res[4] || 0;
    totalPages = Math.ceil(totalCount / PAGE_SIZE);
  } catch (error) {
    console.error("Error loading products page:", error);
  }

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
          {/* Sidebar Filter (Categories & real DB price counts) */}
          <div className="lg:col-span-1">
            <FilterSidebar
              categories={categories}
              currentCategory={params.kategori}
              currentSort={params.sort}
              currentPriceType={params.harga}
              freeCount={freeCount}
              paidCount={paidCount}
              basePath="/produk"
            />
          </div>

          {/* Product Cards Grid (3 Columns, padded rounded thumbnails matching Produk.png) */}
          <div className="lg:col-span-3 space-y-8">
            {products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                Tidak ada produk digital yang sesuai dengan filter atau pencarian Anda.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((prd) => {
                  const rawThumb = prd.thumbnailUrl || "";
                  const resolvedThumb =
                    !rawThumb || rawThumb.includes("placeholder")
                      ? ""
                      : rawThumb.includes("product-branding-builder")
                        ? "/assets/product.png"
                        : rawThumb.includes("product-150-ideas")
                          ? "/assets/product2.png"
                          : rawThumb.includes("product-digital-ideas")
                            ? "/assets/product3.png"
                            : rawThumb;
                  return (
                    <Link
                      key={prd.id}
                      href={`/produk/${prd.slug}`}
                      className="group bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-[16/11] bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center text-white">
                          {resolvedThumb ? (
                            <img
                              src={resolvedThumb}
                              alt={prd.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="p-6 flex items-center justify-center w-full h-full">
                              <div className="w-28 h-36 bg-gradient-to-tr from-amber-500 to-teal-400 rounded-lg shadow-2xl p-3 flex flex-col justify-between text-slate-950 font-extrabold text-xs transform group-hover:scale-105 transition-transform">
                                <span className="text-[10px] tracking-wider uppercase">DIGITAL PRODUCT</span>
                                <span className="text-center text-xs leading-tight font-bold line-clamp-2">
                                  {prd.title}
                                </span>
                                <div className="flex items-center justify-end gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-2 h-2 fill-slate-900 text-slate-900" />
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-3.5 pb-1 px-1">
                          <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-[#1E3A5F] transition-colors line-clamp-2 leading-snug">
                            {prd.title}
                          </h3>
                        </div>
                      </div>

                      <div>
                        <div className="border-t border-slate-100 my-2.5" />
                        <div className="px-1 pb-1 flex items-center justify-between text-xs">
                          <span className="font-bold text-[#059669] text-sm">{formatRupiah(prd.discountedPrice)}</span>
                          <span className="text-slate-500 text-[11px]">
                            Terjual : {(prd.totalSales || 0).toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
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
