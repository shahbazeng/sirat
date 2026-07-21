// src/app/layout.tsx - Final Working Code
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Tracker from "@/components/Tracker"; 
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.siratai.com'),
  title: "Siratai | Authentic Islamic Wisdom & Digital Guidance",
  description: "Get instant, verified answers from Al-Quran and Sahih Hadith.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Siratai",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <Providers>
          <AuthProvider>
            <Tracker />
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}