import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MousePointer, Mail, Star } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import SectionHeader from "@/components/SectionHeader";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { getServices } from "@/actions/services";
import { getProducts } from "@/actions/products";
import { getArticles, getAllCategories } from "@/actions/articles";
import { getTestimonials, getWorkSteps, getValuePropositions, getSiteSettings } from "@/actions/settings";
import { formatRupiah, formatDateIndo } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let services: any[] = [];
  let products: any[] = [];
  let articles: any[] = [];
  let testimonials: any[] = [];
  let workSteps: any[] = [];
  let valueProps: any[] = [];
  let settings: any = null;
  let categories: any[] = [];

  try {
    const res = await Promise.all([
      getServices(3),
      getProducts(3),
      getArticles(3),
      getTestimonials(),
      getWorkSteps(),
      getValuePropositions(),
      getSiteSettings(),
      getAllCategories("article"),
    ]);
    services = res[0] || [];
    products = res[1] || [];
    articles = res[2] || [];
    testimonials = res[3] || [];
    workSteps = res[4] || [];
    valueProps = res[5] || [];
    settings = res[6] || null;
    categories = res[7] || [];
  } catch (error) {
    console.error("Error loading HomePage data:", error);
  }

  const getValidArticleImg = (img?: string | null, index: number = 0) => {
    if (!img || img.includes("placeholder") || img.includes("/assets/article-")) {
      const idxNum = index % 4;
      return `/assets/artikel${idxNum > 0 ? idxNum : ""}.png`;
    }
    return img;
  };

  const getValidProductImg = (img?: string | null, index: number = 0) => {
    const raw = img || "";
    if (!raw || raw.includes("placeholder")) {
      return index === 0 ? "/assets/product.png" : index === 1 ? "/assets/product2.png" : "/assets/product3.png";
    }
    if (raw.includes("product-branding-builder")) return "/assets/product.png";
    if (raw.includes("product-150-ideas")) return "/assets/product2.png";
    if (raw.includes("product-digital-ideas")) return "/assets/product3.png";
    return raw;
  };

  const isValidServiceImg = (url?: string | null) =>
    !!url && !url.includes("placeholder") && !url.includes("/assets/service-");

  const heroTitle = settings?.heroTitle || "Data & Digital Solutions.";
  const heroSubtitle = settings?.heroSubtitle || "Masalah ditemukan. Solusi diarahkan. Pilihan terbaik direkomendasikan.";
  const contactPhone = settings?.contactPhone || "+6269233221";
  const stats = settings?.statsCounters || { years: "5+", clients: "100+", projects: "100%" };
  const socials = {
    linkedin: settings?.socialLinks?.linkedin || "https://linkedin.com",
    instagram: settings?.socialLinks?.instagram || "https://instagram.com",
    threads: settings?.socialLinks?.threads || "https://threads.net",
    dribbble: settings?.socialLinks?.dribbble || "https://dribbble.com",
    ...settings?.socialLinks,
  };

  const fallbackSteps = [
    {
      id: "stp-01",
      stepNumber: "01",
      title: "Hubungi Saya dan Sampaikan Kebutuhan",
      description:
        "Kirim pesan melalui kontak saya dan jelaskan kebutuhan Anda: jenis pekerjaan, cakupan tugas, serta tenggat waktu yang diinginkan.",
    },
    {
      id: "stp-02",
      stepNumber: "02",
      title: "Kesepakatan, Penawaran, dan Pembayaran Awal",
      description:
        "Setelah kebutuhan dibahas, saya akan memberikan estimasi harga & waktu pengerjaan. Pekerjaan dimulai setelah pembayaran uang muka diterima.",
    },
    {
      id: "stp-03",
      stepNumber: "03",
      title: "Pengerjaan, Review, dan Revisi",
      description:
        "Pekerjaan dikerjakan sesuai kesepakatan. Hasil dikirimkan untuk ditinjau, dan revisi dapat diajukan sesuai ketentuan yang telah disepakati.",
    },
    {
      id: "stp-04",
      stepNumber: "04",
      title: "Pelunasan dan Pengiriman Hasil Akhir",
      description:
        "Setelah hasil disetujui, pembayaran pelunasan dilakukan dan file atau dokumen final dikirimkan sepenuhnya kepada Anda.",
    },
  ];

  const displaySteps = workSteps && workSteps.length > 0 ? workSteps : fallbackSteps;

  const renderValuePropIcon = (iconName: string | null, idx: number, title?: string) => {
    const t = (title || "").toLowerCase();
    const i = (iconName || "").toLowerCase();

    if (t.includes("aman") || t.includes("terpercaya") || i.includes("lock") || i.includes("shield") || idx === 0) {
      return (
        <div className="w-12 h-12 flex items-center justify-center relative">
          <Image src="/Group.png" alt="Proses Aman & Terpercaya" width={48} height={48} className="w-11 h-11 object-contain" />
        </div>
      );
    }

    if (t.includes("kualitas") || t.includes("terbaik") || i.includes("medal") || i.includes("award") || idx === 1) {
      return (
        <div className="w-12 h-12 flex items-center justify-center relative">
          <Image
            src="/twemoji_1st-place-medal.png"
            alt="Kualitas Hasil Terbaik"
            width={48}
            height={48}
            className="w-11 h-11 object-contain"
          />
        </div>
      );
    }

    if (t.includes("harga") || t.includes("terjangkau") || i.includes("money") || i.includes("banknote") || idx === 2) {
      return (
        <div className="w-12 h-12 flex items-center justify-center relative">
          <Image
            src="/twemoji_money-bag.png"
            alt="Harga Terjangkau"
            width={48}
            height={48}
            className="w-11 h-11 object-contain"
          />
        </div>
      );
    }

    return (
      <div className="w-12 h-12 flex items-center justify-center relative">
        <Image
          src="/twemoji_handshake.png"
          alt="Dipercaya Banyak Client"
          width={48}
          height={48}
          className="w-11 h-11 object-contain"
        />
      </div>
    );
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings?.siteName || "Helmi Salsabila",
    jobTitle: "Data Analyst & Digital Solution Specialist",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://helsenvi.com",
    image: `${process.env.NEXT_PUBLIC_APP_URL || "https://helsenvi.com"}/profile-talent.png`,
    sameAs: [socials.linkedin, socials.instagram, socials.threads].filter(Boolean),
    knowsAbout: ["Data Analytics", "Python", "Tableau", "SQL", "Spreadsheet Automation"],
  };

  return (
    <div className="space-y-20 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFFFFF] via-[#FFFDF7] to-[#E9F9F8] w-full">
        {/* Soft Ambient Glows */}
        <div className="pointer-events-none absolute -bottom-24 left-12 w-96 h-96 rounded-full bg-[#FEF3C7]/45 blur-3xl" />
        <div className="pointer-events-none absolute -top-24 right-12 w-[460px] h-[460px] rounded-full bg-[#CCFBF1]/45 blur-3xl" />

        {/* Decorative Curved Vector Lines matching Home [REVISI].png */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full z-0"
          viewBox="0 0 1440 640"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Gold / Amber Curve */}
          <path
            d="M280 640 C420 560, 500 420, 680 390 C860 360, 1020 420, 1440 240"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeOpacity="0.65"
            fill="none"
          />
          {/* Deep Navy Curve sweeping top-right */}
          <path
            d="M1120 640 C1230 480, 1340 260, 1440 15"
            stroke="#1E3A5F"
            strokeWidth="2"
            strokeOpacity="0.75"
            fill="none"
          />
        </svg>

        <div className="max-w-[1440px] mx-auto min-h-[580px] lg:h-[620px] pt-10 px-6 sm:px-12 lg:px-[96px] relative z-10 flex flex-col lg:flex-row items-end justify-between gap-4">
          {/* Left Column Text */}
          <div className="w-full lg:w-[680px] max-w-[680px] space-y-5 pb-10 sm:pb-14 lg:pb-16 pt-2 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-r-lg bg-[#E6FAF8] border-l-4 border-[#2A5D69] text-sm sm:text-[15px] leading-[22px] tracking-[-0.006em] text-[#2A5D69] shadow-2xs">
              <span className="font-normal text-[#2A5D69]">Halo, Saya</span>
              <span className="font-semibold text-[#2A5D69]">{settings?.siteName || "Helmi Salsabila"}</span>
              <span className="text-[14px]">👋</span>
            </div>

            <div className="w-full space-y-1">
              <h1 className="font-bold text-[#111827] text-3xl sm:text-[44px] lg:text-[50px] leading-[1.15] sm:leading-[58px] tracking-[-0.021em]">
                Your Reliable Partner for
              </h1>
              <div className="font-bold text-[#F59E0B] text-4xl sm:text-[50px] lg:text-[56px] leading-[1.15] sm:leading-[64px] tracking-[-0.022em]">
                {heroTitle}
              </div>
            </div>

            <p className="font-normal text-[#334155] text-sm sm:text-[16px] leading-[26px] tracking-[-0.006em] max-w-[640px]">
              {heroSubtitle}
            </p>

            <div className="pt-2">
              <a
                href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#1E3A5F] hover:bg-[#152A45] text-white text-sm sm:text-[15px] font-bold tracking-[-0.006em] shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                <span>Kontak Saya</span>
                <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" />
              </a>
            </div>

            {/* Social Links using real Figma brand icons */}
            <div className="flex items-center gap-3 pt-2 text-sm text-[#111827]">
              <span className="font-normal text-slate-600">Ikuti Saya di :</span>
              <div className="flex items-center gap-2.5">
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="LinkedIn"
                >
                  <img src="/assets/thesvg-color_linkedin.png" alt="LinkedIn" className="w-5 h-5 object-contain" />
                </a>
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Instagram"
                >
                  <img src="/assets/skill-icons_instagram.png" alt="Instagram" className="w-5 h-5 object-contain" />
                </a>
                <a
                  href={socials.threads}
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Threads"
                >
                  <img src="/assets/mingcute_threads-line.png" alt="Threads" className="w-5 h-5 object-contain" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column Photo */}
          <div className="w-full lg:flex-1 flex justify-center lg:justify-end items-end relative -mb-1">
            <div className="relative w-full max-w-[440px] lg:max-w-[520px] h-[400px] sm:h-[500px] lg:h-[580px]">
              <Image
                src="/profile-talent.png"
                alt={settings?.siteName || "Helmi Salsabila"}
                fill
                priority
                className="object-contain object-bottom filter drop-shadow-sm"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 520px"
              />
            </div>
          </div>
        </div>

        {/* 2. STATS RIBBON BAR */}
        <div className="relative z-10 w-full bg-gradient-to-r from-[#020A14] via-[#0A1B30] to-[#020A14] text-white border-t border-slate-800 shadow-2xl">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px] py-6 sm:py-7">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#1E3A5F]/70 text-center">
              <div className="py-3 md:py-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F59E0B] tracking-tight">{stats.years}</div>
                <div className="text-xs text-slate-300 mt-1 font-medium">Tahun Pengalaman</div>
              </div>
              <div className="py-3 md:py-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F59E0B] tracking-tight">{stats.clients}</div>
                <div className="text-xs text-slate-300 mt-1 font-medium">Klien Sudah Percaya</div>
              </div>
              <div className="py-3 md:py-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#F59E0B] tracking-tight">{stats.projects}</div>
                <div className="text-xs text-slate-300 mt-1 font-medium">Project Selesai</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LAYANAN & PORTFOLIO SECTION */}
      <section className="bg-gradient-to-b from-[#FFFFFF] via-[#F0FDFB] to-[#DCF6F4] py-16 -mt-20 border-b border-[#99F6E4]/40">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px] space-y-6">
          <SectionHeader
            title="Layanan & Portfolio"
            subtitle="Solusi profesional untuk berbagai kebutuhan data dan digital Anda"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {services.map((srv) => (
              <Link
                key={srv.id}
                href={`/layanan/${srv.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] bg-slate-950 rounded-xl relative overflow-hidden flex items-center justify-center">
                    {isValidServiceImg(srv.thumbnailUrl) ? (
                      <img
                        src={srv.thumbnailUrl!}
                        alt={srv.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : srv.slug.includes("data-analyst") ? (
                      <div className="w-full h-full bg-[#020B14] rounded-lg flex flex-col items-center justify-center text-center p-3 relative overflow-hidden">
                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-600/30 rounded-full blur-xl pointer-events-none" />
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-cyan-600/20 rounded-full blur-xl pointer-events-none" />
                        <span className="absolute top-2 left-2.5 text-[8px] sm:text-[9px] tracking-wider text-cyan-200 font-bold uppercase">
                          WITHHELS
                        </span>
                        <h4 className="text-2xl sm:text-3xl font-black text-cyan-100 tracking-wider my-1 uppercase font-sans">
                          DATA ANALYST
                        </h4>
                        <div className="relative inline-flex items-center gap-1 px-3.5 py-0.5 bg-[#A5F3FC] text-slate-950 font-extrabold text-[10px] sm:text-[11px] tracking-wide mt-1.5 shadow-xs">
                          <span>SWIPE TO PORTFOLIO</span>
                          <MousePointer className="w-3.5 h-3.5 text-red-500 fill-red-500 absolute -bottom-2 -right-1 transform -rotate-12" />
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 text-cyan-400 text-[10px] font-bold">✦</span>
                      </div>
                    ) : srv.slug.includes("data-entry") ? (
                      <div className="w-full h-full bg-white rounded-lg flex flex-col items-center justify-center p-3 border border-slate-200 text-slate-900 text-center">
                        <div className="text-[9px] font-bold text-slate-500 mb-2">
                          Document to Website & Website to Document
                        </div>
                        <div className="flex items-center justify-center gap-4 w-full px-2">
                          <div className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px]">
                            Document
                          </div>
                          <div className="text-red-500 font-extrabold text-sm">⇄</div>
                          <div className="bg-orange-500 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                            Website
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 mt-2">
                          <span className="px-1 py-0.5 rounded bg-blue-600 text-white text-[8px] font-bold">W</span>
                          <span className="px-1 py-0.5 rounded bg-green-600 text-white text-[8px] font-bold">X</span>
                          <span className="px-1 py-0.5 rounded bg-orange-600 text-white text-[8px] font-bold">P</span>
                          <span className="px-1 py-0.5 rounded bg-emerald-600 text-white text-[8px] font-bold">E</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-slate-50 rounded-lg flex flex-col items-center justify-center p-3 border border-slate-200 text-slate-900 text-center relative">
                        <div className="px-2.5 py-0.5 rounded-full bg-[#1E3A5F] text-white text-[9px] font-bold mb-1">
                          Solusi
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                          {srv.title.split("(")[0]}
                        </h4>
                        <span className="text-[10px] text-slate-600 font-medium">
                          untuk Skripsi, Tesis & Penelitian
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3.5 pb-1 px-1">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#1E3A5F] transition-colors line-clamp-2">
                      {srv.title}
                    </h3>
                  </div>
                </div>

                <div>
                  <div className="border-t border-slate-100 my-2.5" />
                  <div className="px-1 pb-1 flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-normal">Harga Mulai</span>
                    <span className="font-bold text-[#059669] text-xs sm:text-sm">
                      {formatRupiah(srv.priceStartingAt)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/layanan"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E3A5F] hover:bg-[#162E4A] text-white text-xs font-semibold shadow-xs transition-all"
            >
              <span>Lihat Semua Layanan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. PRODUK SAYA SECTION */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px]">
        <SectionHeader
          title="Produk Saya"
          subtitle="Temukan produk digital menarik yang sesuai dengan kebutuhan Anda"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {products.map((prd, idx) => {
            const thumbSrc = getValidProductImg(prd.thumbnailUrl, idx);
            return (
              <Link
                key={prd.id}
                href={`/produk/${prd.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/11] bg-slate-100 rounded-xl relative overflow-hidden flex items-center justify-center">
                    {thumbSrc ? (
                      <img
                        src={thumbSrc}
                        alt={prd.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="p-4 flex items-center justify-center w-full h-full bg-gradient-to-br from-slate-800 to-slate-900">
                        <div className="w-24 h-32 bg-gradient-to-tr from-amber-500 to-teal-400 rounded-lg shadow-xl p-2.5 flex flex-col justify-between text-slate-950 font-extrabold text-[10px]">
                          <span>DIGITAL PRODUCT</span>
                          <span className="line-clamp-2 text-center">{prd.title}</span>
                          <div className="flex justify-end gap-0.5">
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
                    <span className="font-bold text-[#059669] text-xs sm:text-sm">
                      {formatRupiah(prd.discountedPrice)}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Terjual : {(prd.totalSales || 0).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center pt-8">
          <Link
            href="/produk"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E3A5F] hover:bg-[#162E4A] text-white text-xs font-semibold shadow-xs transition-all"
          >
            <span>Lihat Semua Produk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 5. TESTIMONI KLIEN SECTION */}
      <section className="bg-gradient-to-b from-[#F0FDFB] via-[#E6FAF8] to-[#D8F5F3] py-16 border-y border-[#99F6E4]/40">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px] space-y-6">
          <SectionHeader title="Testimoni Klien" subtitle="Apa kata klien tentang" />
          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* 6. ARTIKEL SECTION (Clean Borderless Editorial Cards matching Home [REVISI].png) */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px]">
        <SectionHeader
          title="Artikel"
          subtitle="Kumpulan tulisan, insight, dan pengalaman yang saya bagikan untuk Anda"
        />

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar text-xs">
          <Link
            href="/blog"
            className="px-4 py-2 rounded-lg border border-[#1E3A5F] bg-[#E6FAF8] text-[#1E3A5F] font-bold shrink-0 transition-colors shadow-2xs"
          >
            Semua Kategori
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog?kategori=${cat.slug}`}
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 shrink-0 transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* 3 Articles Grid directly from DB */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
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

        <div className="text-center pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E3A5F] hover:bg-[#162E4A] text-white text-xs font-semibold shadow-xs transition-all"
          >
            <span>Lihat Semua Artikel</span>
          </Link>
        </div>
      </section>

      {/* 7. KENAPA MEMILIH LAYANAN SAYA? */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px]">
        <SectionHeader title="Kenapa Memilih Layanan Saya?" />

        <div className="bg-white rounded-2xl border border-[#38BDF8]/60 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 shadow-xs">
          {valueProps.map((val, idx) => (
            <div
              key={val.id}
              className="p-4 sm:p-5 space-y-3 text-center flex flex-col items-center justify-start"
            >
              <div className="w-14 h-14 flex items-center justify-center mb-1">
                {renderValuePropIcon(val.icon3dName, idx, val.title)}
              </div>

              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">{val.title}</h3>
              <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed max-w-xs">{val.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CTA SECTION (Siap untuk Memulai Bekerjasama?) */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px]">
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: CTA Pitch & Socials */}
          <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between bg-gradient-to-br from-[#F4FCFB] via-[#FFFDF2] to-[#E6FAF8] border-b lg:border-b-0 lg:border-r-[3px] lg:border-[#1E3A5F]">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-[1.2]">
                Siap untuk Memulai
                <br />
                Bekerjasama?
              </h2>
              <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed max-w-sm">
                Mari wujudkan kebutuhan Anda dengan solusi yang tepat, profesional, dan terpercaya.
              </p>
              <div className="pt-4 sm:pt-6">
                <a
                  href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}?text=Halo%20Helmi,%20saya%20tertarik%20untuk%20bekerjasama`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#1E3A5F] hover:bg-[#152A45] text-white text-sm font-bold shadow-sm transition-all transform hover:-translate-y-0.5"
                >
                  <span>Kontak Saya Sekarang</span>
                  <Mail className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>

            {/* Social Media Links using real Figma brand icons */}
            <div className="flex items-center gap-3 pt-8 text-sm text-slate-700 font-medium">
              <span className="text-xs sm:text-sm text-slate-600">Sosial Media :</span>
              <div className="flex items-center gap-2.5">
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="LinkedIn"
                >
                  <img src="/assets/thesvg-color_linkedin.png" alt="LinkedIn" className="w-5 h-5 object-contain" />
                </a>
                <a
                  href={socials.dribbble || "https://dribbble.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Dribbble"
                >
                  <img src="/assets/thesvg-color_dribbble.png" alt="Dribbble" className="w-5 h-5 object-contain" />
                </a>
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Instagram"
                >
                  <img src="/assets/skill-icons_instagram.png" alt="Instagram" className="w-5 h-5 object-contain" />
                </a>
                <a
                  href={socials.threads}
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Threads"
                >
                  <img src="/assets/mingcute_threads-line.png" alt="Threads" className="w-5 h-5 object-contain" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Work Steps Cards */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-[#F7FEFD] via-white to-[#EEFBF9] flex flex-col justify-center space-y-3.5">
            {displaySteps.map((step) => (
              <div
                key={step.id}
                className="border border-[#38BDF8] rounded-2xl p-4 sm:p-5 bg-white shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 text-sm sm:text-base shrink-0">{step.stepNumber}</span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">{step.title}</h3>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-500 mt-1 leading-relaxed pl-8">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
