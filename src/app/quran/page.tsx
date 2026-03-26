"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Book, Search, Play, Clock, LayoutGrid, List, Bookmark, 
  Sparkles, Loader2, Heart, ShieldCheck, Globe, Beaker, 
  ChevronRight, Plus, X, User, Zap
} from 'lucide-react';

// --- TYPES ---
interface Hero {
  name: string;
  title: string;
  desc: string;
  fullStory: string;
  legacy: string;
  quranConnect: string;
  icon: React.ReactNode;
}

export default function QuranPage() {
  const router = useRouter();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('surah');
  const [surahs, setSurahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);

  // --- GLOBAL DATA ---
  const muslimHeroes: Hero[] = [
    { 
      name: "Hazrat Ali (R.A)", 
      title: "The Gateway to Knowledge", 
      desc: "Renowned for his unparalleled wisdom, deep judicial insight, and immense bravery.",
      fullStory: "Hazrat Ali (R.A) was the cousin and son-in-law of the Prophet (PBUH). Known as the 'Lion of Allah,' he is celebrated globally for his sermons and contributions to Islamic jurisprudence and spiritual depth.",
      legacy: "Established foundational principles of Justice and Logic",
      quranConnect: "Surah Al-Baqarah [207] - Regarding Self-Sacrifice",
      icon: <Zap className="text-[#D4AF37]" /> 
    },
    { 
      name: "Salahuddin Ayyubi", 
      title: "The Great Liberator", 
      desc: "A symbol of chivalry and justice who unified the Muslim world.",
      fullStory: "Sultan Saladin is respected by both East and West for his mercy during the Crusades. In 1187, he liberated Jerusalem, treating the defeated with unprecedented kindness and upholding strict moral codes.",
      legacy: "Unified the Levant and restored peace to Jerusalem",
      quranConnect: "Surah Al-Ma'idah [8] - Regarding Absolute Justice",
      icon: <ShieldCheck className="text-[#D4AF37]" /> 
    },
    { 
      name: "Ibn al-Haytham", 
      title: "Father of Optics", 
      desc: "The scientist who revolutionized our understanding of light and vision.",
      fullStory: "Often referred to as the 'First Scientist,' he pioneered the scientific method. His 'Book of Optics' proved that light reflects off objects into the eye, laying the foundation for modern photography and physics.",
      legacy: "Invented the Camera Obscura and the Scientific Method",
      quranConnect: "Surah Al-An'am [104] - Regarding Vision and Insight",
      icon: <Sparkles className="text-[#D4AF37]" /> 
    },
  ];

  const quranMiracles = [
    { title: "The Expanding Universe", ayah: "Surah Adh-Dhariyat [47]", desc: "A 1400-year-old revelation describing the continuous expansion of the universe, a core concept in modern cosmology." },
    { title: "Iron from Outer Space", ayah: "Surah Al-Hadid [25]", desc: "The Quran states iron was 'sent down,' aligning with modern findings that iron originated from supernova explosions in space." },
  ];

  const tabs = [
    { id: 'surah', label: 'Surahs', icon: <List size={16} /> },
    { id: 'para', label: 'Juz / Parts', icon: <LayoutGrid size={16} /> },
    { id: 'bookmarks', label: 'Library', icon: <Bookmark size={16} /> },
  ];

  // --- FETCHING ---
  useEffect(() => {
    async function fetchSurahs() {
      try {
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await res.json();
        setSurahs(data.data || []);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSurahs();
  }, []);

  const filteredSurahs = surahs.filter((s: any) => 
    s?.englishName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s?.number?.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#fdfcf8] p-4 md:p-8 lg:p-12 font-sans selection:bg-[#D4AF37] selection:text-white pb-20 overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#D4AF37] font-black text-[10px] uppercase tracking-[0.4em]">
              <Sparkles size={14} /> Sirat Global Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-black italic text-[#1a2e2a]">The Noble <span className="text-[#D4AF37]">Quran</span></h1>
            <p className="text-gray-400 text-xs md:text-sm font-medium">Digital Hub for Divine Revelation & Historical Legacies</p>
          </div>
          <div className="flex bg-[#1a2e2a] p-4 rounded-3xl shadow-xl border-b-4 border-[#D4AF37] text-white flex-col items-center">
             <ShieldCheck className="text-[#D4AF37]" size={28} />
          </div>
        </header>

        {/* --- MOOD SELECTOR --- */}
        <section className="bg-white border border-gray-100 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left space-y-1">
              <h3 className="text-2xl font-serif font-black italic text-[#1a2e2a] flex items-center gap-3 justify-center lg:justify-start">
                <Heart size={24} className="text-red-500 fill-red-500" /> Spiritual Resonance
              </h3>
              <p className="text-sm text-gray-400 font-medium">How is your heart feeling today?</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {['Anxious', 'Grateful', 'Lost', 'Weak', 'Happy'].map((mood) => (
                <button 
                  key={mood}
                  onClick={() => router.push(`/chat?q=Quranic verses for someone feeling ${mood}`)}
                  className="px-5 md:px-8 py-3 md:py-4 rounded-2xl bg-[#fdfcf8] border border-gray-100 text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all shadow-sm active:scale-95"
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* --- MUSLIM HEROES --- */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 px-2">
             <User className="text-[#D4AF37]" size={24} />
             <h3 className="text-2xl font-serif font-black italic">Great Muslim Legacies</h3>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x px-2">
            {muslimHeroes.map((hero, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedHero(hero)}
                className="min-w-[280px] md:min-w-[340px] bg-[#1a2e2a] text-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden group cursor-pointer snap-start"
              >
                <div className="mb-6 p-4 bg-white/5 w-fit rounded-2xl group-hover:bg-[#D4AF37] group-hover:text-[#1a2e2a] transition-all">{hero.icon}</div>
                <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-2">{hero.title}</p>
                <h4 className="text-2xl md:text-3xl font-serif font-bold italic mb-4">{hero.name}</h4>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">
                  View Legacy <ChevronRight size={14} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- MIRACLES & RESUME --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {quranMiracles.map((m, i) => (
              <div key={i} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 flex flex-col justify-between hover:border-[#D4AF37]/30 transition-all shadow-sm">
                <div className="space-y-4">
                  <div className="p-3 bg-[#fdfcf8] rounded-xl text-[#D4AF37] w-fit"><Beaker size={24} /></div>
                  <h5 className="font-serif font-black italic text-xl text-[#1a2e2a]">{m.title}</h5>
                  <p className="text-gray-400 text-xs leading-relaxed">{m.desc}</p>
                </div>
                <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.2em] mt-6 border-t pt-4">{m.ayah}</p>
              </div>
            ))}
          </div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-[#D4AF37] rounded-[2.5rem] md:rounded-[3rem] p-10 text-[#1a2e2a] relative overflow-hidden shadow-2xl cursor-pointer flex flex-col justify-between"
            onClick={() => router.push('/quran/18')}
          >
            <div className="space-y-4 relative z-10">
              <Clock size={40} className="mb-4 opacity-40" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Recently Read</p>
              <h2 className="text-4xl font-serif font-bold italic">Surah Al-Kahf</h2>
              <p className="bg-[#1a2e2a]/10 px-4 py-1.5 rounded-full w-fit text-[10px] font-black uppercase">Juz 15 • Ayah 1</p>
            </div>
            <button className="mt-8 bg-[#1a2e2a] text-white w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em]">
              Resume Reading <Play size={12} className="inline ml-2" fill="currentColor" />
            </button>
          </motion.div>
        </div>

        {/* --- SURAH BROWSER (FULL RESPONSIVE) --- */}
        <div className="space-y-8 pt-10 border-t border-gray-100">
          <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
            <div className="relative group w-full max-w-md">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37]" size={20} />
              <input 
                type="text" 
                placeholder="Search Surah name or number..." 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-white border border-gray-100 rounded-3xl md:rounded-[2rem] outline-none focus:ring-8 focus:ring-[#D4AF37]/5 font-bold text-sm shadow-sm"
              />
            </div>
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
                // Responsive Grid: 1 col on mobile, 2 on medium+
                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
              >
                {activeTab === 'surah' && filteredSurahs.map((surah: any) => (
                  <motion.div 
                    key={surah.number} 
                    whileHover={{ scale: 1.02, x: 8 }}
                    onClick={() => router.push(`/quran/${surah.number}`)}
                    className="group bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-50 hover:border-[#D4AF37]/30 hover:shadow-xl transition-all cursor-pointer flex items-center justify-between relative overflow-hidden"
                  >
                    <div className="flex items-center gap-4 md:gap-6 relative z-10">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-[#fdfcf8] group-hover:bg-[#1a2e2a] group-hover:text-[#D4AF37] rounded-2xl flex items-center justify-center text-xs font-black transition-all">
                        {surah.number}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif font-black text-xl md:text-2xl text-[#1a2e2a] group-hover:text-[#D4AF37] transition-colors truncate">{surah.englishName}</h4>
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mt-1">
                          {surah.revelationType} • {surah.numberOfAyahs} Verses
                        </p>
                      </div>
                    </div>
                    <div className="text-3xl md:text-5xl font-serif font-bold text-[#1a2e2a]/5 group-hover:text-[#1a2e2a]/10 transition-all absolute -right-2 bottom-2 md:bottom-4" dir="rtl">
                      {surah.name.split(' ').pop()}
                    </div>
                  </motion.div>
                ))}

                {activeTab === 'para' && (
                  <div className="col-span-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 30 }, (_, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ scale: 1.05, backgroundColor: '#1a2e2a', color: '#D4AF37' }}
                        className="bg-white border border-gray-100 p-8 rounded-[2rem] text-center cursor-pointer transition-all shadow-sm"
                      >
                        <p className="text-[10px] font-black uppercase opacity-40">Juz</p>
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

      {/* --- SIDE LEGACY PANEL --- */}
      <AnimatePresence>
        {selectedHero && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedHero(null)}
              className="absolute inset-0 bg-[#1a2e2a]/80 backdrop-blur-md px-4"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl h-full bg-[#fdfcf8] shadow-2xl p-8 md:p-16 overflow-y-auto"
            >
              <button onClick={() => setSelectedHero(null)} className="absolute top-10 right-10 p-3 hover:bg-gray-100 rounded-full transition-all"><X size={24} /></button>
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="p-5 bg-[#1a2e2a] w-fit rounded-3xl text-[#D4AF37]">{selectedHero.icon}</div>
                  <h2 className="text-5xl md:text-6xl font-serif font-black italic text-[#1a2e2a] leading-tight">{selectedHero.name}</h2>
                  <p className="text-[#D4AF37] font-black text-xs uppercase tracking-[0.4em]">{selectedHero.title}</p>
                </div>
                <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 space-y-4 shadow-sm">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Core Contribution</h5>
                  <p className="text-xl font-serif italic font-bold text-[#1a2e2a]">{selectedHero.legacy}</p>
                </div>
                <div className="space-y-6">
                   <h5 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#D4AF37]"><Book size={14} /> Full Narrative</h5>
                   <p className="text-gray-600 leading-relaxed text-lg font-medium">{selectedHero.fullStory}</p>
                </div>
                <div className="p-10 bg-[#1a2e2a] rounded-[2.5rem] text-[#D4AF37] relative overflow-hidden">
                   <h5 className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Quranic Intersection</h5>
                   <p className="text-2xl font-serif italic font-bold">{selectedHero.quranConnect}</p>
                </div>
                <button 
                  onClick={() => router.push(`/chat?q=Tell me more about the legacy of ${selectedHero.name}`)}
                  className="w-full py-6 bg-[#D4AF37] text-[#1a2e2a] rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#1a2e2a] hover:text-[#D4AF37] transition-all"
                >
                  Explore Legacy via Sirat AI
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}