import Link from "next/link";
import type { Metadata } from "next";
import SearchBanner from "@/components/SearchBanner";
import Pagination from "@/components/Pagination";
import SectionHeader from "@/components/SectionHeader";
import { getArticles, getPopularArticles, getAllCategories, getArticlesCount } from "@/actions/articles";
import { formatDateIndo } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Artikel & Wawasan Teknologi | Helmi Salsabila",
  description:
    "Kumpulan tulisan seputar data analytics, tips spreadsheet, automasi kerja, dan studi kasus implementasi teknologi.",
};

const PAGE_SIZE = 9;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategori?: string; page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const offset = (currentPage - 1) * PAGE_SIZE;

  let articles: any[] = [];
  let popularArticles: any[] = [];
  let categories: any[] = [];
  let totalCount = 0;
  let totalPages = 1;

  try {
    const res = await Promise.all([
      getArticles({
        searchQuery: params.q,
        categorySlug: params.kategori,
        limit: PAGE_SIZE,
        offset,
      }),
      getPopularArticles(),
      getAllCategories("article"),
      getArticlesCount({
        searchQuery: params.q,
        categorySlug: params.kategori,
      }),
    ]);

    articles = res[0] || [];
    popularArticles = res[1] || [];
    categories = res[2] || [];
    totalCount = res[3] || 0;
    totalPages = Math.ceil(totalCount / PAGE_SIZE);
  } catch (error) {
    console.error("Error loading blog page:", error);
  }

  const getValidArticleImg = (img?: string | null, index: number = 0) => {
    if (!img || img.includes("placeholder") || img.includes("article-data-viz") || img.includes("article-nextjs") || img.includes("article-marketing")) {
      const idxNum = index % 4;
      return `/assets/artikel${idxNum > 0 ? idxNum : ""}.png`;
    }
    return img;
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Soft Aqua Search Banner */}
      <SearchBanner
        title="Artikel"
        subtitle="Kumpulan tulisan, insight, dan pengalaman yang saya bagikan untuk Anda"
        placeholder="Cari judul artikel ..."
        defaultValue={params.q || ""}
      />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px] space-y-12">
        {/* 1. Artikel Populer (Top 2 Featured Large Cards from DB) */}
        {popularArticles.length > 0 && (
          <section className="space-y-6">
            <SectionHeader title="Artikel Populer" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {popularArticles.map((art, idx) => (
                <Link
                  key={art.id}
                  href={`/blog/${art.slug}`}
                  className="group relative aspect-[16/9] rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-end p-6 sm:p-8 bg-slate-900"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                  <img
                    src={getValidArticleImg(art.featuredImage, idx)}
                    alt={art.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `/assets/artikel${idx > 0 ? idx % 4 : ""}.png`;
                    }}
                  />

                  <div className="relative z-20 space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-snug group-hover:text-teal-300 transition-colors">
                      {art.title}
                    </h3>
                    <div className="text-xs text-slate-300">{formatDateIndo(art.publishedAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 2. Semua Artikel Section */}
        <section className="space-y-6">
          <SectionHeader title="Semua Artikel" />

          {/* Category Filter Pills (Dynamically from Database) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar text-xs">
            <Link
              href="/blog"
              className={`px-4 py-2 rounded-lg border shrink-0 transition-colors ${
                !params.kategori || params.kategori === "all"
                  ? "border-[#1E3A5F] bg-[#1E3A5F] text-white font-bold"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              Semua Kategori
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?kategori=${cat.slug}`}
                className={`px-4 py-2 rounded-lg border shrink-0 transition-colors ${
                  params.kategori === cat.slug
                    ? "border-[#1E3A5F] bg-[#1E3A5F] text-white font-bold"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Articles Grid (3 Columns) */}
          {articles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              Tidak ada artikel yang sesuai dengan filter atau pencarian Anda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {articles.map((art, idx) => (
                <Link
                  key={art.id}
                  href={`/blog/${art.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/10] bg-slate-900 relative overflow-hidden flex items-center justify-center text-white">
                      <img
                        src={getValidArticleImg(art.featuredImage, idx)}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `/assets/artikel${idx > 0 ? idx % 4 : ""}.png`;
                        }}
                      />
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-[#1E3A5F] transition-colors line-clamp-2">
                        {art.title}
                      </h3>
                    </div>
                  </div>

                  <div className="px-5 pb-5 text-[11px] text-slate-400 border-t border-slate-100">
                    {formatDateIndo(art.publishedAt)}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalDataCount={totalCount}
            pageSize={PAGE_SIZE}
          />
        </section>
      </div>
    </div>
  );
}
