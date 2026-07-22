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
  tradition: 'sunni' | 'shia';
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
    text: "«إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى»",
    translation: "Actions are but by intentions, and every person shall have what he intended.",
    reference: "Sahih al-Bukhari",
    narrator: "Narrated by Umar bin Al-Khattab (R.A)"
  };

  // --- EXTENDED HADITH DATA POOL: SUNNI & SHIA MASTER REGISTRY ---
  const hadithBooks: HadithBook[] = [
    // --- Sihah e Sittah (Sunni Hub) ---
    { id: "bukhari", name: "Sahih al-Bukhari", arabicName: "صحيح البخاري", count: "7,563 Hadiths", author: "Imam Al-Bukhari", tradition: 'sunni' },
    { id: "muslim", name: "Sahih Muslim", arabicName: "صحيح مسلم", count: "7,500 Hadiths", author: "Imam Muslim", tradition: 'sunni' },
    { id: "tirmidhi", name: "Jami` at-Tirmidhi", arabicName: "جامع الترمذي", count: "3,956 Hadiths", author: "Imam At-Tirmidhi", tradition: 'sunni' },
    { id: "abudawood", name: "Sunan Abi Dawud", arabicName: "سنن أبي داود", count: "5,274 Hadiths", author: "Imam Abu Dawud", tradition: 'sunni' },
    { id: "nasai", name: "Sunan an-Nasa'i", arabicName: "سنن النسائي", count: "5,758 Hadiths", author: "Imam An-Nasa'i", tradition: 'sunni' },
    { id: "ibnmajah", name: "Sunan Ibn Majah", arabicName: "سنن ابن ماجه", count: "4,341 Hadiths", author: "Imam Ibn Majah", tradition: 'sunni' },
    
    // --- Kutub al-Arba'ah (Shia Hub Primary Validation) ---
    { id: "kafi", name: "Al-Kafi", arabicName: "الكافي", count: "16,000 Hadiths", author: "Sheikh al-Kulayni", tradition: 'shia' },
    { id: "faqih", name: "Man La Yahduruhu al-Faqih", arabicName: "من لا يحضره الفقيه", count: "9,044 Hadiths", author: "Sheikh Al-Saduq", tradition: 'shia' },
    { id: "tahdhib", name: "Tahdhib al-Ahkam", arabicName: "تهذيب الأحكام", count: "13,590 Hadiths", author: "Sheikh al-Tusi", tradition: 'shia' },
    { id: "istibsar", name: "Al-Istibsar", arabicName: "الاستبصار", count: "5,511 Hadiths", author: "Sheikh al-Tusi", tradition: 'shia' }
  ];

  const categories = [
    { id: 'all', label: 'All Primary Sources' },
    { id: 'sunni', label: 'Sihah-e-Sittah (Sunni)' },
    { id: 'shia', label: 'Kutub al-Arba’ah (Shia)' },
  ];

  const filteredBooks = hadithBooks.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.author.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    return b.tradition === activeTab && matchesSearch;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Hadith text copied to clipboard!");
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
    <main className="min-h-screen bg-[#fdfcf8] font-sans selection:bg-[#D4AF37] selection:text-white pb-20 overflow-x-hidden">
      
      {/* ================= STICKY NAVIGATION BAR ================= */}
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
            aria-label="Bot Workspace"
            className="flex items-center gap-2 px-3 md:px-5 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-xs font-bold uppercase transition-all"
          >
            <Home size={14} className="text-[#D4AF37]" />
            <span className="text-[10px] tracking-widest hidden sm:inline">Bot Workspace</span>
          </button>

          <button 
            onClick={() => router.push('/dashboard')} 
            aria-label="My Dashboard"
            className="flex items-center gap-2 px-3 md:px-5 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 text-xs font-bold uppercase transition-all"
          >
            <User size={14} className="text-[#D4AF37]" />
            <span className="text-[10px] tracking-widest hidden sm:inline">My Dashboard</span>
          </button>
        </div>
      </nav>

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <div className="max-w-6xl mx-auto px-4 mt-10 space-y-12 md:space-y-16">
        
        {/* --- HADITH COMPREHENSIVE HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-8 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#D4AF37] font-black text-[10px] uppercase tracking-[0.4em]">
              <Sparkles size={14} /> Comprehensive Hadith Encyclopedia
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-black italic text-[#1a2e2a]">
              The Prophetic <span className="text-[#D4AF37]">Hadith</span>
            </h1>
            <p className="text-gray-400 text-xs md:text-sm font-medium">Explore Verified Reference Contexts Across Sunni and Shia Hadith Literature Pools</p>
          </div>
          <div className="flex bg-[#1a2e2a] p-4 rounded-3xl shadow-xl border-b-4 border-[#D4AF37] text-white flex-col items-center shrink-0">
             <Scroll className="text-[#D4AF37]" size={28} />
          </div>
        </header>

        {/* --- HADITH OF THE DAY (PREMIUM BANNER) --- */}
        <section className="bg-[#1a2e2a] rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border-b-8 border-[#D4AF37]" aria-label="Hadith of the Day">
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
                <button onClick={() => copyToClipboard(`${hadithOfTheDay.translation} — ${hadithOfTheDay.reference}`)} aria-label="Copy Hadith" className="p-3 bg-white/5 hover:bg-[#D4AF37] hover:text-[#1a2e2a] rounded-xl transition-all border border-white/10 text-white/80">
                  <Copy size={14} />
                </button>
                <button onClick={() => speak(hadithOfTheDay.translation)} aria-label="Read Aloud Hadith" className={`p-3 rounded-xl transition-all border border-white/10 ${isSpeaking ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/5 hover:bg-[#D4AF37] hover:text-[#1a2e2a] text-white/80'}`}>
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
                placeholder="Search Hadith source, author or title..." 
                aria-label="Search Hadith source"
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-white border border-gray-100 rounded-3xl md:rounded-[2rem] outline-none focus:ring-8 focus:ring-[#D4AF37]/5 font-bold text-sm shadow-sm transition-all text-gray-900"
              />
            </div>

            {/* Navigation Filter Tabs */}
            <div className="flex gap-2 p-1.5 bg-gray-100/50 rounded-[2rem] overflow-x-auto no-scrollbar max-w-full">
              {categories.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  aria-label={tab.label}
                  className={`flex items-center gap-2 px-6 md:px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === tab.id ? 'bg-[#1a2e2a] text-[#D4AF37] shadow-xl' : 'text-gray-400 hover:text-[#1a2e2a]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ================= DYNAMIC GRID LIST OF HADITH REGISTRIES ================= */}
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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredBooks.map((book) => (
                  <motion.div 
                    key={book.id} 
                    whileHover={{ scale: 1.03, y: -5 }}
                    onClick={() => router.push(`/chat?q=Explore or search Hadith text validations within the collection ${book.name}`)}
                    className="group bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 hover:border-[#D4AF37]/40 hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden shadow-sm"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono font-black uppercase tracking-widest text-[#D4AF37] bg-[#1a2e2a]/5 px-3 py-1.5 rounded-xl group-hover:bg-[#D4AF37] group-hover:text-[#1a2e2a] transition-all">
                          {book.count}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${book.tradition === 'sunni' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                          {book.tradition === 'sunni' ? 'Sunni Source' : 'Shia Source'}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <h2 className="font-serif font-black text-xl md:text-2xl text-[#1a2e2a] tracking-tight group-hover:text-[#D4AF37] transition-colors">
                          {book.name}
                        </h2>
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

        {/* --- CROSS SECTARIAN CROSS-REFERENCE VERIFICATION ENGINE --- */}
        <section className="bg-white border border-dashed border-gray-200 rounded-[2.5rem] p-8 text-center max-w-4xl mx-auto space-y-4" aria-label="Verification Engine">
          <div className="w-12 h-12 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-serif font-black text-[#1a2e2a]">Cross-Reference Validation Engine</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto font-medium">
              Verify authentic context, chains of narration (Asma al-Rijal), and textual authenticity across authentic Sunni and Shia primary literature pools instantly.
            </p>
          </div>
          <button 
            onClick={() => router.push('/chat?q=Analyze and cross-verify this Hadith text statement across Sunni and Shia corpuses: ')}
            aria-label="Verify Cross-Sect Hadith Text"
            className="px-8 py-3.5 bg-[#1a2e2a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all shadow-md"
          >
            Verify Cross-Sect Hadith Text
          </button>
        </section>

      </div>
    </main>
  );
}