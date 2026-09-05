import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Eye, Share2, MessageCircle, Facebook, Copy, ChevronDown } from "lucide-react";
import { getArticleBySlug, getArticles, getTrendingArticles, getAllTags } from "@/actions/articles";
import { getSiteSettings } from "@/actions/settings";
import { formatDateIndo } from "@/lib/utils";
import SectionHeader from "@/components/SectionHeader";
import ShareButton from "@/components/ShareButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan | Helmi Salsabila",
    };
  }

  return {
    title: `${article.title} | Helmi Salsabila`,
    description: article.excerpt || "Baca artikel selengkapnya di website Helmi Salsabila.",
    openGraph: {
      title: article.title,
      description: article.excerpt || "",
      images: article.featuredImage ? [{ url: article.featuredImage }] : [],
    },
  };
}

export default async function DetailArtikelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [article, relatedArticlesAll, trendingArticles, tags, settings] = await Promise.all([
    getArticleBySlug(slug),
    getArticles(4),
    getTrendingArticles(),
    getAllTags(),
    getSiteSettings(),
  ]);

  if (!article) {
    notFound();
  }

  const relatedArticles = relatedArticlesAll.filter((a) => a.slug !== slug).slice(0, 3);
  const saweriaUrl = settings?.saweriaUrl || "https://saweria.co/helmisalsabila";
  const authorName = article.authorName || settings?.siteName || "Helmi Salsabila";

  return (
    <div className="space-y-12 pb-16 pt-6">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px] space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-slate-900 transition-colors">
            Artikel
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate">Detail Artikel</span>
        </nav>

        {/* Article Title & Meta */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          <div className="text-xs text-slate-500">
            {formatDateIndo(article.publishedAt)}, 19:26 WIB | {article.readingTimeMin || 3} min read
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center font-bold text-xs">
                {authorName.charAt(0)}
              </div>
              <div className="text-xs">
                <span className="text-slate-400">Penulis </span>
                <span className="font-bold text-slate-900">{authorName}</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 text-xs text-slate-600 bg-white">
              <Eye className="w-3.5 h-3.5 text-teal-600" />
              <span>Sudah Dibaca {article.viewsCount || 1000}x</span>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Left Column (65% / col-span-8) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Featured Hero Image */}
            <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-slate-900 shadow-sm relative flex items-center justify-center text-white">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950 via-slate-900 to-amber-950 flex items-center justify-center p-8 text-center">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-teal-400 font-bold">FEATURED ARTICLE</span>
                  <h2 className="text-xl sm:text-2xl font-bold max-w-lg">{article.title}</h2>
                </div>
              </div>
            </div>

            {/* Article Content Typography from DB */}
            <article className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {article.content}
            </article>

            {/* Saweria / Donation Box (From DB settings) */}
            <div className="bg-[#E6FAF8]/70 border border-[#99F6E4] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <div className="w-10 h-10 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {authorName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                    Suka dengan artikel {authorName}?
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                    Yuk beri dukungan dengan berdonasi atau bagikan melalui sosial media Anda
                  </p>
                </div>
              </div>

              <a
                href={saweriaUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#1E3A5F] hover:bg-[#162E4A] text-white font-bold text-xs shadow-xs transition-all shrink-0"
              >
                Saweria
              </a>
            </div>

            {/* Bottom Share Row */}
            <div className="flex items-center gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <span className="font-medium">Bagikan</span>
              <div className="flex items-center gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:opacity-90"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-90"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <ShareButton
                  label="Salin Link"
                  iconType="copy"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs transition-colors cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Right Column (35% / col-span-4) */}
          <div className="lg:col-span-4 space-y-8 sticky top-24">
            {/* Top Share Bar */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white shadow-xs text-xs text-slate-600">
              <span className="font-bold text-slate-900">Bagikan</span>
              <div className="flex items-center gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:opacity-90"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-90"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <ShareButton
                  label="Salin"
                  iconType="copy"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 hover:bg-slate-50 text-[11px] cursor-pointer"
                />
              </div>
            </div>

            {/* Table of Content Widget */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm">Table of Content</h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-[#1E3A5F] text-white font-medium flex items-center gap-2">
                  <span className="font-extrabold text-teal-300">01</span>
                  <span className="truncate">{article.title}</span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                  <span className="font-extrabold text-slate-400">02</span>
                  <span>Mengenal Teknologi yang Sedang Berkembang Saat Ini</span>
                </div>
              </div>
              <button className="w-full flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-slate-900 pt-1">
                <span>Lihat Lebih Banyak</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Artikel Populer (Trending Badges) Widget from DB */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm">Artikel Populer</h3>
              <div className="space-y-3.5 text-xs">
                {trendingArticles.map((art, idx) => (
                  <Link
                    key={art.id}
                    href={`/blog/${art.slug}`}
                    className="block group space-y-1.5 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <h4 className="font-bold text-slate-900 group-hover:text-[#1E3A5F] transition-colors leading-snug">
                      {art.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 font-extrabold">
                        TRENDING #{art.trendingRank || idx + 1}
                      </span>
                      <span className="text-slate-400">{formatDateIndo(art.publishedAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Eksplore Tag Widget from DB */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm">Eksplore Tag</h3>
              <div className="flex flex-wrap gap-2 text-xs">
                {tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/blog?tag=${tag.slug}`}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[#1E3A5F] transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Artikel Terkait Lainnya */}
        <div className="pt-12 border-t border-slate-100 space-y-6">
          <SectionHeader title="Artikel Terkait Lainnya" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((art) => (
              <Link
                key={art.id}
                href={`/blog/${art.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] bg-slate-900 relative overflow-hidden flex items-center justify-center text-white p-4">
                    <span className="text-xs font-bold text-teal-400">INSIGHT</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 text-xs group-hover:text-[#1E3A5F] line-clamp-2">
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
        </div>
      </div>
    </div>
  );
}
