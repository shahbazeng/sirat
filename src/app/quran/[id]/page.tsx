"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Play, Pause, Bookmark, Share2, X,
  Settings, Loader2, Sparkles, Volume2, BookOpen, 
  Heart, MessageSquare, Scroll, Lightbulb, Sun, Moon 
} from 'lucide-react';

export default function SurahReadingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [surahData, setSurahData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Modal & Tafsir States
  const [activeModal, setActiveModal] = useState<{type: string, ayahIndex: number, ayahKey: string} | null>(null);
  const [tafsirContent, setTafsirContent] = useState<string>("");
  const [loadingTafsir, setLoadingTafsir] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. Fetch Surah Detail
  useEffect(() => {
    async function fetchSurahDetail() {
      try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,en.sahih,ur.jalandhry,ar.alafasy`);
        const data = await res.json();
        setSurahData(data.data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    fetchSurahDetail();
  }, [id]);

  // 2. Fetch Tafsir (FIXED TYPE ERROR HERE)
  useEffect(() => {
    // Adding explicit check for activeModal to satisfy TypeScript
    if (activeModal && activeModal.type === 'Tafsir' && activeModal.ayahKey) {
      async function fetchTafsir() {
        setLoadingTafsir(true);
        try {
          const res = await fetch(`https://api.quran.com/api/v4/tafsirs/169/by_ayah/${activeModal?.ayahKey}`);
          const data = await res.json();
          setTafsirContent(data.tafsir.text);
        } catch (err) { 
          setTafsirContent("Failed to load tafsir."); 
        } finally { 
          setLoadingTafsir(false); 
        }
      }
      fetchTafsir();
    }
  }, [activeModal]);

  // 3. Save History
  useEffect(() => {
    if (surahData) {
      const lastRead = {
        id: id,
        name: surahData[0].englishName,
        ayah: 1,
        timestamp: new Date().getTime()
      };
      localStorage.setItem("sirat_last_read", JSON.stringify(lastRead));
    }
  }, [id, surahData]);

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#0f1715]' : 'bg-[#fdfcf8]'}`}>
      <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
    </div>
  );

  const arabicVerses = surahData[0].ayahs;
  const englishVerses = surahData[1].ayahs;
  const urduVerses = surahData[2].ayahs;
  const audioVerses = surahData[3].ayahs;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-[#0f1715] text-white' : 'bg-[#fdfcf8] text-[#1a2e2a]'}`}>
      
      {/* --- STICKY HEADER --- */}
      <nav className={`sticky top-0 z-40 border-b px-4 md:px-10 py-4 flex items-center justify-between shadow-sm transition-colors duration-500 ${isDarkMode ? 'bg-[#0f1715]/90 border-white/5 backdrop-blur-xl' : 'bg-white/95 border-gray-100 backdrop-blur-md'}`}>
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className={`p-2 rounded-full transition-all ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-black italic">{surahData[0].englishName}</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">{surahData[0].revelationType} • {surahData[0].numberOfAyahs} Verses</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-6">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-3 rounded-2xl transition-all shadow-lg ${isDarkMode ? 'bg-white/5 text-[#D4AF37]' : 'bg-gray-50 text-gray-400'}`}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()} className="bg-[#1a2e2a] text-[#D4AF37] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 transition-all active:scale-95">
            {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />} {isPlaying ? "Pause" : "Play Surah"}
          </button>
        </div>
      </nav>

      {/* --- FULL WIDTH CONTAINER --- */}
      <div className="w-full px-4 md:px-12 pt-10 pb-20">
        <div className="max-w-[1400px] mx-auto space-y-10">
          {arabicVerses.map((ayah: any, index: number) => {
            const ayahKey = `${id}:${index + 1}`;
            return (
              <motion.div 
                key={ayah.number} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                className={`w-full rounded-[3.5rem] border transition-all p-6 md:p-12 ${isDarkMode ? 'bg-[#15201d] border-white/5 shadow-2xl' : 'bg-white border-gray-50 shadow-sm'}`}
              >
                {/* 1. Ayat Header */}
                <div className="flex justify-between items-center mb-10">
                  <span className="px-6 py-2 rounded-2xl bg-[#1a2e2a] text-[11px] font-black text-[#D4AF37] tracking-[0.2em] border border-[#D4AF37]/20">{ayahKey}</span>
                  <div className="flex gap-3">
                    <button className={`p-3 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-500 hover:text-[#D4AF37]' : 'bg-gray-50 text-gray-300 hover:text-[#D4AF37]'}`}><Bookmark size={20} /></button>
                    <button onClick={() => { if(audioRef.current) { audioRef.current.src = audioVerses[index].audio; audioRef.current.play(); setIsPlaying(true); } }} className={`p-3 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-[#D4AF37]' : 'bg-gray-50 text-[#1a2e2a]'}`}><Volume2 size={20} /></button>
                  </div>
                </div>

                {/* 2. Arabic Text (Centered View) */}
                <div className="mb-14">
                  <p className={`text-4xl md:text-7xl font-serif text-right leading-[1.8] ${isDarkMode ? 'text-white' : 'text-[#1a2e2a]'}`} dir="rtl">
                    {ayah.text}
                  </p>
                </div>

                {/* 3. Translations Row */}
                <div className="grid lg:grid-cols-2 gap-8 mb-14">
                  <div className={`p-8 rounded-[2.5rem] border-r-8 border-[#D4AF37] ${isDarkMode ? 'bg-[#0f1715]/50' : 'bg-[#fcfaf2]'}`}>
                    <p className={`text-2xl md:text-3xl font-serif text-right leading-relaxed ${isDarkMode ? 'text-white/90' : 'text-[#1a2e2a]'}`} dir="rtl">
                      {urduVerses[index].text}
                    </p>
                  </div>
                  <div className="p-8 flex items-center">
                    <p className={`text-xl leading-relaxed font-medium italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {englishVerses[index].text}
                    </p>
                  </div>
                </div>

                {/* 4. Knowledge Hub (Bottom Full Width) */}
                <div className={`pt-8 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <div className="flex flex-wrap gap-3 justify-center">
                      <InsightButton isDark={isDarkMode} onClick={() => setActiveModal({type: 'Tafsir', ayahIndex: index, ayahKey})} icon={<BookOpen size={16}/>} label="Tafsir" />
                      <InsightButton isDark={isDarkMode} onClick={() => setActiveModal({type: 'Lessons', ayahIndex: index, ayahKey})} icon={<Lightbulb size={16}/>} label="Lessons" />
                      <InsightButton isDark={isDarkMode} onClick={() => setActiveModal({type: 'Hadith', ayahIndex: index, ayahKey})} icon={<Scroll size={16}/>} label="Hadith" />
                      <InsightButton isDark={isDarkMode} onClick={() => setActiveModal({type: 'AI Help', ayahIndex: index, ayahKey})} icon={<MessageSquare size={16}/>} label="AI Help" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* --- MODAL SYSTEM --- */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`relative w-full max-w-6xl rounded-[3.5rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col ${isDarkMode ? 'bg-[#15201d] text-white border border-white/10' : 'bg-[#fdfcf8] text-[#1a2e2a]'}`}>
              <div className={`p-8 border-b flex justify-between items-center ${isDarkMode ? 'bg-[#1a2e2a]/50 border-white/5' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center gap-4">
                  <div className="bg-[#D4AF37]/10 p-2 rounded-xl text-[#D4AF37]"><Sparkles size={20}/></div>
                  <h2 className="text-2xl font-serif font-black italic">{activeModal.type} — Ayah {activeModal.ayahKey}</h2>
                </div>
                <button onClick={() => setActiveModal(null)} className={`p-3 rounded-full transition-all ${isDarkMode ? 'bg-white/5 hover:bg-red-500/20' : 'bg-gray-100 hover:bg-red-50'}`}><X size={20}/></button>
              </div>
              <div className="p-10 overflow-y-auto custom-scrollbar">
                {loadingTafsir ? <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-[#D4AF37]" size={40} /></div> : <div className={`prose prose-stone max-w-none text-2xl leading-[2] ${isDarkMode ? 'prose-invert text-gray-300' : 'text-gray-600'}`} dangerouslySetInnerHTML={{ __html: tafsirContent || "Insight content will be available soon." }} />}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </div>
  );
}

function InsightButton({ icon, label, onClick, isDark }: { icon: React.ReactNode, label: string, onClick: () => void, isDark: boolean }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 py-4 px-6 rounded-2xl transition-all group border border-transparent shadow-sm active:scale-95 ${isDark ? 'bg-white/5 text-white hover:bg-[#1a2e2a]' : 'bg-gray-50 text-[#1a2e2a] hover:bg-[#1a2e2a] hover:text-white'}`}>
      <span className="text-[#D4AF37] group-hover:text-white transition-colors">{icon}</span>
      <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}