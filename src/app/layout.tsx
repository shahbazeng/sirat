import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Tracker from "@/components/Tracker"; 

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  metadataBase: new URL('https://siratai.com'),
  title: "Sirat.ai | Authentic Islamic Wisdom & Digital Guidance",
  description: "Get instant, verified answers from Al-Quran and Sahih Hadith. Explore our digital sanctuary for Fiqh, Family Laws, and Zakat guidance. Empowering the Ummah with technology.",
  keywords: ["Sirat.ai", "Islamic AI", "Quran and Hadith", "Sharia guidance", "Zakat calculator", "Halal investment", "Islamic wisdom", "Dawah platform"],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Sirat.ai | Authentic Islamic Wisdom",
    description: "Your digital sanctuary for verified Islamic knowledge.",
    url: 'https://siratai.com',
    siteName: 'Sirat.ai',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Schema Markup corrected for siratai.com
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Sirat.ai",
    "url": "https://siratai.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://siratai.com/chat?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-YE4SMQJ61D"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YE4SMQJ61D');
            `,
          }}
        />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <Providers>
          <Tracker /> 
          {children}
        </Providers>
      </body>
    </html>
  );
}