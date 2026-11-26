import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BarChart3, FileText, BookOpen, Star, ExternalLink } from "lucide-react";
import { getProductBySlug } from "@/actions/products";
import { getSiteSettings } from "@/actions/settings";
import { formatRupiah } from "@/lib/utils";
import ShareButton from "@/components/ShareButton";
import DokuCheckoutModal from "@/components/DokuCheckoutModal";
import ProductFaqAccordion from "@/components/ProductFaqAccordion";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { FALLBACK_PHONE } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan | Helmi Salsabila",
    };
  }

  return {
    title: `${product.title} | Produk Digital`,
    description:
      product.aboutProduct?.substring(0, 160) ||
      "Dapatkan template dan modul pembelajaran eksklusif dari Helmi Salsabila.",
    openGraph: {
      title: product.title,
      description: product.aboutProduct?.substring(0, 160) || "",
      images: product.thumbnailUrl ? [{ url: product.thumbnailUrl }] : [],
    },
  };
}

function parseJsonArray(val: unknown): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return [val];
    }
  }
  return [];
}

export default async function DetailProdukPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
  ]);

  if (!product) {
    notFound();
  }

  const contactPhone = settings?.contactPhone || FALLBACK_PHONE;
  const whatYouGet = parseJsonArray(product.whatYouGet);
  const suitableFor = parseJsonArray(product.suitableFor);

  const rawThumb = product.thumbnailUrl || "";
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

  const galleryThumbs =
    product.galleries && product.galleries.length > 0
      ? product.galleries.slice(0, 4).map((g) => g.imageUrl)
      : resolvedThumb
        ? [resolvedThumb, "/assets/product.png", "/assets/product2.png", "/assets/product3.png"]
        : [];

  return (
    <div className="space-y-12 pb-16 pt-6">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px] space-y-6">
        {/* Clean Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/produk" className="hover:text-slate-900 transition-colors">
            Produk
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate">Detail</span>
        </nav>

        {/* Top Product Container Box (Cyan Border matching Detail Produk.png) */}
        <div className="bg-white rounded-3xl border border-[#38BDF8] p-5 sm:p-8 lg:p-10 space-y-8 shadow-xs">
          {/* Top Half: Cover + Pricing & Buy */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Column: 3D Product Cover & 4 Small Preview Thumbnails */}
            <div className="md:col-span-5 space-y-3">
              <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 via-rose-50 to-teal-50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner">
                {resolvedThumb ? (
                  <img
                    src={resolvedThumb}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-6 flex items-center justify-center w-full h-full">
                    <div className="w-44 h-56 bg-gradient-to-tr from-amber-400 via-rose-300 to-teal-300 rounded-xl shadow-2xl p-4 flex flex-col justify-between text-slate-950 font-extrabold border-2 border-white/80">
                      <span className="text-[10px] tracking-wider uppercase text-slate-700">Digital Product</span>
                      <div className="text-center space-y-1">
                        <div className="w-10 h-10 mx-auto rounded-lg bg-white/80 flex items-center justify-center text-slate-900 shadow-xs">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div className="text-sm leading-tight font-extrabold">{product.title}</div>
                      </div>
                      <div className="flex items-center justify-end gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-2 h-2 fill-slate-900 text-slate-900" />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4 Small Preview Thumbnails */}
              {galleryThumbs.length > 0 && (
                <div className="grid grid-cols-4 gap-2.5">
                  {galleryThumbs.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden border border-slate-200"
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.title} preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Level Badge, Title, Compact Stacked Pricing Box & Clean CTA */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                {/* Level Badge inside Soft Aqua Pill matching Detail Produk.png */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#E6FAF8] border border-[#99F6E4] text-[#2A5D69] text-xs font-semibold">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>{product.levelBadge || "Semua Level"}</span>
                </div>

                {/* Product Title */}
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {product.title}
                </h1>

                {/* Compact Stacked Pricing Box matching Detail Produk.png */}
                <div className="inline-flex flex-col gap-2 bg-[#E6FAF8] rounded-xl px-4 py-3.5 min-w-[210px]">
                  {product.discountPercent > 0 && (
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded bg-[#2A5D69] text-white font-bold text-[11px]">
                        Diskon {product.discountPercent}%
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-2.5">
                    {product.discountPercent > 0 && (
                      <span className="line-through text-slate-400 text-xs sm:text-sm">
                        {formatRupiah(product.originalPrice)}
                      </span>
                    )}
                    <span className="text-lg sm:text-xl font-extrabold text-[#059669]">
                      {formatRupiah(product.discountedPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Clean Action Buttons matching Detail Produk.png + preserving DOKU, WA, & Live Demo */}
              <div className="space-y-3 pt-4 max-w-md">
                {product.purchaseLinkExternal ? (
                  <a
                    href={product.purchaseLinkExternal}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#1E3A5F] hover:bg-[#162E4A] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>Beli Produk Ini</span>
                  </a>
                ) : (
                  <DokuCheckoutModal
                    itemType="product"
                    itemId={product.id}
                    itemTitle={product.title}
                    amount={product.discountedPrice || product.originalPrice}
                    buttonLabel="Beli Produk Ini"
                    className="w-full py-3 px-4 rounded-xl bg-[#1E3A5F] hover:bg-[#162E4A] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  />
                )}

                <ShareButton
                  label="Bagikan"
                  className="w-full py-3 px-4 rounded-xl bg-white border border-[#1E3A5F]/40 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                />

                {/* Secondary subtle utility row for WhatsApp & Live Demo */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-xs">
                  <a
                    href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}?text=Halo,%20saya%20ingin%20bertanya%20tentang%20produk:%20${encodeURIComponent(
                      product.title
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-slate-500 hover:text-emerald-700 font-medium transition-colors"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" />
                    <span>Tanya via WhatsApp</span>
                  </a>

                  {product.liveDemoUrl && (
                    <a
                      href={product.liveDemoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[#1E3A5F] font-medium transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Lihat Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Section: Tentang Produk */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-[#26A69A] rounded-full" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Tentang Produk</h2>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.aboutProduct}
            </div>

            {whatYouGet.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">Yang Anda dapatkan:</h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                  {whatYouGet.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-slate-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {suitableFor.length > 0 && (
              <div className="pt-2 text-xs sm:text-sm text-slate-600">
                <span className="font-bold text-slate-900">Cocok untuk: </span>
                <span>{suitableFor.join(" • ")}</span>
              </div>
            )}
          </div>

          <hr className="border-slate-200" />

          {/* Section: List Materi (Vertical Timeline with Dots + Cyan Bordered Cards matching Detail Produk.png) */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-[#26A69A] rounded-full" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">List Materi</h2>
            </div>

            {product.modules && product.modules.length > 0 ? (
              <div className="relative pl-6 sm:pl-8 space-y-4">
                {/* Vertical Timeline Connector Line */}
                <div
                  className="absolute left-[5px] sm:left-[7px] top-3 bottom-6 w-[1.5px] bg-slate-200"
                  aria-hidden="true"
                />

                {product.modules.map((mod) => (
                  <div key={mod.id} className="relative">
                    {/* Circular Timeline Node Dot */}
                    <span
                      className="absolute -left-6 sm:-left-8 top-3 w-3 h-3 rounded-full bg-slate-300 ring-4 ring-white"
                      aria-hidden="true"
                    />

                    <div className="border border-[#38BDF8]/80 rounded-2xl p-5 space-y-3 bg-white shadow-2xs">
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                        {mod.moduleNumber} — {mod.title}
                      </h3>
                      <div className="space-y-2 pl-2">
                        {mod.lessons.map((lsn) => (
                          <div key={lsn.id} className="flex items-center gap-2.5 text-xs text-slate-600">
                            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{lsn.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">Materi sedang disiapkan.</div>
            )}
          </div>

          <hr className="border-slate-200" />

          {/* Section: FAQ Produk */}
          <ProductFaqAccordion />
        </div>
      </div>
    </div>
  );
}
