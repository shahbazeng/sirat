"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  BookOpen, 
  MessageSquare, 
  Scroll, 
  Lightbulb, 
  Sun, 
  Moon, 
  Repeat, 
  Book, 
  Headphones, 
  X, 
  SkipForward, 
  Type, 
  Languages, 
  EyeOff, 
  SkipBack, 
  Bookmark, 
  Share2

} from 'lucide-react';
// Ye file ke end mein ho
const KnowledgeModal = ({ modal, setModal }: any) => {
  if (!modal) return null; // Agar modal null hai to kuch render na kare
  
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModal(null)} />
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative bg-white p-8 rounded-[2rem] w-full max-w-lg shadow-2xl">
        <h3 className="text-lg font-black mb-4 uppercase text-emerald-900">{modal.title}</h3>
        <p className="text-gray-600 leading-relaxed">{modal.content}</p>
        <button onClick={() => setModal(null)} className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-2xl font-bold">Close</button>
      </motion.div>
    </div>
  );
};
export default function SurahContent() {
  const params = useParams();
  const id = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : "";
  const router = useRouter();
  
// State declaration block mein ye line add/check karein:
const [qariList, setQariList] = useState<{ identifier: string; englishName: string }[]>([]);
  // States
  const [fontSize, setFontSize] = useState(24); // <--- ERROR FIX: State yahan declare ki hai
  const [activeMode, setActiveMode] = useState<'read' | 'recite'>('read');
  const [surahData, setSurahData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);








// 1. Modal State (Aapke code mein pehle se hogi, bas verify kar lein)
const [knowledgeModal, setKnowledgeModal] = useState<{ title: string; content: string } | null>(null);

// 2. Modal open karne ka function
// Yeh function aapke buttons se dynamic content uthaye ga
const handleOpenModal = (title: string, content: string) => {
  setKnowledgeModal({ title, content });
};



  // 1. New State for features
const [selectedAyah, setSelectedAyah] = useState<number | null>(null);
const [showTranslation, setShowTranslation] = useState(true);
  const [activeModal, setActiveModal] = useState<{type: string, ayahIndex: number, ayahKey: string} | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
const [selectedQari, setSelectedQari] = useState('ar.alafasy'); // Default
const [playbackRate, setPlaybackRate] = useState(1);
// 1. Updated Play/Pause Logic (Robust)
const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src) playAyah(currentAyahIndex);
      else audioRef.current.play();
      setIsPlaying(true);
    }
  };

// 1. New State
const [activeWordIndex, setActiveWordIndex] = useState(0);

const navigateSurah = (direction: number) => {
  const currentId = parseInt(id);
  const newId = currentId + direction;
  if (newId > 0 && newId <= 114) {
    router.push(`/quran/${newId}`);
  }
}; 














useEffect(() => {
  // AlQuran API se audio edition fetch karein
  fetch('https://api.alquran.cloud/v1/edition?format=audio&type=versebyverse')
    .then(res => res.json())
    .then(data => {
      // Yahan filter karein takay sirf wahi qari aayein jinka audio available ho
      setQariList(data.data.slice(0, 20));
    })
    .catch(console.error);
}, []);


