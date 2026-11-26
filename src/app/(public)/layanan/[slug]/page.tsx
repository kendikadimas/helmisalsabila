import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug, getServices } from "@/actions/services";
import { getSiteSettings } from "@/actions/settings";
import { formatRupiah, markdownToHtml, sanitizeHtml } from "@/lib/utils";
import SectionHeader from "@/components/SectionHeader";
import ShareButton from "@/components/ShareButton";
import DokuCheckoutModal from "@/components/DokuCheckoutModal";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { FALLBACK_PHONE } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Layanan Tidak Ditemukan | Helmi Salsabila",
    };
  }

  return {
    title: `${service.title} | Layanan`,
    description: service.shortDescription || "Detail paket dan ruang lingkup layanan dari Helmi Salsabila.",
    openGraph: {
      title: service.title,
      description: service.shortDescription || "",
      images: service.thumbnailUrl ? [{ url: service.thumbnailUrl }] : [],
    },
  };
}

function parseJsonArray(val: unknown): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return val.trim() ? [val] : [];
    }
  }
  return [];
}

export default async function DetailLayananPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [service, relatedServicesAll, settings] = await Promise.all([
    getServiceBySlug(slug),
    getServices(4),
    getSiteSettings(),
  ]);

  if (!service) {
    notFound();
  }

  const contactPhone = settings?.contactPhone || FALLBACK_PHONE;
  const relatedServices = relatedServicesAll.filter((s) => s.slug !== slug).slice(0, 3);
  const features = parseJsonArray(service.features);
  const toolsUsed = parseJsonArray(service.toolsUsed);
  const outputsReceived = parseJsonArray(service.outputsReceived);
  const targetAudience = parseJsonArray(service.targetAudience);
  const isValidServiceImg = (url?: string | null) =>
    !!url && !url.includes("placeholder") && !url.includes("/assets/service-");
  const rawDesc = service.fullDescription || "";
  const descHtml = sanitizeHtml(/<\/?[a-z][\s\S]*>/i.test(rawDesc) ? rawDesc : markdownToHtml(rawDesc));

  const hasPaidPrice = service.priceStartingAt && parseFloat(String(service.priceStartingAt)) > 0;
  const galleryItems =
    service.galleries && service.galleries.length > 0
      ? service.galleries.slice(0, 4)
      : [
          { id: "1", imageUrl: "", caption: "Data Preprocessing" },
          { id: "2", imageUrl: "", caption: "EDA Graphs" },
          { id: "3", imageUrl: "", caption: "Trend Analysis" },
          { id: "4", imageUrl: "", caption: "Insight Report" },
        ];
  const extraGalleryCount = service.galleries && service.galleries.length > 4 ? service.galleries.length - 3 : 5;

  return (
    <div className="space-y-8 pb-20 pt-6">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px] space-y-6">
        {/* Clean White Breadcrumb matching [OPSI 2] Detail Layanan.png */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-800 transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/layanan" className="hover:text-slate-800 transition-colors">
            Layanan & Portfolio
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Detail</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Main Content (col-span-8): Unified Bordered Card + Related Services aligned to 8 cols */}
          <div className="lg:col-span-8 space-y-10">
            {/* Single Unified White Container Card matching mockup */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 space-y-6 shadow-xs">
              {/* Gallery Grid (1 Large Left + 4 Small 2x2 Right) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* 1 Large Preview */}
                <div className="md:col-span-7 aspect-[4/3] md:aspect-auto md:h-full min-h-[240px] bg-slate-950 rounded-2xl overflow-hidden relative flex items-center justify-center text-white">
                  {isValidServiceImg(service.thumbnailUrl) ? (
                    <img
                      src={service.thumbnailUrl!}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#020B14] flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
                      <div className="absolute -top-8 -left-8 w-32 h-32 bg-blue-600/30 rounded-full blur-2xl pointer-events-none" />
                      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-cyan-600/20 rounded-full blur-2xl pointer-events-none" />
                      <span className="text-[10px] uppercase tracking-widest text-cyan-300 font-bold mb-1">
                        WITHHELS PORTFOLIO
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-cyan-100 uppercase tracking-wide">
                        {service.title}
                      </h3>
                      <div className="inline-block bg-[#A5F3FC] text-slate-950 font-extrabold px-4 py-1 rounded text-xs mt-3">
                        SWIPE TO PORTFOLIO
                      </div>
                    </div>
                  )}
                </div>

                {/* 4 Small Thumbnails 2x2 Grid */}
                <div className="md:col-span-5 grid grid-cols-2 gap-2.5">
                  {galleryItems.map((gal, idx) => (
                    <div
                      key={gal.id}
                      className="aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden relative flex items-center justify-center text-white text-[10px] text-center border border-slate-200"
                    >
                      {gal.imageUrl && !gal.imageUrl.includes("placeholder") ? (
                        <img
                          src={gal.imageUrl}
                          alt={gal.caption || service.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="p-2 text-slate-300 font-medium">{gal.caption || "Preview"}</span>
                      )}

                      {/* 5+ Gambar Overlay on 4th Thumbnail */}
                      {idx === 3 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-bold text-xs sm:text-sm">
                            {extraGalleryCount}+ Gambar
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Title & Divider */}
              <div className="space-y-4 pt-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {service.title}
                </h1>
                <hr className="border-slate-200" />
              </div>

              {/* Deskripsi Section */}
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-[#26A69A] rounded-full" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">Deskripsi</h2>
                </div>

                <div
                  className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-slate-900 [&_h4]:text-xs [&_h4]:font-bold [&_h4]:text-slate-800 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                  dangerouslySetInnerHTML={{ __html: descHtml }}
                />

                {/* Fitur Layanan */}
                {features.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h3 className="font-bold text-slate-900 text-sm">Layanan yang saya tawarkan:</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tools Digunakan */}
                {toolsUsed.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="font-bold text-slate-900 text-sm">Tools yang digunakan:</h3>
                    <div className="flex flex-wrap gap-2">
                      {toolsUsed.map((tool, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Output yang Diterima */}
                {outputsReceived.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="font-bold text-slate-900 text-sm">Output yang Anda dapatkan:</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {outputsReceived.map((out, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A5F] shrink-0" />
                          <span>{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Target Audience */}
                {targetAudience.length > 0 && (
                  <div className="space-y-2 pt-2 text-xs text-slate-600">
                    <span className="font-bold text-slate-900">Cocok untuk: </span>
                    <span>{targetAudience.join(" • ")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Layanan Terkait Lainnya (Aligned directly under the 8-col main card matching mockup) */}
            <div className="space-y-5 pt-2">
              <SectionHeader title="Layanan Terkait Lainnya" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {relatedServices.map((srv) => (
                  <Link
                    key={srv.id}
                    href={`/layanan/${srv.slug}`}
                    className="group bg-white rounded-2xl border border-slate-200 p-3 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[16/10] bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center text-white">
                        {isValidServiceImg(srv.thumbnailUrl) ? (
                          <img
                            src={srv.thumbnailUrl!}
                            alt={srv.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <h4 className="text-xs font-bold text-center p-4 group-hover:text-teal-300">{srv.title}</h4>
                        )}
                      </div>
                      <div className="pt-3 pb-1 px-1">
                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-[#1E3A5F] line-clamp-2">
                          {srv.title}
                        </h3>
                      </div>
                    </div>
                    <div>
                      <div className="border-t border-slate-100 my-2" />
                      <div className="px-1 pb-0.5 flex items-center gap-1.5 text-xs">
                        <span className="text-slate-500 font-normal text-[11px]">Harga Mulai</span>
                        <span className="font-bold text-[#059669] text-xs">{formatRupiah(srv.priceStartingAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sticky Sidebar (col-span-4) matching [OPSI 2] Detail Layanan.png */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-white border border-[#38BDF8] rounded-2xl p-5 space-y-5 shadow-xs">
              {/* Inner Soft Aqua Jaminan Box with 3D Padlock /Group.png */}
              <div className="bg-[#E6FAF8]/80 rounded-xl p-5 text-center space-y-2.5">
                <div className="w-12 h-12 mx-auto flex items-center justify-center">
                  <Image
                    src="/Group.png"
                    alt="Jaminan Jasa Aman"
                    width={48}
                    height={48}
                    className="w-11 h-11 object-contain"
                  />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Jaminan Jasa Aman</h3>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                  Kerjakan kebutuhan Anda dengan lebih aman. Setiap pekerjaan dilakukan berdasarkan kesepakatan yang
                  jelas, komunikasi terbuka &amp; komitmen hingga pekerjaan selesai.
                </p>
              </div>

              {/* Pricing Row */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-500 font-medium">Harga Mulai</span>
                <span className="font-extrabold text-[#059669] text-base">
                  {formatRupiah(service.priceStartingAt)}
                </span>
              </div>

              {/* Action Buttons matching Mockup + preserving DOKU & WhatsApp functionality */}
              <div className="space-y-2.5">
                {hasPaidPrice ? (
                  <DokuCheckoutModal
                    itemType="service"
                    itemId={service.id}
                    itemTitle={service.title}
                    amount={service.priceStartingAt!}
                    buttonLabel="Pakai Layanan Ini"
                    className="w-full py-3 px-4 rounded-xl bg-[#1E3A5F] hover:bg-[#162E4A] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  />
                ) : (
                  <a
                    href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}?text=Halo,%20saya%20tertarik%20dengan%20layanan:%20${encodeURIComponent(
                      service.title
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#1E3A5F] hover:bg-[#162E4A] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>Pakai Layanan Ini</span>
                  </a>
                )}

                <ShareButton
                  label="Bagikan"
                  className="w-full py-3 px-4 rounded-xl bg-white border border-[#1E3A5F]/40 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                />

                {/* Secondary subtle WhatsApp consultation link to preserve WA consultation flow */}
                {hasPaidPrice && (
                  <a
                    href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}?text=Halo,%20saya%20ingin%20konsultasi%20layanan:%20${encodeURIComponent(
                      service.title
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full pt-1 text-center text-[11px] font-medium text-slate-500 hover:text-emerald-700 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" />
                    <span>Atau konsultasi gratis via WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
