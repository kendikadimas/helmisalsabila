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
  title: "Artikel & Wawasan Teknologi",
  description:
    "Kumpulan tulisan seputar data analytics, tips spreadsheet, automasi kerja, dan studi kasus implementasi teknologi.",
};

const PAGE_SIZE = 15;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategori?: string; tag?: string; page?: string }>;
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
        tagSlug: params.tag,
        limit: PAGE_SIZE,
        offset,
      }),
      getPopularArticles(),
      getAllCategories("article"),
      getArticlesCount({
        searchQuery: params.q,
        categorySlug: params.kategori,
        tagSlug: params.tag,
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
    if (!img || img.includes("placeholder") || img.includes("/assets/article-")) {
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
          <section className="space-y-5">
            <SectionHeader title="Artikel Populer" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {popularArticles.map((art, idx) => (
                <Link
                  key={art.id}
                  href={`/blog/${art.slug}`}
                  className="group relative aspect-[16/9] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-end p-6 sm:p-7 bg-slate-900"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
                  <img
                    src={getValidArticleImg(art.featuredImage, idx)}
                    alt={art.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="relative z-20 space-y-1.5">
                    <h3 className="text-base sm:text-xl font-bold text-white leading-snug group-hover:text-teal-300 transition-colors line-clamp-2">
                      {art.title}
                    </h3>
                    <div className="text-xs text-slate-200/90">{formatDateIndo(art.publishedAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 2. Semua Artikel Section */}
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionHeader title="Semua Artikel" />
            {params.tag && (
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold hover:bg-teal-100 transition-colors"
              >
                <span>Tag: #{params.tag}</span>
                <span aria-hidden="true">×</span>
              </Link>
            )}
          </div>

          {/* Category Filter Pills matching Artikel.png */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar text-xs">
            <Link
              href="/blog"
              className={`px-4 py-2 rounded-lg border shrink-0 transition-colors ${
                !params.kategori || params.kategori === "all"
                  ? "border-[#1E3A5F] bg-[#E6FAF8] text-[#1E3A5F] font-bold"
                  : "border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50"
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
                    ? "border-[#1E3A5F] bg-[#E6FAF8] text-[#1E3A5F] font-bold"
                    : "border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Clean Borderless Editorial Articles Grid (3 Columns) matching Artikel.png */}
          {articles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              Tidak ada artikel yang sesuai dengan filter atau pencarian Anda.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 pt-2">
              {articles.map((art, idx) => (
                <Link key={art.id} href={`/blog/${art.slug}`} className="group flex flex-col space-y-3">
                  <div className="aspect-[16/10] bg-slate-900 rounded-2xl relative overflow-hidden shadow-xs">
                    <img
                      src={getValidArticleImg(art.featuredImage, idx)}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="space-y-1.5 px-0.5">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-[15px] group-hover:text-[#1E3A5F] transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h3>
                    <div className="text-xs text-slate-400">{formatDateIndo(art.publishedAt)}</div>
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
