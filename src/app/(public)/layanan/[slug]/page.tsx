import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { getServiceBySlug, getServices } from "@/actions/services";
import { getSiteSettings } from "@/actions/settings";
import { formatRupiah, markdownToHtml } from "@/lib/utils";
import SectionHeader from "@/components/SectionHeader";
import ShareButton from "@/components/ShareButton";
import DokuCheckoutModal from "@/components/DokuCheckoutModal";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

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

  const contactPhone = settings?.contactPhone || "+6269233221";
  const relatedServices = relatedServicesAll.filter((s) => s.slug !== slug).slice(0, 3);
  const features = parseJsonArray(service.features);
  const toolsUsed = parseJsonArray(service.toolsUsed);
  const outputsReceived = parseJsonArray(service.outputsReceived);
  const targetAudience = parseJsonArray(service.targetAudience);
  const isValidServiceImg = (url?: string | null) =>
    !!url && !url.includes("placeholder") && !url.includes("/assets/service-");
  const rawDesc = service.fullDescription || "";
  const descHtml = DOMPurify.sanitize(/<\/?[a-z][\s\S]*>/i.test(rawDesc) ? rawDesc : markdownToHtml(rawDesc));

  return (
    <div className="space-y-12 pb-20">
      {/* Breadcrumb Header */}
      <div className="bg-slate-50 border-b border-slate-100 py-4">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px] text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-800">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/layanan" className="hover:text-slate-800">
            Layanan & Portfolio
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-xs">{service.title}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px] space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Main Content (65% / col-span-8) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Gallery Grid (1 Large + 4 Small Layout) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              {/* 1 Large Preview */}
              <div className="md:col-span-8 aspect-[4/3] bg-slate-950 rounded-xl overflow-hidden relative flex items-center justify-center text-white">
                {isValidServiceImg(service.thumbnailUrl) ? (
                  <img
                    src={service.thumbnailUrl!}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center space-y-2 p-6">
                    <span className="text-xs uppercase tracking-widest text-teal-400 font-bold">PORTFOLIO SHOWCASE</span>
                    <h3 className="text-2xl font-extrabold">{service.title}</h3>
                    <div className="inline-block bg-white/10 px-4 py-1.5 rounded-full text-xs text-slate-200">
                      Swipe to Portfolio
                    </div>
                  </div>
                )}
              </div>

              {/* 4 Small Thumbnails Grid */}
              <div className="md:col-span-4 grid grid-cols-2 gap-2">
                {(service.galleries && service.galleries.length > 0
                  ? service.galleries.slice(0, 4)
                  : [
                      { id: "1", imageUrl: "", caption: "Data Preprocessing" },
                      { id: "2", imageUrl: "", caption: "EDA Graphs" },
                      { id: "3", imageUrl: "", caption: "Trend Analysis" },
                      { id: "4", imageUrl: "", caption: "Insight Report" },
                    ]
                ).map((gal) => (
                  <div
                    key={gal.id}
                    className="aspect-square bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center text-white text-[10px] text-center border border-slate-800"
                  >
                    {gal.imageUrl && !gal.imageUrl.includes("placeholder") ? (
                      <img
                        src={gal.imageUrl}
                        alt={gal.caption || service.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="p-2">{gal.caption || "Preview"}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Title & Divider */}
            <div className="space-y-4 pt-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {service.title}
              </h1>
              <hr className="border-slate-200" />
            </div>

            {/* Deskripsi Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-teal-500 rounded-full" />
                <h2 className="text-lg font-bold text-slate-900">Deskripsi</h2>
              </div>

              <div
                className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-slate-900 [&_h4]:text-xs [&_h4]:font-bold [&_h4]:text-slate-800 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                dangerouslySetInnerHTML={{ __html: descHtml }}
              />

              {/* Fitur Layanan */}
              {features.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm">Apa Saja yang Anda Dapatkan:</h3>
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
                  <h3 className="font-bold text-slate-900 text-sm">Tools & Teknologi:</h3>
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
                  <h3 className="font-bold text-slate-900 text-sm">Output yang Anda Terima:</h3>
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

          {/* Right Sticky Sidebar (35% / col-span-4) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-[#E6FAF8]/70 border border-[#A7F3D0] rounded-3xl p-6 space-y-6 shadow-xs">
              {/* Jaminan Jasa Aman */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Jaminan Jasa Aman</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Kerjakan kebutuhan Anda dengan lebih aman. Setiap pekerjaan dilakukan berdasarkan kesepakatan yang
                  jelas, komunikasi terbuka & komitmen hingga pekerjaan selesai.
                </p>
              </div>

              {/* Pricing Row */}
              <div className="flex items-center justify-between pt-3 border-t border-teal-200/60 text-xs">
                <span className="text-slate-500">Harga Mulai</span>
                <span className="font-extrabold text-emerald-600 text-base">
                  {formatRupiah(service.priceStartingAt)}
                </span>
              </div>

              {/* Action Buttons (DOKU Checkout + WhatsApp consultation) */}
              <div className="space-y-3 pt-1">
                {service.priceStartingAt && parseFloat(String(service.priceStartingAt)) > 0 && (
                  <DokuCheckoutModal
                    itemType="service"
                    itemId={service.id}
                    itemTitle={service.title}
                    amount={service.priceStartingAt}
                    buttonLabel="Pesan & Bayar (DOKU)"
                  />
                )}

                <a
                  href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}?text=Halo,%20saya%20tertarik%20dengan%20layanan:%20${encodeURIComponent(
                    service.title
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" fill="currentColor" />
                  <span>Konsultasi via WhatsApp</span>
                </a>

                <ShareButton
                  label="Bagikan"
                  className="w-full py-3 px-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Layanan Terkait Lainnya */}
        <div className="pt-12 border-t border-slate-100 space-y-6">
          <SectionHeader title="Layanan Terkait Lainnya" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedServices.map((srv) => (
              <Link
                key={srv.id}
                href={`/layanan/${srv.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
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
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#1E3A5F] line-clamp-2">
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
        </div>
      </div>
    </div>
  );
}
