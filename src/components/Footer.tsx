import Link from "next/link";
import Image from "next/image";
import { MapPin, PhoneCall } from "lucide-react";
import { getSiteSettings } from "@/actions/settings";

export default async function Footer() {
  const settings = await getSiteSettings();

  const siteName = settings?.siteName || "Helmi Salsabila";
  const bio = settings?.bioDescription || "Your Reliable Partner for Digital & Data Solutions";
  const phone = settings?.contactPhone || "+62 69233221";
  const address = settings?.contactAddress || "Based in Tangerang, Indonesia";
  const socials = settings?.socialLinks || {};

  return (
    <footer className="bg-white border-t border-slate-100 mt-16 pt-14 pb-10 text-slate-600">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-[96px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-100">
          {/* Col 1: Identity from DB */}
          <div className="lg:col-span-4 space-y-3.5">
            <div className="w-12 h-12 relative rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src="/logoku-1.png"
                alt={siteName}
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">{siteName}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-xs">{bio}</p>
            </div>
          </div>

          {/* Col 2: Kontak Resmi from DB */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="font-bold text-slate-900 text-sm">Kontak Resmi</h4>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-center gap-2.5">
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 hover:text-[#1E3A5F] transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-[#E6FAF8] text-[#2A5D69] flex items-center justify-center shrink-0">
                    <PhoneCall className="w-3.5 h-3.5" />
                  </span>
                  <span>{phone}</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#E6FAF8] text-[#2A5D69] flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </span>
                <span className="pt-0.5 leading-relaxed">{address}</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigasi Perusahaan */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="font-bold text-slate-900 text-sm">Navigasi Perusahaan</h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <Link href="/layanan" className="hover:text-[#1E3A5F] transition-colors">
                  Layanan & Portfolio
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#1E3A5F] transition-colors">
                  Artikel
                </Link>
              </li>
              <li>
                <Link href="/produk" className="hover:text-[#1E3A5F] transition-colors">
                  Produk
                </Link>
              </li>
              <li>
                <Link href="/cek-pesanan" className="hover:text-[#1E3A5F] transition-colors">
                  Cek Status Pesanan
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Kontak & Sosial Media from DB */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="font-bold text-slate-900 text-sm">Kontak & Sosial Media</h4>
            <div className="flex flex-wrap items-center gap-3">
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="LinkedIn"
                >
                  <img src="/assets/thesvg-color_linkedin.png" alt="LinkedIn" className="w-6 h-6 object-contain" />
                </a>
              )}
              {socials.youtube && (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="YouTube"
                >
                  <img src="/assets/thesvg-color_youtube.png" alt="YouTube" className="w-6 h-6 object-contain" />
                </a>
              )}
              {socials.facebook && (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Facebook"
                >
                  <img src="/assets/logos_facebook.png" alt="Facebook" className="w-6 h-6 object-contain" />
                </a>
              )}
              {socials.instagram && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Instagram"
                >
                  <img src="/assets/skill-icons_instagram.png" alt="Instagram" className="w-6 h-6 object-contain" />
                </a>
              )}
              {socials.threads && (
                <a
                  href={socials.threads}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="Threads"
                >
                  <img src="/assets/mingcute_threads-line.png" alt="Threads" className="w-6 h-6 object-contain" />
                </a>
              )}
              {socials.tiktok && (
                <a
                  href={socials.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="TikTok"
                >
                  <img src="/assets/ic_baseline-tiktok.png" alt="TikTok" className="w-6 h-6 object-contain" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 text-center text-xs text-slate-500">
          Copyright {new Date().getFullYear()} {siteName} | All right reserved
        </div>
      </div>
    </footer>
  );
}
