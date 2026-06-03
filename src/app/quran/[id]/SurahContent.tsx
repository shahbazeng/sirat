"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Play, Pause, Bookmark, X,
  Loader2, Sparkles, Volume2, BookOpen, 
  MessageSquare, Scroll, Lightbulb, Sun, Moon 
} from 'lucide-react';

// Name change to SurahContent for safety
export default function SurahContent() {
  const params = useParams();
  const id = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : "";
  
  const router = useRouter();
  const [surahData, setSurahData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [activeModal, setActiveModal] = useState<{type: string, ayahIndex: number, ayahKey: string} | null>(null);
  const [tafsirContent, setTafsirContent] = useState<string>("");
  const [loadingTafsir, setLoadingTafsir] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!id) return;
    async function fetchSurahDetail() {
      try {
        const res = await fetch(`https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,en.sahih,ur.jalandhry,ar.alafasy`);
        const data = await res.json();
        setSurahData(data.data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    fetchSurahDetail();
  }, [id]);

  // 2. Fetch Tafsir (FIXED: Strict TypeScript Compiler Bypass)
  useEffect(() => {
    if (activeModal && activeModal.type === 'Tafsir' && activeModal.ayahKey) {
      async function fetchTafsir() {
        setLoadingTafsir(true);
        try {
          // FIXED: Labeled with ! operator to completely satisfy TypeScript compiler safety
          const res = await fetch(`https://api.quran.com/api/v4/tafsirs/169/by_ayah/${activeModal!.ayahKey}`);
          const data = await res.json();
          setTafsirContent(data.tafsir.text || "No interpretation provided.");
        } catch (err) { 
          setTafsirContent("Failed to load tafsir."); 
        } finally { 
          setLoadingTafsir(false); 
        }
      }
      fetchTafsir();
    }
  }, [activeModal]);

  useEffect(() => {
    if (surahData && id) {
      const lastRead = { id: id, name: surahData[0].englishName, ayah: 1, timestamp: new Date().getTime() };
      localStorage.setItem("sirat_last_read", JSON.stringify(lastRead));
    }
  }, [id, surahData]);

  if (loading || !surahData) return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#0f1715]' : 'bg-[#fdfcf8]'}`}>
      <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
    </div>
  );

  const arabicVerses = surahData[0]?.ayahs || [];
  const englishVerses = surahData[1]?.ayahs || [];
  const urduVerses = surahData[2]?.ayahs || [];
  const audioVerses = surahData[3]?.ayahs || [];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-[#0f1715] text-white' : 'bg-[#fdfcf8] text-[#1a2e2a]'}`}>
      <nav className={`sticky top-0 z-40 border-b px-4 md:px-10 py-4 flex items-center justify-between shadow-sm transition-colors duration-500 ${isDarkMode ? 'bg-[#0f1715]/90 border-white/5 backdrop-blur-xl' : 'bg-white/95 border-gray-100 backdrop-blur-md'}`}>
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className={`p-2 rounded-full transition-all ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}><ArrowLeft size={20} /></button>
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-black italic">{surahData[0].englishName}</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">{surahData[0].revelationType} • {surahData[0].numberOfAyahs} Verses</p>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-3 rounded-2xl transition-all shadow-lg ${isDarkMode ? 'bg-white/5 text-[#D4AF37]' : 'bg-gray-50 text-gray-400'}`}>{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
          <button onClick={() => isPlaying ? audioRef.current?.pause() : audioRef.current?.play()} className="bg-[#1a2e2a] text-[#D4AF37] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 transition-all active:scale-95">{isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />} {isPlaying ? "Pause" : "Play Surah"}</button>
        </div>
      </nav>

      <div className="w-full px-4 md:px-12 pt-10 pb-20">
        <div className="max-w-[1400px] mx-auto space-y-10">
          {arabicVerses.map((ayah: any, index: number) => {
            const ayahKey = `${id}:${index + 1}`;
            return (
              <motion.div key={ayah.number} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`w-full rounded-[2.5rem] md:rounded-[3.5rem] border transition-all p-5 md:p-12 ${isDarkMode ? 'bg-[#15201d] border-white/5 shadow-2xl' : 'bg-white border-gray-50 shadow-sm'}`}>
                <div className="flex justify-between items-center mb-8">
                  <span className="px-5 py-1.5 rounded-xl bg-[#1a2e2a] text-[10px] font-black text-[#D4AF37] tracking-[0.2em] border border-[#D4AF37]/20">{ayahKey}</span>
                  <div className="flex gap-2">
                    <button className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-500 hover:text-[#D4AF37]' : 'bg-gray-50 text-gray-300 hover:text-[#D4AF37]'}`}><Bookmark size={18} /></button>
                    <button onClick={() => { if(audioRef.current && audioVerses[index]) { audioRef.current.src = audioVerses[index].audio; audioRef.current.play(); setIsPlaying(true); } }} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-[#D4AF37]' : 'bg-gray-50 text-[#1a2e2a]'}`}><Volume2 size={18} /></button>
                  </div>
                </div>
                <div className="mb-10"><p className={`text-3xl md:text-6xl font-serif text-right leading-[2] ${isDarkMode ? 'text-white' : 'text-[#1a2e2a]'}`} dir="rtl">{ayah.text}</p></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                  <div className={`p-6 rounded-[2rem] border-r-4 border-[#D4AF37] ${isDarkMode ? 'bg-[#0f1715]/50' : 'bg-[#fcfaf2]'}`}><p className={`text-xl md:text-2xl font-serif text-right leading-relaxed ${isDarkMode ? 'text-white/90' : 'text-[#1a2e2a]'}`} dir="rtl">{urduVerses[index]?.text || ""}</p></div>
                  <div className="p-4 flex items-center"><p className={`text-base md:text-lg leading-relaxed font-medium italic ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{englishVerses[index]?.text || ""}</p></div>
                </div>
                <div className={`pt-6 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                  <div className="flex flex-wrap gap-2 justify-start">
                    <InsightButton isDark={isDarkMode} onClick={() => setActiveModal({type: 'Tafsir', ayahIndex: index, ayahKey})} icon={<BookOpen size={14}/>} label="Tafsir" />
                    <InsightButton isDark={isDarkMode} onClick={() => setActiveModal({type: 'Lessons', ayahIndex: index, ayahKey})} icon={<Lightbulb size={14}/>} label="Lessons" />
                    <InsightButton isDark={isDarkMode} onClick={() => setActiveModal({type: 'Hadith', ayahIndex: index, ayahKey})} icon={<Scroll size={14}/>} label="Hadith" />
                    <InsightButton isDark={isDarkMode} onClick={() => setActiveModal({type: 'AI Help', ayahIndex: index, ayahKey})} icon={<MessageSquare size={14}/>} label="AI Help" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className={`relative w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[80vh] flex flex-col ${isDarkMode ? 'bg-[#15201d] text-white border border-white/10' : 'bg-[#fdfcf8] text-[#1a2e2a]'}`}>
              <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'bg-[#1a2e2a]/50 border-white/5' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <div className="bg-[#D4AF37]/10 p-2 rounded-xl text-[#D4AF37]"><Sparkles size={18}/></div>
                  <h2 className="text-xl font-serif font-black italic">{activeModal.type} — Ayah {activeModal.ayahKey}</h2>
                </div>
                <button onClick={() => setActiveModal(null)} className={`p-2.5 rounded-full transition-all ${isDarkMode ? 'bg-white/5 hover:bg-red-500/20' : 'bg-gray-100 hover:bg-red-50'}`}><X size={18}/></button>
              </div>
              <div className="p-8 overflow-y-auto custom-scrollbar">
                {loadingTafsir ? <div className="py-12 text-center"><Loader2 className="animate-spin mx-auto text-[#D4AF37]" size={32} /></div> : <div className={`prose prose-stone max-w-none text-base md:text-lg leading-relaxed ${isDarkMode ? 'prose-invert text-gray-300' : 'text-gray-600'}`} dangerouslySetInnerHTML={{ __html: tafsirContent || "Insight content will be available soon." }} />}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={() => setIsPlaying(false)} />
    </div>
  );
}

function InsightButton({ icon, label, onClick, isDark }: { icon: React.ReactNode, label: string, onClick: () => void, isDark: boolean }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2.5 py-3 px-5 rounded-xl transition-all group border border-transparent shadow-sm active:scale-95 text-xs font-black uppercase tracking-wider ${isDark ? 'bg-white/5 text-white hover:bg-[#1a2e2a]' : 'bg-gray-50 text-[#1a2e2a] hover:bg-[#1a2e2a] hover:text-white'}`}>
      <span className="text-[#D4AF37] group-hover:text-white transition-colors">{icon}</span>
      <span>{label}</span>
    </button>
  );
}