import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Lock, Award, Banknote, Users2, Linkedin, Instagram, Star, Sparkles, MousePointer, ShieldCheck, Mail } from "lucide-react";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import SectionHeader from "@/components/SectionHeader";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { getServices } from "@/actions/services";
import { getProducts } from "@/actions/products";
import { getArticles, getAllCategories } from "@/actions/articles";
import { getTestimonials, getWorkSteps, getValuePropositions, getSiteSettings } from "@/actions/settings";
import { formatRupiah, formatDateIndo } from "@/lib/utils";

export default async function HomePage() {
  const [services, products, articles, testimonials, workSteps, valueProps, settings, categories] =
    await Promise.all([
      getServices(3),
      getProducts(3),
      getArticles(3),
      getTestimonials(),
      getWorkSteps(),
      getValuePropositions(),
      getSiteSettings(),
      getAllCategories(),
    ]);

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
      description: "Kirim pesan melalui kontak saya dan jelaskan kebutuhan Anda: jenis pekerjaan, cakupan tugas, serta tenggat waktu yang diinginkan.",
    },
    {
      id: "stp-02",
      stepNumber: "02",
      title: "Kesepakatan, Penawaran, dan Pembayaran Awal",
      description: "Setelah kebutuhan dibahas, saya akan memberikan estimasi harga & waktu pengerjaan. Pekerjaan dimulai setelah pembayaran uang muka diterima.",
    },
    {
      id: "stp-03",
      stepNumber: "03",
      title: "Pengerjaan, Review, dan Revisi",
      description: "Pekerjaan dikerjakan sesuai kesepakatan. Hasil dikirimkan untuk ditinjau, dan revisi dapat diajukan sesuai ketentuan yang telah disepakati.",
    },
    {
      id: "stp-04",
      stepNumber: "04",
      title: "Pelunasan dan Pengiriman Hasil Akhir",
      description: "Setelah hasil disetujui, pembayaran pelunasan dilakukan dan file atau dokumen final dikirimkan sepenuhnya kepada Anda.",
    },
  ];

  const displaySteps = workSteps && workSteps.length > 0 ? workSteps : fallbackSteps;

  // Dynamic icon mapper for Value Propositions
  const renderValuePropIcon = (iconName: string | null, idx: number, title?: string) => {
    const t = (title || "").toLowerCase();
    const i = (iconName || "").toLowerCase();

    // 1. Proses Aman & Terpercaya -> Group.png (Lock)
    if (t.includes("aman") || t.includes("terpercaya") || i.includes("lock") || i.includes("shield") || idx === 0) {
      return (
        <div className="w-12 h-12 flex items-center justify-center relative">
          <Image
            src="/Group.png"
            alt="Proses Aman & Terpercaya"
            width={48}
            height={48}
            className="w-11 h-11 object-contain"
          />
        </div>
      );
    }

    // 2. Kualitas Hasil Terbaik -> twemoji_1st-place-medal.png
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

    // 3. Harga Terjangkau -> twemoji_money-bag.png
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

    // 4. Dipercaya Banyak Client -> twemoji_handshake.png
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

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION (100% Matching Exact Figma Curve, Social Icons & Layout) */}
      <section className="relative overflow-hidden bg-white w-full">


        {/* Exact Dimensions: max-w-[1440px], h-[640px], pt-[40px], px-[96px], gap-[10px] */}
        <div className="max-w-[1440px] mx-auto min-h-[640px] lg:h-[640px] pt-[40px] px-6 sm:px-12 lg:px-[96px] relative z-10 flex flex-col lg:flex-row items-end justify-between gap-[10px]">
          {/* Left Column Text (width: 728px, max-w-[728px]) */}
          <div className="w-full lg:w-[728px] max-w-[728px] space-y-6 pb-12 sm:pb-16 lg:pb-16 pt-2 shrink-0">
            {/* Badge: Halo, Saya Helmi Salsabila (w: 214px, h: 30px, 16px, #2A5D69) */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-r-lg bg-[#E6FAF8] border-l-4 border-[#2A5D69] text-[16px] leading-[24px] tracking-[-0.006em] text-[#2A5D69] shadow-xs">
              <span className="font-normal text-[#2A5D69]">Halo, Saya</span>
              <span className="font-semibold text-[#2A5D69]">{settings?.siteName || "Helmi Salsabila"}</span>
              <span className="text-[14px]">👋</span>
            </div>

            {/* Main Headline (w: 728px, h: 129px, font-weight: 700 Bold, -2.1% / -2.2%) */}
            <div className="w-full space-y-1">
              <h1 className="font-bold text-[#111827] text-[40px] sm:text-[48px] lg:text-[52px] leading-[1.15] sm:leading-[60px] tracking-[-0.021em]">
                Your Reliable Partner for
              </h1>
              <div className="font-bold text-[#F59E0B] text-[44px] sm:text-[54px] lg:text-[58px] leading-[1.15] sm:leading-[68px] tracking-[-0.022em]">
                {heroTitle}
              </div>
            </div>

            {/* Subtitle (w: 728px, h: 28px, 400 Regular, 16px, line-height 28px, -0.6% letter-spacing) */}
            <p className="font-normal text-[#111827] text-[16px] leading-[28px] tracking-[-0.006em] max-w-[728px]">
              {heroSubtitle}
            </p>

            {/* CTA Button (width: 111px / fit, height: 28px / 48px, 700 Bold, 16px) */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#1E3A5F] hover:bg-[#152A45] text-white text-[16px] font-bold tracking-[-0.006em] shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                <span>Kontak Saya</span>
                <WhatsAppIcon className="w-5 h-5 text-white" fill="currentColor" />
              </a>
            </div>

            {/* Social Links (Always visible 3 square brand icons) */}
            <div className="flex items-center gap-3 pt-2 text-[16px] leading-[28px] tracking-[-0.006em] text-[#111827]">
              <span className="font-normal">Ikuti Saya di :</span>
              <div className="flex items-center gap-2.5">
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-md bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-xs"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-md bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-xs"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={socials.threads}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded-md bg-black text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-xs"
                  aria-label="Threads"
                >
                  <span className="text-[12px] font-bold font-mono">@</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column Photo (Talent Image filling up to 600px height resting at baseline) */}
          <div className="w-full lg:flex-1 flex justify-center lg:justify-end items-end relative -mb-1">
            <div className="relative w-full max-w-[480px] lg:max-w-[540px] h-[450px] sm:h-[540px] lg:h-[600px]">
              <Image
                src="/profile-talent.png"
                alt={settings?.siteName || "Helmi Salsabila"}
                fill
                priority
                className="object-contain object-bottom filter drop-shadow-sm"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 540px"
              />
            </div>
          </div>
        </div>

        {/* 2. STATS RIBBON BAR (Seamless Dark Full-Width Container matching Mockup) */}
        <div className="w-full bg-gradient-to-r from-[#020A14] via-[#0A1B30] to-[#020A14] text-white border-t border-slate-800 shadow-2xl">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px] py-6 sm:py-8">
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
      <section className="bg-[#E6FAF8]/70 py-16 -mt-12 mb-4 border-y border-[#99F6E4]/50">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px] space-y-6">
          <SectionHeader
            title="Layanan & Portfolio"
            subtitle="Solusi profesional untuk berbagai kebutuhan data dan digital Anda"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {services.map((srv, idx) => (
              <Link
                key={srv.id}
                href={`/layanan/${srv.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] bg-slate-950 rounded-xl relative overflow-hidden flex items-center justify-center p-3">
                    {srv.slug.includes("data-analyst") ? (
                      <div className="w-full h-full bg-[#020B14] rounded-lg flex flex-col items-center justify-center text-center p-3 relative overflow-hidden">
                        {/* Atmospheric blue glow */}
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

                  <div className="pt-3 pb-1 px-1">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#1E3A5F] transition-colors line-clamp-2">
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
          {products.map((prd, idx) => (
            <Link
              key={prd.id}
              href={`/produk/${prd.slug}`}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/11] bg-slate-100 relative overflow-hidden flex items-center justify-center p-4">
                  {idx === 0 ? (
                    <div className="w-28 h-36 bg-gradient-to-b from-indigo-950 to-slate-900 rounded-lg shadow-xl p-2.5 flex flex-col justify-between text-white border border-cyan-500/40 transform group-hover:scale-105 transition-transform text-center">
                      <span className="text-[8px] tracking-wider uppercase text-cyan-400 font-bold">DIGITAL PRODUCT</span>
                      <div className="w-10 h-10 mx-auto rounded-md bg-cyan-900/60 border border-cyan-400/50 flex items-center justify-center text-cyan-300 font-mono text-[9px]">
                        QR
                      </div>
                      <span className="text-[9px] font-extrabold tracking-wider text-slate-300">PASSPORT</span>
                    </div>
                  ) : idx === 1 ? (
                    <div className="w-28 h-36 bg-gradient-to-tr from-blue-950 via-slate-900 to-indigo-950 rounded-lg shadow-xl p-2.5 flex flex-col justify-center text-center text-white border border-amber-400/50 transform group-hover:scale-105 transition-transform">
                      <div className="text-2xl font-black text-amber-400 tracking-tight leading-none">150</div>
                      <div className="text-[10px] font-extrabold text-white leading-tight mt-0.5">DIGITAL<br />PRODUCT<br />IDEAS</div>
                    </div>
                  ) : (
                    <div className="w-28 h-36 bg-white rounded-lg shadow-xl p-2.5 flex flex-col justify-between text-slate-900 border border-slate-200 transform group-hover:scale-105 transition-transform text-center">
                      <div className="w-6 h-6 mx-auto rounded bg-gradient-to-tr from-pink-400 to-cyan-400 flex items-center justify-center shadow-xs" />
                      <div>
                        <div className="text-[11px] font-extrabold text-slate-900 leading-tight">Digital<br />Product</div>
                        <div className="text-[10px] font-bold text-slate-500">Ideas.</div>
                      </div>
                      <span className="text-[7px] text-slate-400">STARTER PACK</span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-[#1E3A5F] transition-colors line-clamp-2">
                    {prd.title}
                  </h3>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 flex items-center justify-between border-t border-slate-100 text-xs">
                <span className="font-bold text-emerald-600 text-xs sm:text-sm">{formatRupiah(prd.discountedPrice)}</span>
                <span className="text-slate-400 text-[11px]">Terjual : {prd.totalSales.toLocaleString("id-ID")}</span>
              </div>
            </Link>
          ))}
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
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px]">
        <SectionHeader title="Testimoni Klien" subtitle="Apa kata klien tentang" />
        <TestimonialCarousel testimonials={testimonials} />
      </section>

      {/* 6. ARTIKEL SECTION */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px]">
        <SectionHeader
          title="Artikel"
          subtitle="Kumpulan tulisan, insight, dan pengalaman yang saya bagikan untuk Anda"
        />

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar text-xs">
          <Link
            href="/blog"
            className="px-4 py-2 rounded-lg border border-[#0D9488] bg-[#E6FAF8] text-slate-800 font-bold shrink-0 transition-colors shadow-xs"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {articles.map((art, idx) => (
            <Link
              key={art.id}
              href={`/blog/${art.slug}`}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] bg-slate-900 relative overflow-hidden flex items-center justify-center text-white">
                  {idx === 0 ? (
                    <div className="w-full h-full bg-gradient-to-tr from-blue-950 via-slate-900 to-cyan-950 flex items-center justify-center relative p-6">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shadow-lg">
                        <Lock className="w-7 h-7 text-cyan-300" />
                      </div>
                    </div>
                  ) : idx === 1 ? (
                    <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                      <div className="text-lg font-black tracking-widest text-white flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px]">⊙</div>
                        <span>AIRIS PACS</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-amber-950 via-slate-900 to-orange-950 flex items-center justify-center p-6">
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center shadow-lg">
                        <Award className="w-7 h-7 text-amber-300" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-[#1E3A5F] transition-colors line-clamp-2 leading-snug">
                    {art.title}
                  </h3>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 text-[11px] text-slate-400 border-t border-slate-100">
                {formatDateIndo(art.publishedAt)}
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

        <div className="bg-white rounded-2xl border border-[#99F6E4] p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 shadow-xs">
          {valueProps.map((val, idx) => (
            <div
              key={val.id}
              className="p-4 sm:p-5 space-y-3 text-center flex flex-col items-center justify-start"
            >
              <div className="w-14 h-14 flex items-center justify-center mb-1">
                {renderValuePropIcon(val.icon3dName, idx, val.title)}
              </div>

              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">{val.title}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs">{val.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CTA SECTION (Siap untuk Memulai Bekerjasama?) */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px]">
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: CTA Pitch & Socials */}
          <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between bg-gradient-to-br from-[#FFFDF0] via-[#F4FBFA] to-[#E6F8FA] border-b lg:border-b-0 lg:border-r-[3px] lg:border-[#1E3A5F]">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-[1.2]">
                Siap untuk Memulai<br />Bekerjasama?
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

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-8 text-sm text-slate-700 font-medium">
              <span className="text-xs sm:text-sm text-slate-600">Sosial Media :</span>
              <div className="flex items-center gap-2.5">
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 rounded bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-2xs"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
                <a
                  href={socials.dribbble || "https://dribbble.com"}
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 rounded-full bg-[#EA4C89] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-2xs"
                  aria-label="Dribbble"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.605 4.61a8.502 8.502 0 0 1 1.93 5.314c-.261-.049-2.308-.43-4.445-.069-.086-.192-.178-.382-.276-.568a20.06 20.06 0 0 0-2.39-3.52c2.612-1.077 4.793-.728 5.181-.157zm-6.605-2.61c2.146 0 4.108.775 5.627 2.063-.377-.074-2.128-.276-4.502.7-1.12-2.025-2.336-3.79-2.585-4.148.468-.088.955-.135 1.46-.135zm-3.418.986c.218.318 1.408 2.061 2.52 4.053-3.265.98-6.196.963-6.52.959a8.47 8.47 0 0 1 4-5.012zm-5.076 7.014c.319.004 3.738.016 7.307-1.116.126.246.247.495.362.748-2.68 1.096-5.26 3.719-5.469 3.937a8.498 8.498 0 0 1-2.2-3.569zm3.435 5.093c.27-.272 2.659-2.668 5.34-3.743 1.036 2.76 1.47 5.176 1.554 5.688a8.514 8.514 0 0 1-6.894-1.945zm8.889 1.032c-.08-.426-.492-2.736-1.492-5.419 2.023-.393 3.844-.066 4.093-.016a8.528 8.528 0 0 1-2.601 5.435z" />
                  </svg>
                </a>
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 rounded bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-2xs"
                  aria-label="Instagram"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a
                  href={socials.threads}
                  target="_blank"
                  rel="noreferrer"
                  className="w-6 h-6 rounded bg-black text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-2xs text-[11px] font-mono font-bold"
                  aria-label="Threads"
                >
                  @
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Work Steps Cards */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 bg-white flex flex-col justify-center space-y-3.5">
            {displaySteps.map((step) => (
              <div
                key={step.id}
                className="border border-[#38BDF8] rounded-2xl p-4 sm:p-5 bg-white shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 text-sm sm:text-base shrink-0">{step.stepNumber}</span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">{step.title}</h3>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-500 mt-1 leading-relaxed pl-8">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
