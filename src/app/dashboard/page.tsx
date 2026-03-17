"use client";

import React, { useState, useEffect } from 'react'; // Don't forget to import these
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Book, Mic, MessageSquare, Star, 
  ArrowRight, Play, Heart, Sparkles, Compass, Clock
} from 'lucide-react';

export default function UserDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  // --- HOOKS AB ANDAR HAIN ---
  const [lastRead, setLastRead] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("sirat_last_read");
    if (saved) {
      setLastRead(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfcf8] p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#1a2e2a] p-2 rounded-xl">
                <Sparkles size={18} className="text-[#D4AF37]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Personal Sanctum</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-[#1a2e2a] italic">
              Welcome, <span className="text-[#D4AF37]">{session?.user?.name || "Seeker"}</span>
            </h1>
          </div>
          
          <div className="flex gap-4">
             <button onClick={() => router.push('/profile')} className="p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-lg transition-all">
                <Compass className="text-[#1a2e2a]" size={20} />
             </button>
             <button className="bg-[#1a2e2a] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-black transition-all">
                The Mission Hub
             </button>
          </div>
        </header>

        {/* --- CORE FEATURES --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* AI Guidance Card */}
          <motion.div whileHover={{ y: -10 }} className="lg:col-span-1 bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-[#1a2e2a] rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-[#1a2e2a]/20">
                <MessageSquare className="text-[#D4AF37]" size={28} />
              </div>
              <h3 className="text-3xl font-serif font-black italic text-[#1a2e2a] mb-4">Neural Guidance</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">Discuss Islamic ethics, history, and jurisprudence with our verified AI model.</p>
            </div>
            <button onClick={() => router.push('/chat')} className="flex items-center justify-between w-full bg-gray-50 p-5 rounded-2xl group hover:bg-[#1a2e2a] transition-all">
              <span className="font-black text-[10px] uppercase tracking-widest group-hover:text-white">Start Discussion</span>
              <ArrowRight size={18} className="text-[#D4AF37]" />
            </button>
          </motion.div>

          {/* Quran Reading Card (CONTINUE READING) */}
          <motion.div 
            whileHover={{ y: -10 }}
            className="lg:col-span-1 bg-[#1a2e2a] p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between cursor-pointer"
            onClick={() => router.push(`/quran/${lastRead?.id || '1'}`)}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-[#D4AF37] rounded-2xl flex items-center justify-center mb-8">
                <Clock className="text-[#1a2e2a]" size={28} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-1 italic">Resume Reading</p>
              <h3 className="text-3xl font-serif font-black italic text-white mb-4">
                {lastRead ? `Surah ${lastRead.name}` : "Digital Mushaf"}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed mb-8">
                {lastRead ? "Pick up where you left off in your last session." : "Read the Noble Quran with word-by-word analysis."}
              </p>
            </div>
            <button className="flex items-center justify-between w-full bg-white/5 p-5 rounded-2xl group hover:bg-white transition-all">
              <span className="font-black text-[10px] uppercase tracking-widest text-white group-hover:text-[#1a2e2a]">
                {lastRead ? "Resume Now" : "Open Quran"}
              </span>
              <Play size={18} className="text-[#D4AF37]" fill="currentColor" />
            </button>
          </motion.div>

          {/* Recitation Card */}
          <motion.div whileHover={{ y: -10 }} className="lg:col-span-1 bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-8">
                <Mic className="text-[#1a2e2a]" size={28} />
              </div>
              <h3 className="text-3xl font-serif font-black italic text-[#1a2e2a] mb-4">Voice Recital</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">Practice your Tajweed and listen to the world's most beautiful recitations.</p>
            </div>
            <button className="flex items-center justify-between w-full bg-gray-50 p-5 rounded-2xl group hover:bg-[#1a2e2a] transition-all">
              <span className="font-black text-[10px] uppercase tracking-widest group-hover:text-white">Start Reciting</span>
              <Mic size={18} className="text-[#D4AF37]" />
            </button>
          </motion.div>

        </div>

        {/* --- PROGRESS SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#fcfaf2] border border-[#D4AF37]/20 p-10 rounded-[3.5rem] flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-6 font-mono">Today's Wisdom</p>
              <p className="text-2xl font-serif italic text-[#1a2e2a] leading-relaxed mb-6" dir="rtl">
                "And say: My Lord, increase me in knowledge."
              </p>
              <div className="text-gray-400 text-xs font-bold italic">
                <span>[ SURAH TAHA 20:114 ]</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col justify-center items-center text-center">
                <p className="text-3xl font-serif font-black italic text-[#1a2e2a]">0</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-2">Verses Read</p>
             </div>
             <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col justify-center items-center text-center">
                <p className="text-3xl font-serif font-black italic text-[#1a2e2a]">0h</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-2">Listening Time</p>
             </div>
             <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col justify-center items-center text-center hover:bg-[#D4AF37]/5 transition-colors">
                <Star className="text-[#D4AF37] mb-2" size={24} />
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total Rewards</p>
             </div>
             <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col justify-center items-center text-center hover:bg-red-50 transition-colors">
                <Heart className="text-red-400 mb-2" size={24} />
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Saved Ayats</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}