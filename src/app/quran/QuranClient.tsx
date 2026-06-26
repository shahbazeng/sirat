"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Search, Sparkles, Loader2, Heart, List, LayoutGrid } from 'lucide-react';

export default function QuranClient() {
  const router = useRouter();
  const [surahs, setSurahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchSurahs() {
      try {
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await res.json();
        setSurahs(data.data || []);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    fetchSurahs();
  }, []);

  const filteredSurahs = surahs.filter((s: any) => 
    s?.englishName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fdfcf8] p-4 md:p-12 font-sans">
      {/* Header */}
      <header className="max-w-6xl mx-auto border-b border-gray-100 pb-8 mb-12">
        <h1 className="text-4xl md:text-6xl font-serif font-black italic text-[#1a2e2a]">
          The Noble <span className="text-[#D4AF37]">Quran</span>
        </h1>
        <p className="text-gray-500 mt-2">Verified Digital Interface & AI Context Mapping Engine</p>
      </header>

      {/* Browser */}
      <section className="max-w-6xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="relative mb-8">
           <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
           <input 
             type="text" 
             placeholder="Search Surah (e.g. Al-Baqarah)..." 
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#D4AF37]"
           />
        </div>

        {loading ? <Loader2 className="animate-spin mx-auto" /> : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSurahs.map((surah: any) => (
              <article key={surah.number} onClick={() => router.push(`/quran/${surah.number}`)} 
                className="p-6 border rounded-2xl cursor-pointer hover:border-[#D4AF37] hover:shadow-lg transition-all flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-[#1a2e2a]">{surah.englishName}</h2>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">{surah.englishNameTranslation}</p>
                </div>
                <span className="font-serif text-2xl opacity-40">{surah.name}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}