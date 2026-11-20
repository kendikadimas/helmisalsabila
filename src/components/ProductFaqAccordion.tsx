"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    question: "Bagaimana cara mengakses materi setelah pembayaran berhasil?",
    answer:
      "Setelah pembayaran Anda terverifikasi oleh DOKU, Anda akan langsung diarahkan ke halaman status sukses yang menyertakan tombol unduh/akses materi digital. Selain itu, tanda terima resmi beserta link akses juga otomatis dikirimkan ke alamat email yang Anda daftarkan.",
  },
  {
    question: "Berapa lama masa berlaku akses produk digital ini?",
    answer:
      "Akses bersifat seumur hidup (Lifetime Access). Anda dapat mengunduh materi kapan saja dan membukanya kembali tanpa batasan waktu.",
  },
  {
    question: "Metode pembayaran apa saja yang didukung?",
    answer:
      "Kami menggunakan payment gateway resmi DOKU yang mendukung pembayaran instan via QRIS (GoPay, OVO, Dana, ShopeePay, LinkAja, BCA Mobile), Virtual Account (BCA, Mandiri, BRI, BNI, Permata), E-Wallet, dan Kartu Kredit / Debit.",
  },
  {
    question: "Apakah materi akan mendapatkan pembaruan (update) gratis?",
    answer:
      "Ya! Jika ada pembaruan versi, perbaikan template, atau penambahan materi baru, Anda akan mendapatkan pembaruan tersebut secara gratis melalui link unduhan resmi.",
  },
  {
    question: "Bagaimana jika saya mengalami kendala teknis atau pembayaran?",
    answer:
      "Tim admin kami siap membantu Anda setiap hari kerja melalui WhatsApp resmi. Cukup sertakan nomor invoice pesanan Anda untuk bantuan instan.",
  },
];

export default function ProductFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 bg-teal-500 rounded-full" />
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-teal-600" />
          <span>Pertanyaan Sering Diajukan (FAQ)</span>
        </h2>
      </div>

      <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        {DEFAULT_FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="transition-colors">
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-bold text-slate-800">{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-teal-600" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 sm:px-6 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50 animate-in fade-in duration-150">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
