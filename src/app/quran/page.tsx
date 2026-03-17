"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Book, Search, Play, Clock, LayoutGrid, List, Bookmark, Sparkles, Loader2 } from 'lucide-react';

export default function QuranPage() {
  const [activeTab, setActiveTab] = useState('surah');
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // 1. FETCH ALL SURAHS FROM API
  useEffect(() => {
    async function fetchSurahs() {
      try {
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await res.json();
        setSurahs(data.data);
      } catch (err) {
        console.error("Error fetching surahs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSurahs();
  }, []);

  const tabs = [
    { id: 'surah', label: 'Surah', icon: <List size={18} /> },
    { id: 'para', label: 'Para / Juz', icon: <LayoutGrid size={18} /> },
    { id: 'bookmarks', label: 'Saved', icon: <Bookmark size={18} /> },
  ];

  // Filter surahs based on search
  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.number.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#fdfcf8] p-4 md:p-12 font-sans selection:bg-[#D4AF37] selection:text-white">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-serif font-black italic text-[#1a2e2a]">The Noble <span className="text-[#D4AF37]">Quran</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mt-1">Authentic Divine Revelation</p>
          </div>
          <div className="bg-[#1a2e2a] p-3 rounded-2xl shadow-lg">
            <Sparkles className="text-[#D4AF37]" size={24} />
          </div>
        </div>

        {/* --- CONTINUE READING (Static Example) --- */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-[#1a2e2a] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl cursor-pointer"
          onClick={() => router.push('/quran/18')}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[80px]" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#D4AF37] rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="text-[#1a2e2a]" size={32} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-1">Resume Reading</p>
                <h2 className="text-2xl font-serif font-bold italic">Surah Al-Kahf</h2>
                <p className="text-white/50 text-xs">Juz 15 • Ayah 1</p>
              </div>
            </div>
            <button className="bg-white/10 hover:bg-white hover:text-[#1a2e2a] px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
              Resume <Play size={12} className="inline ml-2" fill="currentColor" />
            </button>
          </div>
        </motion.div>

        {/* --- SEARCH & TABS --- */}
        <div className="space-y-6">
          <div className="relative group max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search 114 Surahs..." 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#D4AF37]/5 focus:border-[#D4AF37]/20 transition-all font-medium text-sm"
            />
          </div>

          <div className="flex gap-2 p-1.5 bg-gray-100/50 rounded-2xl w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id ? 'bg-white text-[#1a2e2a] shadow-sm' : 'text-gray-400 hover:text-[#1a2e2a]'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- SURAH LIST --- */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
            </div>
          ) : (
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {activeTab === 'surah' && filteredSurahs.map((surah) => (
                <div 
                  key={surah.number} 
                  onClick={() => router.push(`/quran/${surah.number}`)}
                  className="group bg-white p-6 rounded-3xl border border-gray-100 hover:border-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/5 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 bg-gray-50 group-hover:bg-[#1a2e2a] group-hover:text-[#D4AF37] rounded-xl flex items-center justify-center text-[10px] font-black transition-colors italic">
                      {surah.number}
                    </div>
                    <div>
                      <h4 className="font-serif font-black text-[#1a2e2a] group-hover:text-[#D4AF37] transition-colors">{surah.englishName}</h4>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        {surah.revelationType} • {surah.numberOfAyahs} Verses
                      </p>
                    </div>
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#1a2e2a]/10 group-hover:text-[#1a2e2a]/100 transition-all" dir="rtl">
                    {surah.name}
                  </div>
                </div>
              ))}
              
              {activeTab === 'para' && (
                <div className="col-span-full py-10 text-center text-gray-400 italic text-sm">Juz/Para data loading...</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}