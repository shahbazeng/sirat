"use client";
import Header from "@/components/layout/header"; // yahan 'header' lowercase karein
import Footer from "@/components/layout/footer"; // yahan 'footer' lowercase karein
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, Search, Play, Clock, LayoutGrid, List, Bookmark, 
  Sparkles, Loader2, Heart, ShieldCheck, Beaker, ChevronRight 
} from 'lucide-react';

export default function QuranPage() {

  const router = useRouter();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('surah');
  const [surahs, setSurahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);



 // --- QURANIC SCIENTIFIC MIRACLES DATA ---
  const quranMiracles = [
    { 
      title: "The Expanding Universe", 
      ayah: "Surah Adh-Dhariyat [51:47]", 
      desc: "A 1400-year-old revelation describing the continuous expansion of the universe, aligning precisely with modern cosmic expansion models." 
    },
    { 
      title: "Iron from Outer Space", 
      ayah: "Surah Al-Hadid [57:25]", 
      desc: "The Quran states iron was 'sent down,' which perfectly matches astrophysical findings that iron on Earth originated from deep supernova explosions." 
    },
    { 
      title: "The Safe Canopy (Atmosphere)", 
      ayah: "Surah Al-Anbiya [21:32]", 
      desc: "The sky is described as a protected ceiling, reflecting how the Earth's atmosphere protects us from deadly cosmic radiation and meteorites." 
    },
  ];

  const tabs = [
    { id: 'surah', label: 'Surahs', icon: <List size={16} /> },
    { id: 'para', label: 'Juz / Parts', icon: <LayoutGrid size={16} /> },
  ];

  // --- FETCH QURAN DATA pipeline ---
  useEffect(() => {
    async function fetchSurahs() {
      try {
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await res.json();
        setSurahs(data.data || []);
      } catch (err) {
        console.error("Quran Fetch Exception Core:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSurahs();
  }, []);

  const filteredSurahs = surahs.filter((s: any) => 
    s?.englishName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s?.number?.toString().includes(searchTerm) ||
    s?.englishNameTranslation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fdfcf8] font-sans flex flex-col justify-between overflow-x-hidden">
      
      {/* 1. Header Add kiya */}
      <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="flex-grow p-4 md:p-8 lg:p-12">

      <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
        
        {/* --- CLEANED QURAN HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#D4AF37] font-black text-[10px] uppercase tracking-[0.4em]">
              <Sparkles size={14} /> Sirat Authentic Hub
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-black italic text-[#1a2e2a]">
              The Noble <span className="text-[#D4AF37]">Quran</span>
            </h1>
            <p className="text-gray-400 text-xs md:text-sm font-medium">Verified Digital Interface for Divine Revelation & Wisdom Mapping</p>
          </div>
          <div className="flex bg-[#1a2e2a] p-4 rounded-3xl shadow-xl border-b-4 border-[#D4AF37] text-white flex-col items-center shrink-0">
             <Book className="text-[#D4AF37]" size={28} />
          </div>
        </header>

        {/* --- MOOD RESOLVER SELECTOR --- */}
        <section className="bg-white border border-gray-100 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left space-y-1">
              <h3 className="text-2xl font-serif font-black italic text-[#1a2e2a] flex items-center gap-3 justify-center lg:justify-start">
                <Heart size={24} className="text-red-500 fill-red-500" /> Spiritual Resonance
              </h3>
              <p className="text-sm text-gray-400 font-medium">How is your heart feeling today? Seek Quranic remedies.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {['Anxious', 'Grateful', 'Lost', 'Weak', 'Sad'].map((mood) => (
                <button 
                  key={mood}
                  onClick={() => router.push(`/chat?q=Which Quranic verses should I read if I am feeling extremely ${mood}?`)}
                  className="px-5 md:px-8 py-3 md:py-4 rounded-2xl bg-[#fdfcf8] border border-gray-100 text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all shadow-sm active:scale-95"
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* --- MIRACLES & RESUME GRID LAYER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Scientific Signs in Al-Quran */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {quranMiracles.map((m, i) => (
              <div key={i} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 flex flex-col justify-between hover:border-[#D4AF37]/30 transition-all shadow-sm group">
                <div className="space-y-4">
                  <div className="p-3 bg-[#fdfcf8] group-hover:bg-[#1a2e2a] group-hover:text-[#D4AF37] transition-all rounded-xl text-[#D4AF37] w-fit">
                    <Beaker size={24} />
                  </div>
                  <h5 className="font-serif font-black italic text-xl text-[#1a2e2a]">{m.title}</h5>
                  <p className="text-gray-400 text-xs leading-relaxed font-medium">{m.desc}</p>
                </div>
                <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] mt-6 border-t pt-4 font-mono">{m.ayah}</p>
              </div>
            ))}
          </div>

          {/* Quick Resume Engine Module */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-[#D4AF37] rounded-[2.5rem] md:rounded-[3rem] p-10 text-[#1a2e2a] relative overflow-hidden shadow-2xl cursor-pointer flex flex-col justify-between group"
            onClick={() => router.push('/quran/18')}
          >
            <div className="space-y-4 relative z-10">
              <Clock size={40} className="mb-4 opacity-40 group-hover:rotate-12 transition-all" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Recently Read</p>
              <h2 className="text-4xl font-serif font-bold italic">Surah Al-Kahf</h2>
              <p className="bg-[#1a2e2a]/10 px-4 py-1.5 rounded-full w-fit text-[10px] font-black uppercase tracking-widest mt-1">Juz 15 • Ayah 1</p>
            </div>
            <button className="mt-8 bg-[#1a2e2a] text-white w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-transform">
              Resume Reading <Play size={12} className="inline ml-2" fill="currentColor" />
            </button>
          </motion.div>
        </div>

        {/* --- SURAH / JUZ BROWSER MAIN SECTION --- */}
        <div className="space-y-8 pt-10 border-t border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            
            {/* Input Vector Bar */}
            <div className="relative group w-full max-w-md">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37]" size={20} />
              <input 
                type="text" 
                placeholder="Search Surah name, translation or number..." 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-white border border-gray-100 rounded-3xl md:rounded-[2rem] outline-none focus:ring-8 focus:ring-[#D4AF37]/5 font-bold text-sm shadow-sm transition-all"
              />
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 p-1.5 bg-gray-100/50 rounded-[2rem] overflow-x-auto no-scrollbar max-w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 md:px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === tab.id ? 'bg-[#1a2e2a] text-[#D4AF37] shadow-xl' : 'text-gray-400 hover:text-[#1a2e2a]'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="animate-spin text-[#D4AF37]" size={50} />
              </div>
            ) : (
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
              >
                {/* Render Surahs Filtered Window */}
                {activeTab === 'surah' && filteredSurahs.map((surah: any) => (
                  <motion.div 
                    key={surah.number} 
                    whileHover={{ scale: 1.02, x: 6 }}
                    onClick={() => router.push(`/quran/${surah.number}`)}
                    className="group bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-50 hover:border-[#D4AF37]/30 hover:shadow-xl transition-all cursor-pointer flex items-center justify-between relative overflow-hidden"
                  >
                    <div className="flex items-center gap-4 md:gap-6 relative z-10 min-w-0 flex-1">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-[#fdfcf8] group-hover:bg-[#1a2e2a] group-hover:text-[#D4AF37] rounded-2xl flex items-center justify-center text-xs font-black transition-all shrink-0">
                        {surah.number}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-serif font-black text-xl md:text-2xl text-[#1a2e2a] group-hover:text-[#D4AF37] transition-colors truncate">
                          {surah.englishName}
                        </h4>
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-1 truncate">
                          {surah.englishNameTranslation} • {surah.numberOfAyahs} Verses
                        </p>
                      </div>
                    </div>
                    
                    {/* Arabic Text Layer Container */}
                    <div className="text-3xl md:text-5xl font-serif font-bold text-[#1a2e2a]/5 group-hover:text-[#1a2e2a]/10 transition-all absolute right-4 bottom-2 md:bottom-4 tracking-normal select-none pointer-events-none" dir="rtl">
                      {surah.name}
                    </div>
                  </motion.div>
                ))}

                {/* Render Juz/Para Layout Selector */}
                {activeTab === 'para' && (
                  <div className="col-span-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 30 }, (_, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ scale: 1.05, backgroundColor: '#1a2e2a', color: '#D4AF37' }}
                        onClick={() => router.push(`/chat?q=Give me a summary of Juz ${i + 1} of the Quran.`)}
                        className="bg-white border border-gray-100 p-8 rounded-[2rem] text-center cursor-pointer transition-all shadow-sm group"
                      >
                        <p className="text-[10px] font-black uppercase opacity-40 group-hover:text-white/60">Para</p>
                        <h4 className="text-3xl font-serif font-black">{i + 1}</h4>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </main>

      {/* 2. Footer Add kiya */}
      <Footer />
    </div>
  );
}