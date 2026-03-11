import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Sirat AI - Hidayat ka Rasta",
  description: "Quran aur Sunnah ki roshni mein AI-powered Islamic Sawalat o Jawabat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {/* Providers poori app ko auth ka context dein ge */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}



