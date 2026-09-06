import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BarChart3, FileText, BookOpen, Star } from "lucide-react";
import { getProductBySlug } from "@/actions/products";
import { getSiteSettings } from "@/actions/settings";
import { formatRupiah } from "@/lib/utils";
import ShareButton from "@/components/ShareButton";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

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
    title: `${product.title} | Produk Digital Helmi Salsabila`,
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

  const contactPhone = settings?.contactPhone || "+6269233221";
  const whatYouGet = parseJsonArray(product.whatYouGet);
  const suitableFor = parseJsonArray(product.suitableFor);

  return (
    <div className="space-y-12 pb-16 pt-6">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px] space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/produk" className="hover:text-slate-900 transition-colors">
            Produk
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate">Detail</span>
        </nav>

        {/* Top Product Container Box (Bordered) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8 shadow-xs">
          {/* Top Half: Cover + Pricing & Buy */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Column: 3D Product Mockup & Thumbnails */}
            <div className="md:col-span-6 space-y-4">
              <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 via-rose-50 to-teal-50 rounded-2xl border border-slate-100 flex items-center justify-center p-6 shadow-inner">
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

              {/* 4 Small Thumbnails */}
              <div className="grid grid-cols-4 gap-2.5">
                <div className="aspect-square bg-slate-900 rounded-lg flex items-center justify-center text-[10px] text-white p-1 text-center font-bold">
                  Overview
                </div>
                <div className="aspect-square bg-slate-900 rounded-lg flex items-center justify-center text-[10px] text-white p-1 text-center font-bold">
                  Module 1
                </div>
                <div className="aspect-square bg-slate-900 rounded-lg flex items-center justify-center text-[10px] text-white p-1 text-center font-bold">
                  Module 2
                </div>
                <div className="aspect-square bg-slate-900 rounded-lg flex items-center justify-center text-[10px] text-white p-1 text-center font-bold">
                  Templates
                </div>
              </div>
            </div>

            {/* Right Column: Title, Pricing & CTA */}
            <div className="md:col-span-6 space-y-6">
              {/* Level Badge */}
              <div className="inline-flex items-center gap-1.5 text-teal-600 text-xs font-semibold">
                <BarChart3 className="w-4 h-4" />
                <span>{product.levelBadge || "Semua Level"}</span>
              </div>

              {/* Product Title */}
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {product.title}
              </h1>

              {/* Pricing Box (Soft Aqua Bg) */}
              <div className="bg-[#E6FAF8] border border-[#99F6E4] rounded-2xl p-5 flex items-center gap-4">
                <span className="px-2.5 py-1 rounded-md bg-[#0D9488] text-white font-bold text-xs">
                  Diskon {product.discountPercent}%
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="line-through text-slate-400 text-xs sm:text-sm">
                    {formatRupiah(product.originalPrice)}
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold text-emerald-600">
                    {formatRupiah(product.discountedPrice)}
                  </span>
                </div>
              </div>

              {/* Action Buttons (Using dynamic phone from database) */}
              <div className="space-y-3 pt-2">
                <a
                  href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}?text=Halo,%20saya%20ingin%20membeli%20produk:%20${encodeURIComponent(
                    product.title
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" fill="currentColor" />
                  <span>Beli Produk Ini</span>
                </a>

                <ShareButton
                  label="Bagikan"
                  className="w-full py-3 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                />
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Section: Tentang Produk */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-teal-500 rounded-full" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Tentang Produk</h2>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {product.aboutProduct}
            </div>

            {whatYouGet.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">Yang Anda dapatkan:</h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
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
              <div className="pt-2 text-xs text-slate-600">
                <span className="font-bold text-slate-900">Cocok untuk: </span>
                <span>{suitableFor.join(" • ")}</span>
              </div>
            )}
          </div>

          <hr className="border-slate-200" />

          {/* Section: List Materi (Curriculum Modules from DB) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-teal-500 rounded-full" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">List Materi</h2>
            </div>

            <div className="space-y-4">
              {product.modules && product.modules.length > 0 ? (
                product.modules.map((mod) => (
                  <div key={mod.id} className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-white">
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
                ))
              ) : (
                <div className="text-xs text-slate-400 italic">Materi sedang disiapkan.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
