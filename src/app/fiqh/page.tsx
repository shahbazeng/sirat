"use client";

import { useRouter } from 'next/navigation';
import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const categories = [
  { name: 'Zakat & Wealth', icon: '💰' },
  { name: 'Marriage & Nikah', icon: '💍' },
  { name: 'Inheritance Law', icon: '📜' },
  { name: 'Business Ethics', icon: '⚖️' },
  { name: 'Daily Salah', icon: '🕌' },
  { name: 'Fasting & Ramadan', icon: '🌙' },
  { name: 'Hajj & Umrah', icon: '🕋' },
  { name: 'Food & Halal', icon: '🍎' },
  { name: 'Hygiene & Taharah', icon: '🧼' },
  { name: 'Health & Rights', icon: '🤝' },
];

export default function FiqhPage() {
  const router = useRouter();

  const redirectToChat = (query: string) => {
    router.push(`/chat?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] py-12 px-4 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-black mb-4 italic">Fiqh-ul-Sirat</h1>
        <p className="text-gray-600 font-medium">Quran o Sunnah ki roshni mein aapke masail ka hal.</p>
      </div>
      
      {/* Search Bar */}
      <div className="w-full max-w-xl relative mb-16">
        <input 
          placeholder="Apna sawal yahan likhein..."
          onKeyDown={(e) => e.key === 'Enter' && redirectToChat((e.target as HTMLInputElement).value)}
          className="w-full py-6 px-8 rounded-[2rem] border border-gray-200 shadow-xl outline-none focus:ring-4 focus:ring-[#D4AF37]/20"
        />
        <button className="absolute right-3 top-3 p-3 bg-[#1A2E2A] text-[#D4AF37] rounded-full">
          <Search size={20} />
        </button>
      </div>

      {/* 10 Essential Categories Grid */}
      <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {categories.map((cat, i) => (
          <motion.button 
            key={i}
            whileHover={{ y: -5 }}
            onClick={() => redirectToChat(cat.name)}
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg flex flex-col items-center gap-3 transition-all group"
          >
            <span className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-[#1a2e2a] text-center">
              {cat.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}