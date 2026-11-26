import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Eye, Facebook } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { getArticleBySlug, getArticles, getTrendingArticles, getAllTags } from "@/actions/articles";
import { getSiteSettings } from "@/actions/settings";
import { formatDateIndo, markdownToHtml } from "@/lib/utils";
import SectionHeader from "@/components/SectionHeader";
import ShareButton from "@/components/ShareButton";
import TableOfContents, { type TocHeading } from "@/components/TableOfContents";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug, false);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan | Helmi Salsabila",
    };
  }

  return {
    title: article.title,
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
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") || hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
  const origin = host ? `${proto}://${host}` : process.env.NEXT_PUBLIC_APP_URL || "https://helsenvi.com";
  const articleUrl = `${origin}/blog/${article.slug}`;

  const rawContent = article.content || "";
  const isHtmlContent = /<\/?[a-z][\s\S]*>/i.test(rawContent);
  const htmlSource = isHtmlContent ? rawContent : markdownToHtml(rawContent);
  const cleanHtml = DOMPurify.sanitize(htmlSource);
  const headings: TocHeading[] = [];
  let headingIdx = 0;
  const processedHtml = cleanHtml.replace(
    /<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi,
    (_match, tag, attrs, inner) => {
      const plain = inner.replace(/<[^>]+>/g, "").trim();
      const id = `heading-${++headingIdx}`;
      if (plain) headings.push({ id, text: plain });
      return `<${tag}${attrs} id="${id}" class="scroll-mt-24">${inner}</${tag}>`;
    }
  );

  const publishedTimeStr = article.publishedAt
    ? new Date(article.publishedAt).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      })
    : "";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage ? [article.featuredImage] : [],
    datePublished: article.publishedAt,
    author: {
      "@type": "Person",
      name: authorName,
    },
  };

  return (
    <div className="space-y-12 pb-16 pt-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px] space-y-6">
        {/* Clean Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-slate-900 transition-colors">
            Artikel
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate">Detail Artikel</span>
        </nav>

        {/* 2-Column Grid starting at Title level so Right Sidebar aligns with Article Title matching Detail Artikel.png */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Left Column (col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Article Title & Meta */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {article.title}
              </h1>

              <div className="text-xs text-slate-400">
                {formatDateIndo(article.publishedAt)}
                {publishedTimeStr ? `, ${publishedTimeStr} WIB` : ""} | {article.readingTimeMin || 3} min read
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative">
                    <Image
                      src="/profile-talent.png"
                      alt={authorName}
                      fill
                      className="object-cover object-top"
                      sizes="36px"
                    />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[11px] text-slate-400">Penulis</div>
                    <div className="text-xs font-bold text-slate-900">{authorName}</div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 bg-white shadow-2xs">
                  <Eye className="w-3.5 h-3.5 text-[#2A5D69]" />
                  <span>Sudah Dibaca {article.viewsCount || 1}x</span>
                </div>
              </div>
            </div>

            {/* Featured Hero Image */}
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 shadow-sm relative flex items-center justify-center text-white">
              <img
                src={
                  !article.featuredImage ||
                  article.featuredImage.includes("placeholder") ||
                  article.featuredImage.includes("article-")
                    ? "/assets/artikel.png"
                    : article.featuredImage
                }
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content Typography from DB */}
            <article
              id="article-start"
              className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:pt-3 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:pt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-teal-700 [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />

            {/* Unified Saweria Donation + Bottom Share Card matching Detail Artikel.png */}
            <div className="rounded-2xl border border-[#99F6E4] overflow-hidden shadow-xs">
              {/* Top Part: Saweria */}
              <div className="bg-[#E6FAF8]/80 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 text-center sm:text-left">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-white border border-[#99F6E4] shrink-0 relative">
                    <Image
                      src="/profile-talent.png"
                      alt={authorName}
                      fill
                      className="object-cover object-top"
                      sizes="44px"
                    />
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
                  className="px-6 py-2.5 rounded-xl bg-[#1E3A5F] hover:bg-[#162E4A] text-white font-bold text-xs shadow-xs transition-all shrink-0"
                >
                  Saweria
                </a>
              </div>

              {/* Bottom Part: Bagikan Row with WhatsApp, Facebook, Threads & Salin Link */}
              <div className="bg-white px-5 py-3.5 border-t border-[#99F6E4]/60 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Bagikan</span>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title} - ${articleUrl}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                    aria-label="Share ke WhatsApp"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" fill="currentColor" />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-7 h-7 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                    aria-label="Share ke Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://www.threads.net/intent/post?text=${encodeURIComponent(`${article.title} ${articleUrl}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                    aria-label="Share ke Threads"
                  >
                    <img
                      src="/assets/mingcute_threads-line.png"
                      alt="Threads"
                      className="w-4 h-4 object-contain invert"
                    />
                  </a>
                  <ShareButton
                    label="Salin Link"
                    iconType="copy"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Artikel Terkait Lainnya (Clean Borderless Editorial Cards aligned under Left 8-Col) */}
            <div className="pt-6 space-y-5">
              <SectionHeader title="Artikel Terkait Lainnya" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedArticles.map((art, idx) => (
                  <Link key={art.id} href={`/blog/${art.slug}`} className="group flex flex-col space-y-2.5">
                    <div className="aspect-[16/10] bg-slate-900 rounded-2xl relative overflow-hidden shadow-xs">
                      <img
                        src={
                          !art.featuredImage ||
                          art.featuredImage.includes("placeholder") ||
                          art.featuredImage.includes("article-")
                            ? `/assets/artikel${idx > 0 ? idx : ""}.png`
                            : art.featuredImage
                        }
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-1 px-0.5">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-[#1E3A5F] line-clamp-2 leading-snug">
                        {art.title}
                      </h3>
                      <div className="text-[11px] text-slate-400">{formatDateIndo(art.publishedAt)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Right Column (col-span-4) matching Detail Artikel.png */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
            {/* Top Share Bar (Aligned with Article Title) */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-[#99F6E4] bg-[#E6FAF8]/50 text-xs text-slate-700">
              <span className="font-bold text-slate-900">Bagikan</span>
              <div className="flex items-center gap-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title} - ${articleUrl}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90"
                  aria-label="Share ke WhatsApp"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 text-white" fill="currentColor" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90"
                  aria-label="Share ke Facebook"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <a
                  href={`https://www.threads.net/intent/post?text=${encodeURIComponent(`${article.title} ${articleUrl}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90"
                  aria-label="Share ke Threads"
                >
                  <img
                    src="/assets/mingcute_threads-line.png"
                    alt="Threads"
                    className="w-3.5 h-3.5 object-contain invert"
                  />
                </a>
                <ShareButton
                  label="Salin"
                  iconType="copy"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-medium cursor-pointer"
                />
              </div>
            </div>

            {/* Table of Content Widget */}
            <TableOfContents headings={headings} fallbackTitle={article.title} />

            {/* Artikel Populer (Teal Accent Bar + Clean List matching Detail Artikel.png) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-[#26A69A] rounded-full shrink-0" />
                <h3 className="font-bold text-slate-900 text-sm">Artikel Populer</h3>
              </div>

              <div className="space-y-4 text-xs">
                {trendingArticles.map((art, idx) => (
                  <Link
                    key={art.id}
                    href={`/blog/${art.slug}`}
                    className="block group space-y-2 pb-4 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <h4 className="font-bold text-slate-900 group-hover:text-[#1E3A5F] transition-colors leading-snug text-xs sm:text-[13px]">
                      {art.title}
                    </h4>
                    <div className="flex items-center gap-2.5 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-[#E6FAF8] text-[#2A5D69] font-extrabold tracking-wide">
                        TRENDING #{art.trendingRank || idx + 1}
                      </span>
                      <span className="text-slate-400">{formatDateIndo(art.publishedAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Eksplore Tag (Teal Accent Bar + Tag Chips matching Detail Artikel.png) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-[#26A69A] rounded-full shrink-0" />
                <h3 className="font-bold text-slate-900 text-sm">Eksplore Tag</h3>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                {tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/blog?tag=${tag.slug}`}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-[#2A5D69] hover:text-[#1E3A5F] transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