useEffect(() => {
  const audio = audioRef.current;
  if (!audio || !isPlaying) return;

  const updateHighlight = () => {
    // Har word ko 0.8 seconds ka average time dete hain (Qari ki speed ke hisab se)
    const newIndex = Math.floor(audio.currentTime / 0.8);
    setActiveWordIndex(newIndex);
  };

  audio.addEventListener('timeupdate', updateHighlight);
  return () => audio.removeEventListener('timeupdate', updateHighlight);
}, [isPlaying, currentAyahIndex]);




  useEffect(() => {
    if (!id) return;
    async function fetchSurahDetail() {
      setLoading(true);
      try {
        const url = `https://api.alquran.cloud/v1/surah/${id}/editions/quran-uthmani,en.sahih,ur.jalandhry,${selectedQari}`;
        const res = await fetch(url);
        const data = await res.json();
        setSurahData(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSurahDetail();
  }, [id, selectedQari]);

 
    const playAyah = useCallback(async (index: number) => {
    if (!audioRef.current || !surahData) return;
    const ayahs = surahData[3].ayahs;
    if (index < 0 || index >= ayahs.length) return;

    try {
      audioRef.current.pause();
      setCurrentAyahIndex(index);
      audioRef.current.src = ayahs[index].audio;
      audioRef.current.load();
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Audio Load Error:", err);
      setIsPlaying(false);
    }
  }, [surahData]);
 // Loading Screen
  if (loading || !surahData) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const arabic = surahData[0].ayahs;
  const english = surahData[1].ayahs;
  const urdu = surahData[2].ayahs;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-[#0f1715] text-white' : 'bg-[#fdfcf8] text-[#1a2e2a]'}`}>
      
      {/* Header */}
     <nav className={`sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b backdrop-blur-2xl transition-all duration-300 ${

  isDarkMode 

    ? 'bg-[#0f1715]/90 border-white/10 text-white' 

    : 'bg-white/90 border-gray-100 text-gray-900'

}`}>

  

  {/* Left: Action Bar */}

  <div className="flex items-center gap-2">

    <button onClick={() => router.back()} className="p-3 hover:bg-emerald-500/10 rounded-2xl transition-all active:scale-95 text-emerald-600">

      <ArrowLeft size={22} strokeWidth={2.5} />

    </button>

    <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-3 hover:bg-emerald-500/10 rounded-2xl transition-all active:scale-95 text-emerald-600">

      {isDarkMode ? <Sun size={22} strokeWidth={2.5}/> : <Moon size={22} strokeWidth={2.5}/>}

    </button>

  </div>



  {/* Center: Surah Navigation - Fixed Centering */}

  <div className="flex items-center gap-4 bg-emerald-500/5 px-6 py-2 rounded-2xl border border-emerald-500/10">

    <button 

      onClick={() => navigateSurah(-1)} 

      disabled={parseInt(id) <= 1}

      className="p-2 text-emerald-600 hover:bg-emerald-500/10 rounded-full disabled:opacity-20 transition-all active:scale-90"

    >

      <SkipBack size={20} strokeWidth={3} />

    </button>

    

    {/* Fixed Text Block */}

    <div className="flex flex-col items-center justify-center min-w-[120px]">

      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500 leading-none">Surah</span>

      <span className="text-sm font-bold text-gray-900 truncate mt-0.5 leading-none">

        {surahData?.number}. {surahData?.englishName}

      </span>

    </div>

    

    <button 

      onClick={() => navigateSurah(1)} 

      disabled={parseInt(id) >= 114}

      className="p-2 text-emerald-600 hover:bg-emerald-500/10 rounded-full disabled:opacity-20 transition-all active:scale-90"

    >

      <SkipForward size={20} strokeWidth={3} />

    </button>

  </div>



  {/* Right: Mode Switcher */}

  <div className="flex bg-gray-100/80 p-1.5 rounded-2xl">

    <button 

      onClick={() => setActiveMode('read')} 

      className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${

        activeMode === 'read' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-400 hover:text-emerald-600'

      }`}

    >

      <Book size={16} strokeWidth={2.5}/> Read

    </button>

    <button 

      onClick={() => setActiveMode('recite')} 

      className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${

        activeMode === 'recite' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-400 hover:text-emerald-600'

      }`}

    >

      <Headphones size={16} strokeWidth={2.5}/> Recite

    </button>

  </div>

</nav>
      {/* Main Container */}
      <div className="max-w-5xl mx-auto p-6 md:p-12 pb-40">
        
        
        {activeMode === 'read' && (
  <div className="animate-in fade-in duration-700 w-full max-w-6xl mx-auto px-4 md:px-8">
    
    {/* Control Bar */}
    <div className="sticky top-24 z-30 flex items-center justify-between bg-white/70 backdrop-blur-3xl p-4 rounded-3xl border border-black/5 shadow-2xl mb-12">
      <div className="flex gap-4">
        <button onClick={() => setFontSize(f => Math.min(f + 6, 60))} className="p-3 hover:bg-emerald-100 rounded-xl text-gray-700 transition">A+</button>
        <button onClick={() => setFontSize(f => Math.max(f - 6, 24))} className="p-3 hover:bg-emerald-100 text-gray-700 rounded-xl transition">A-</button>
      </div>
      <button 
        onClick={() => setShowTranslation(!showTranslation)}
        className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition ${showTranslation ? 'bg-emerald-900 text-white' : 'bg-gray-100 text-gray-500'}`}
      >
        {showTranslation ? 'Translation Active' : 'Translation Hidden'}
      </button>
    </div>

    {/* Mushaf Grid */}
    <div className="grid grid-cols-1 gap-8">
      {arabic.map((ayah: any, i: number) => (
        <motion.div 
          key={i} 
          className={`p-10 md:p-14 rounded-[2.5rem] transition-all duration-500 border border-transparent ${selectedAyah === i ? 'bg-white shadow-xl ring-2 ring-emerald-500/20' : 'bg-white hover:shadow-lg'}`}
          onClick={() => setSelectedAyah(i)}
        >
          {/* Header Actions */}
<div className="flex justify-between items-start mb-8">
  <span className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 font-black text-sm">
    {i + 1}
  </span>
  
  <div className="flex flex-wrap gap-2 justify-end">
    {/* 1. Play Button */}
    <button onClick={() => playAyah(i)} className="p-3 hover:bg-emerald-100 rounded-full text-emerald-600 transition">
      <Play size={20} fill="currentColor" />
    </button>

    {/* 2. Share/Copy Button (Safe Logic) */}
    <button 
      onClick={async () => {
  const textToShare = `${ayah.text}\n\nUrdu: ${urdu[i].text}\n(Surah ${surahData.number}, Ayah ${i + 1})`;
  
  // 1. Mobile Share (Best Experience)
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Quran Ayah', text: textToShare });
      return; // Agar share ho gaya, to function khatam
    } catch (err) {
      console.log("Share cancelled by user");
    }
  }

  // 2. Clipboard API (Agar support hai)
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(textToShare);
      alert("Copied to clipboard!");
      return;
    } catch (err) {
      console.error("Clipboard API failed");
    }
  }

  // 3. Last Resort: Temporary Textarea (Ye har browser mein kaam karega)
  const textArea = document.createElement("textarea");
  textArea.value = textToShare;
  // CSS ko hide kar dein taake UI na hiley
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      alert("Copied to clipboard!");
    } else {
      alert("Failed to copy. Please try selecting text manually.");
    }
  } catch (err) {
    alert("Unable to copy in this browser.");
  }
  document.body.removeChild(textArea);
}} 
      className="p-3 hover:bg-emerald-100 rounded-full text-gray-400 transition"
    >
      <BookOpen size={20} />
    </button>

    {/* 3. Tafsir Icon */}
    <button 
  onClick={() => setKnowledgeModal({ 
    title: 'Tafsir', 
    content: english[i]?.text // Yahan aap API ka tafsir content dal sakte hain
  })} 
  className="p-3 hover:bg-amber-100 rounded-full text-amber-600 transition"
>
  <Scroll size={20} />
</button>
    
    {/* 4. Lessons Icon */}
    <button 
  onClick={() => setKnowledgeModal({ 
    title: 'Lessons', 
    content: "Is Ayah se humein ye sabaq milta hai ke..." // Static ya dynamic lesson
  })} 
  className="p-3 hover:bg-emerald-100 rounded-full text-emerald-700 transition"
>
  <Lightbulb size={20} />
</button>
    
    {/* 5. Hadith Icon */}
    <button onClick={() => setKnowledgeModal({ title: 'Relevant Hadith', content: "Hadith details..." })} className="p-3 hover:bg-blue-100 rounded-full text-blue-600 transition">
      <Bookmark size={20} />
    </button>
    
    {/* 6. Q&A Icon */}
    <button onClick={() => setKnowledgeModal({ title: 'Q&A / Fiqh', content: "Scholarly answers..." })} className="p-3 hover:bg-purple-100 rounded-full text-purple-600 transition">
      <MessageSquare size={20} />
    </button>
  </div>
</div>

          {/* Arabic Text */}
          <p className="font-serif leading-[3] text-right text-[#1a2e2a] select-none mb-10" style={{ fontSize: `${fontSize}px` }}>
            {ayah.text}
          </p>

          {/* Translation & Tafseer/Mafhoom */}
          <AnimatePresence>
            {showTranslation && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-8 border-t border-gray-100 space-y-6">
                <div>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Tarjuma (Urdu)</p>
                  <p className="text-2xl text-emerald-950 font-serif leading-relaxed">{urdu[i]?.text}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Mafhoom (English)</p>
                  <p className="text-base text-gray-600 font-sans leading-relaxed">{english[i]?.text}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
    <div className="h-40" />
  </div>
)}
       {activeMode === 'recite' && (
  <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
    <div className="mb-12">
      <select 
        value={selectedQari} 
        onChange={(e) => { setSelectedQari(e.target.value); setIsPlaying(false); }}
        className="bg-white border border-emerald-100 px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg"
      >
        {qariList.map((q) => <option key={q.identifier} value={q.identifier}>{q.englishName}</option>)}
      </select>
    </div>

    <motion.div 
      className="w-full max-w-3xl bg-white p-8 md:p-16 rounded-[2.5rem] shadow-2xl border-2 border-amber-400/10 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
    <p className="text-3xl md:text-5xl font-serif leading-[3] text-right text-[#1a2e2a]" dir="rtl">
  {surahData[0].ayahs[currentAyahIndex].text.split(" ").map((word: string, idx: number) => {
    const isFocused = idx === activeWordIndex;
    
    return (
      // Animation ko thora "soft" banayein
<motion.span 
  key={idx}
  animate={{ 
    color: isFocused ? "#D4AF37" : "#1a2e2a",
    scale: isFocused ? 1.05 : 1,
  }}
  // Duration barha di hai taake transition slow aur natural ho
  transition={{ duration: 0.5, ease: "easeInOut" }} 
  className="inline-block mx-1.5"
>
  {word}
</motion.span>
    );
  })}
</p>
    </motion.div>

    <div className="flex items-center gap-6 mt-12">
      <button onClick={() => playAyah(Math.max(0, currentAyahIndex - 1))} className="p-4 bg-gray-100 rounded-full hover:bg-gray-200"><SkipBack size={24}/></button>
      <button onClick={togglePlay} className="bg-[#1a2e2a] text-[#D4AF37] p-8 rounded-full shadow-xl hover:scale-105 transition-all">
        {isPlaying ? <Pause size={32}/> : <Play size={32} className="ml-1"/>}
      </button>
      <button onClick={() => playAyah(Math.min(arabic.length - 1, currentAyahIndex + 1))} className="p-4 bg-gray-100 rounded-full hover:bg-gray-200"><SkipForward size={24}/></button>
    </div>
  </div>
)}
      </div>
{/* Audio Player Fixed Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#1a2e2a]/95 text-white flex items-center px-6 z-50">
        <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
           <p className="font-bold">Ayah {currentAyahIndex + 1}</p>
           <div className="flex gap-4">
              <button onClick={() => playAyah(Math.max(0, currentAyahIndex - 1))}><SkipForward className="rotate-180"/></button>
              <button onClick={togglePlay} className="bg-[#D4AF37] p-3 rounded-full text-black">{isPlaying ? <Pause size={20}/> : <Play size={20}/>}</button>
              <button onClick={() => playAyah(Math.min(arabic.length - 1, currentAyahIndex + 1))}><SkipForward/></button>
           </div>
        </div>
      </div>
      <audio 
  ref={audioRef}
  onTimeUpdate={(e) => {
    if (isPlaying && surahData) {
      const audio = e.currentTarget;
      const text = arabic[currentAyahIndex].text;
      const words = text.split(" ");
      
      // FIX: Tilawat ki speed ke mutabiq sync ko adjust karein
      // 0.85 ko 0.70 kar diya hai taake animation slow ho aur audio se match kare
      const progress = (audio.currentTime / (audio.duration || 1));
      
      // Thora sa 'Buffer' add kiya hai taake words jump na karein
      const wordIndex = Math.min(
        Math.floor(progress * words.length * 0.75), 
        words.length - 1
      );
      
      setActiveWordIndex(wordIndex);
    }
  }}
  onEnded={() => {
    setActiveWordIndex(0);
    if (currentAyahIndex < arabic.length - 1) {
      playAyah(currentAyahIndex + 1);
    } else {
      const nextSurah = parseInt(id) + 1;
      if (nextSurah <= 114) {
        router.push(`/quran/${nextSurah}`);
      }
    }
  }}
/>
    </div>
  );
}