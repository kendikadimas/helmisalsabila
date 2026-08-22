"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface TestimonialItem {
  id: string;
  clientName: string;
  clientCompany: string;
  avatarUrl?: string | null;
  quote: string;
}

export default function TestimonialCarousel({ testimonials }: { testimonials: TestimonialItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* 3 Testimonial Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, idx) => (
          <div
            key={t.id + idx}
            className="bg-white rounded-2xl border border-slate-200 p-7 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative"
          >
            <div>
              {/* Double Quote Icon in Blue */}
              <div className="text-[#0284C7] mb-3 select-none flex items-center gap-1 font-serif text-4xl font-extrabold leading-none">
                <svg className="w-8 h-8 fill-[#0284C7]" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                {t.quote}
              </p>
            </div>

            <div className="flex items-center justify-between pt-5 mt-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-900 to-red-600 text-white flex items-center justify-center font-bold text-xs shadow-xs overflow-hidden">
                  {t.avatarUrl ? (
                    <img src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{t.clientName.charAt(0)}</span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-900">{t.clientName}</span>
              </div>

              <div className="text-slate-900 font-extrabold tracking-widest text-sm font-sans flex items-center gap-0.5">
                <span className="text-[#0F172A]">{t.clientCompany || "FOOM"}</span>
                <span className="text-[9px] text-slate-400 font-normal">®</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Navigation (Dots on Left of Arrows) */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <div className="flex items-center gap-1.5 mr-2">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentIndex ? "bg-[#0F172A]" : "bg-slate-200 hover:bg-slate-300"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handlePrev}
          className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-xs"
          aria-label="Previous testimonial"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={handleNext}
          className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 transition-colors shadow-xs"
          aria-label="Next testimonial"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
