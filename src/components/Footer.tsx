import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Linkedin, Youtube, Facebook, Instagram, Music2 } from "lucide-react";
import { getSiteSettings } from "@/actions/settings";

export default async function Footer() {
  const settings = await getSiteSettings();

  const siteName = settings?.siteName || "Helmi Salsabila";
  const bio = settings?.bioDescription || "Your Reliable Partner for Digital & Data Solutions";
  const phone = settings?.contactPhone || "+62 69233221";
  const address = settings?.contactAddress || "Based in Tangerang, Indonesia";
  const socials = settings?.socialLinks || {};

  return (
    <footer className="bg-white border-t border-slate-100 mt-20 pt-16 pb-12 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-100">
          {/* Col 1: Identity from DB */}
          <div className="space-y-4">
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
              <h3 className="font-bold text-slate-900 text-lg">{siteName}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{bio}</p>
            </div>
          </div>

          {/* Col 2: Kontak Resmi from DB */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Kontak Resmi</h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigasi Perusahaan */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Navigasi Perusahaan</h4>
            <ul className="space-y-2 text-xs">
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
            </ul>
          </div>

          {/* Col 4: Kontak & Sosial Media from DB */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Kontak & Sosial Media</h4>
            <div className="flex items-center gap-3">
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {socials.youtube && (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded bg-[#FF0000] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {socials.facebook && (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {socials.instagram && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {socials.threads && (
                <a
                  href={socials.threads}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded bg-black text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                  aria-label="Threads"
                >
                  <span className="text-xs font-bold font-mono">@</span>
                </a>
              )}
              {socials.tiktok && (
                <a
                  href={socials.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="w-7 h-7 rounded bg-black text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                  aria-label="TikTok"
                >
                  <Music2 className="w-4 h-4" />
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
