"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scroll, Search, Play, Clock, LayoutGrid, List, Bookmark, 
  Sparkles, Loader2, Heart, ShieldCheck, CheckCircle, ChevronRight, Home, User, Copy, Volume2
} from 'lucide-react';

interface HadithBook {
  id: string;
  name: string;
  arabicName: string;
  count: string;
  author: string;
}

export default function HadithPage() {
  const router = useRouter();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // --- DYNAMIC HADITH OF THE DAY ---
  const hadithOfTheDay = {
    text: "«إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى»",
    translation: "Actions are but by intentions, and every person shall have what he intended.",
    reference: "Sahih al-Bukhari [1]",
    narrator: "Narrated by Umar bin Al-Khattab (R.A)"
  };

  // --- SIHAH-E-SITTAH BOOKS INDEX ---
  const hadithBooks: HadithBook[] = [
    { id: "bukhari", name: "Sahih al-Bukhari", arabicName: "صحيح البخاري", count: "7,563 Hadiths", author: "Imam Al-Bukhari" },
    { id: "muslim", name: "Sahih Muslim", arabicName: "صحيح مسلم", count: "7,500 Hadiths", author: "Imam Muslim" },
    { id: "tirmidhi", name: "Jami` at-Tirmidhi", arabicName: "جامع الترمذي", count: "3,956 Hadiths", author: "Imam At-Tirmidhi" },
    { id: "abudawood", name: "Sunan Abi Dawud", arabicName: "سنن أبي داود", count: "5,274 Hadiths", author: "Imam Abu Dawud" },
    { id: "nasai", name: "Sunan an-Nasa'i", arabicName: "سنن النسائي", count: "5,758 Hadiths", author: "Imam An-Nasa'i" },
    { id: "ibnmajah", name: "Sunan Ibn Majah", arabicName: "سنن ابن ماجه", count: "4,341 Hadiths", author: "Imam Ibn Majah" }
  ];

  const categories = [
    { id: 'all', label: 'All Hadith Books' },
    { id: 'sahih', label: 'Sahih Only' },
    { id: 'daily', label: 'Sunnah Ethics' }
  ];

  const filteredBooks = hadithBooks.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Hadith text copy ho gaya!");
  };

  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] font-sans selection:bg-[#D4AF37] selection:text-white pb-20 overflow-x-hidden">
      
      {/* ================= STICKY NAVIGATION BAR (MATCHES QURAN & LANDING) ================= */}
      <nav className="bg-[#1a2e2a]/95 backdrop-blur-md text-white px-4 md:px-12 py-5 flex items-center justify-between sticky top-0 z-[100] border-b border-white/5 shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3">
          <motion.div 
            initial={{ x: -20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-2 group cursor-pointer" 
            onClick={() => router.push('/')}
          >
            <div className="bg-[#D4AF37] p-1.5 md:p-2 rounded-xl">
              <Sparkles size={18} className="text-[#1a2e2a]" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic">
              Sirat<span className="text-[#D4AF37]">.ai</span>
            </span>
          </motion.div>
        </div>
        
        <div className="hidden lg:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.3em] opacity-70">
          <a href="/quran" className="hover:text-[#D4AF37] transition-all">Al-Quran</a>
          <a href="/hadith" className="text-[#D4AF37] hover:text-[#D4AF37] transition-all">Hadith</a>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => router.push('/chat')} 
            className="flex items-center gap-2 px-3 md:px-5 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-xs font-bold uppercase transition-all"
          >
            <Home size={14} className="text-[#D4AF37]" />
            <span className="text-[10px] tracking-widest hidden sm:inline">Bot Workspace</span>
          </button>

          <button 
            onClick={() => router.push('/dashboard')} 
            className="flex items-center gap-2 px-3 md:px-5 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-xs font-bold uppercase transition-all"
          >
            <User size={14} className="text-[#D4AF37]" />
            <span className="text-[10px] tracking-widest hidden sm:inline">My Dashboard</span>
          </button>
        </div>
      </nav>

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <div className="max-w-6xl mx-auto px-4 mt-10 space-y-12 md:space-y-16">
        
        {/* --- DYNAMIC HADITH HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#D4AF37] font-black text-[10px] uppercase tracking-[0.4em]">
              <Sparkles size={14} /> Prophetic Traditions
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-black italic text-[#1a2e2a]">
              The Prophetic <span className="text-[#D4AF37]">Hadith</span>
            </h1>
            <p className="text-gray-400 text-xs md:text-sm font-medium">Explore Verified, Authentic Reference Text Pools from Sihah-e-Sittah</p>
          </div>
          <div className="flex bg-[#1a2e2a] p-4 rounded-3xl shadow-xl border-b-4 border-[#D4AF37] text-white flex-col items-center shrink-0">
             <Scroll className="text-[#D4AF37]" size={28} />
          </div>
        </header>

        {/* --- HADITH OF THE DAY (PREMIUM BANNER) --- */}
        <section className="bg-[#1a2e2a] rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border-b-8 border-[#D4AF37]">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')] opacity-5 pointer-events-none" />
          <div className="relative z-10 space-y-6 max-w-4xl">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full w-fit text-[9px] font-black uppercase tracking-widest text-[#D4AF37]">
              <CheckCircle size={12} /> Hadith of the Day
            </div>
            
            <p className="text-right text-2xl md:text-4xl font-serif text-[#D4AF37] leading-relaxed tracking-wide pb-4 border-b border-white/10" dir="rtl">
              {hadithOfTheDay.text}
            </p>

            <div className="space-y-2">
              <p className="text-white/40 text-xs md:text-sm font-bold font-mono">{hadithOfTheDay.narrator}</p>
              <p className="text-lg md:text-xl font-serif italic text-white/90 leading-relaxed">
                "{hadithOfTheDay.translation}"
              </p>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4 pt-4">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#D4AF37] bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                Ref: {hadithOfTheDay.reference}
              </span>
              <div className="flex gap-2">
                <button onClick={() => copyToClipboard(`${hadithOfTheDay.translation} — ${hadithOfTheDay.reference}`)} className="p-3 bg-white/5 hover:bg-[#D4AF37] hover:text-[#1a2e2a] rounded-xl transition-all border border-white/10 text-white/80">
                  <Copy size={14} />
                </button>
                <button onClick={() => speak(hadithOfTheDay.translation)} className={`p-3 rounded-xl transition-all border border-white/10 ${isSpeaking ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/5 hover:bg-[#D4AF37] hover:text-[#1a2e2a] text-white/80'}`}>
                  <Volume2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- BOOK BROWSER CONTROLS --- */}
        <div className="space-y-8 pt-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            
            {/* Input Vector Bar */}
            <div className="relative group w-full max-w-md">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37]" size={20} />
              <input 
                type="text" 
                placeholder="Search Hadith book or author..." 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-white border border-gray-100 rounded-3xl md:rounded-[2rem] outline-none focus:ring-8 focus:ring-[#D4AF37]/5 font-bold text-sm shadow-sm transition-all"
              />
            </div>

            {/* Navigation Filter Tabs */}
            <div className="flex gap-2 p-1.5 bg-gray-100/50 rounded-[2rem] overflow-x-auto no-scrollbar max-w-full">
              {categories.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'daily') {
                      router.push('/chat?q=Give me list of authentic Sunnah ethics and daily habits with reference.');
                    }
                  }}
                  className={`flex items-center gap-2 px-6 md:px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === tab.id ? 'bg-[#1a2e2a] text-[#D4AF37] shadow-xl' : 'text-gray-400 hover:text-[#1a2e2a]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ================= GRID LIST OF HADITH BOOKS ================= */}
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="animate-spin text-[#D4AF37]" size={50} />
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredBooks.map((book) => (
                  <motion.div 
                    key={book.id} 
                    whileHover={{ scale: 1.03, y: -5 }}
                    onClick={() => router.push(`/chat?q=Explore summaries or search Hadith inside ${book.name}`)}
                    className="group bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 hover:border-[#D4AF37]/40 hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden shadow-sm"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono font-black uppercase tracking-widest text-[#D4AF37] bg-[#1a2e2a]/5 px-3 py-1.5 rounded-xl group-hover:bg-[#D4AF37] group-hover:text-[#1a2e2a] transition-all">
                          {book.count}
                        </span>
                        <span className="text-xs font-serif font-bold text-gray-300 group-hover:text-[#D4AF37]/50 transition-colors">AUTHENTIC</span>
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="font-serif font-black text-xl md:text-2xl text-[#1a2e2a] tracking-tight group-hover:text-[#D4AF37] transition-colors">
                          {book.name}
                        </h4>
                        <p className="text-[11px] text-gray-400 font-medium">Compiled by {book.author}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-[#1a2e2a] transition-all">
                      Browse Chapters <ChevronRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Arabic Text Overlay Background styling */}
                    <div className="text-4xl font-serif font-bold text-[#1a2e2a]/5 absolute -right-2 bottom-6 tracking-normal select-none pointer-events-none group-hover:text-[#1a2e2a]/10 transition-all" dir="rtl">
                      {book.arabicName}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- SEAMLESS TRANSITION CORNER FOR VERIFICATION INQUIRIES --- */}
        <section className="bg-white border border-dashed border-gray-200 rounded-[2.5rem] p-8 text-center max-w-4xl mx-auto space-y-4">
          <div className="w-12 h-12 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-serif font-black text-[#1a2e2a]">Hadith Reference Verification Module</h4>
            <p className="text-xs text-gray-400 max-w-md mx-auto font-medium">
              Kya aap kisi specific Hadith ya WhatsApp forward ko scan ya verify karna chahte hain? Direct hamare AI engine se ruju karein.
            </p>
          </div>
          <button 
            onClick={() => router.push('/chat?q=Verify this Hadith reference statement: ')}
            className="px-8 py-3.5 bg-[#1a2e2a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all shadow-md"
          >
            Verify a Hadith Text Now
          </button>
        </section>

      </div>
    </div>
  );
}