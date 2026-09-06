"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientCompany: string;
  avatarUrl?: string | null;
  companyLogoUrl?: string | null;
  quote: string;
}

export default function TestimonialCarousel({ testimonials }: { testimonials: TestimonialItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) return null;

  const totalCards = testimonials.length;
  // Step through by 1 item for smooth sliding
  const maxIndex = Math.max(0, totalCards - 3);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Ensure we have at least 3 display cards
  const displayItems = [...testimonials];
  while (displayItems.length < 3) {
    displayItems.push(testimonials[displayItems.length % testimonials.length]);
  }

  return (
    <div className="space-y-6">
      {/* 3 Testimonial Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayItems.slice(currentIndex, currentIndex + 3).map((t, idx) => (
          <div
            key={`${t.id}-${idx}`}
            className="bg-white rounded-[24px] border border-slate-100 p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative min-h-[260px]"
          >
            <div className="space-y-3.5">
              {/* Dual-Tone Cyan to Deep Navy Quote SVG Icon matching Figma Mockup */}
              <div className="select-none flex items-center">
                <svg className="w-9 h-8" viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0 28V16.3333C0 7.31111 5.91111 1.24444 14.2333 0L15.8083 3.38333C11.9778 4.78333 9.52778 9.06111 9.52778 12.4444H15.8083V28H0ZM19.1917 28V16.3333C19.1917 7.31111 25.1028 1.24444 33.425 0L35 3.38333C31.1694 4.78333 28.7194 9.06111 28.7194 12.4444H35V28H19.1917Z"
                    fill="url(#quote_dual_gradient)"
                  />
                  <defs>
                    <linearGradient id="quote_dual_gradient" x1="0" y1="0" x2="35" y2="28" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00A3FF" />
                      <stop offset="1" stopColor="#0B1E3B" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Quote Description Text */}
              <p className="text-[13px] text-slate-700 leading-relaxed font-normal">
                {t.quote}
              </p>
            </div>

            {/* Bottom Row Divider & Identity Info */}
            <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between">
              {/* Left Column: Avatar Photo + Client Name */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 overflow-hidden shrink-0 relative shadow-2xs">
                  {t.avatarUrl ? (
                    <img
                      src={t.avatarUrl}
                      alt={t.clientName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/profile-talent.png";
                      }}
                    />
                  ) : (
                    <img src="/profile-talent.png" alt={t.clientName} className="w-full h-full object-cover" />
                  )}
                </div>
                <span className="text-xs sm:text-[13px] font-bold text-slate-900">{t.clientName}</span>
              </div>

              {/* Right Column: Company Logo / Brand Name (e.g., FOOM®) */}
              <div className="flex items-center justify-end shrink-0">
                {t.companyLogoUrl ? (
                  <img
                    src={t.companyLogoUrl}
                    alt={t.clientCompany}
                    className="h-5 sm:h-6 max-w-[100px] object-contain"
                  />
                ) : (
                  <div className="text-[#0B1E3B] font-black tracking-widest text-sm font-sans flex items-center gap-0.5">
                    <span>{t.clientCompany || "FOOM"}</span>
                    <span className="text-[8px] text-slate-500 font-bold -mt-1">®</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls Matching Mockup: 3 Small Dots on Left + Square White Prev/Next Button with Border */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {/* 3 Circular Dots */}
        <div className="flex items-center gap-1.5 mr-2">
          {[0, 1, 2].map((dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => setCurrentIndex(Math.min(dotIndex, maxIndex))}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                dotIndex === currentIndex ? "bg-[#0B1E3B]" : "bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${dotIndex + 1}`}
            />
          ))}
        </div>

        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-2xs cursor-pointer active:scale-95"
          aria-label="Previous testimonial"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-2xs cursor-pointer active:scale-95"
          aria-label="Next testimonial"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
