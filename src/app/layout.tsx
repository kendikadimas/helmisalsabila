import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://helsenvi.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Helmi Salsabila | Your Reliable Partner for Data & Digital Solutions",
    template: "%s | Helmi Salsabila",
  },
  description:
    "Solusi profesional untuk kebutuhan data analytics, digital marketing, IT solutions, dan produk digital berstandar tinggi.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Helmi Salsabila | Data & Digital Solutions",
    description:
      "Solusi profesional untuk kebutuhan data analytics, digital marketing, IT solutions, dan produk digital.",
    url: baseUrl,
    siteName: "Helmi Salsabila Portfolio",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/logoku-1.png",
        width: 800,
        height: 800,
        alt: "Helmi Salsabila Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || process.env.GA_MEASUREMENT_ID;

  return (
    <html lang="id" className={`${plusJakartaSans.variable}`}>
      <head>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className="font-sans antialiased bg-white text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
