import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Tracker from "@/components/Tracker"; // Hook import nahi karna, sirf component!

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Sirat AI - Hidayat ka Rasta",
  description: "Quran aur Sunnah ki roshni mein AI-powered Islamic Sawalat o Jawabat",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <Providers>
          <Tracker /> 
          {children}
        </Providers>
      </body>
    </html>
  );
}