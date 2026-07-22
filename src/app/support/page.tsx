"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, ExternalLink, Sparkles, ShieldCheck, Globe, Users, Award, Server, BookOpen, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SupportClient() {
  const router = useRouter();
  const PAYONEER_LINK = "https://link.payoneer.com/Token?t=C0C21690B6A740699CAA86DEAA84554D&src=pl";

  return (
    <div className="min-h-screen bg-[#fdfcf8] font-sans selection:bg-[#D4AF37] selection:text-white flex flex-col items-center">
      
      {/* Top Navbar Simulation */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-[#1a2e2a] font-black text-xs uppercase tracking-[0.2em] transition-all">
          <ArrowLeft size={16} /> Back to Platform
        </button>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#1a2e2a]">Secure Dawah Gateway</span>
        </div>
      </header>

      {/* Main Landing Wrapper */}
      <div className="max-w-5xl w-full px-4 sm:px-6 py-6 space-y-16">
        
        {/* --- HERO SECTION --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a2e2a] text-[#D4AF37] font-bold text-xs shadow-lg border border-[#D4AF37]/30">
            <Sparkles size={14} /> Sadaqah-e-Jariya Initiative · 2026 Mission
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-black italic text-[#1a2e2a] leading-tight">
            Empower Global Islamic Knowledge with <span className="text-[#D4AF37]">Sirat AI</span>
          </h1>
          
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Sirat AI provides instant, authentic Quranic and Hadith guidance to seekers worldwide. Your generous contribution directly funds server infrastructure, advanced AI processing, and worldwide dawah expansion.
          </p>
        </motion.div>

        {/* --- IMPACT STATS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1a2e2a]/5 text-[#1a2e2a] flex items-center justify-center mx-auto">
              <Users size={24} className="text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl font-black text-[#1a2e2a]">Global Ummah</h3>
            <p className="text-xs text-gray-500">Serving seekers across USA, UK, Canada, Australia & Pakistan.</p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1a2e2a]/5 text-[#1a2e2a] flex items-center justify-center mx-auto">
              <BookOpen size={24} className="text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl font-black text-[#1a2e2a]">Authentic Sources</h3>
            <p className="text-xs text-gray-500">Rigorous referencing from Quranic verses and verified Hadith.</p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1a2e2a]/5 text-[#1a2e2a] flex items-center justify-center mx-auto">
              <Award size={24} className="text-[#D4AF37]" />
            </div>
            <h3 className="text-2xl font-black text-[#1a2e2a]">Sadaqah Jariya</h3>
            <p className="text-xs text-gray-500">A permanent reward system as long as knowledge is shared.</p>
          </div>
        </div>

        {/* --- HOW FUNDS ARE UTILIZED SECTION --- */}
        <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1a2e2a]">Where Does Your Support Go?</h2>
            <p className="text-gray-500 text-xs sm:text-sm">We maintain 100% financial transparency to keep Sirat AI completely free for everyone.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4 p-5 rounded-2xl bg-[#fcfaf2] border border-[#D4AF37]/20">
              <Server className="text-[#D4AF37] shrink-0 mt-1" size={24} />
              <div>
                <h4 className="font-black text-sm text-[#1a2e2a]">Server & Cloud Infrastructure</h4>
                <p className="text-xs text-gray-500 mt-1">High-speed Vercel hosting and database management ensuring zero downtime.</p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl bg-[#fcfaf2] border border-[#D4AF37]/20">
              <Sparkles className="text-[#D4AF37] shrink-0 mt-1" size={24} />
              <div>
                <h4 className="font-black text-sm text-[#1a2e2a]">AI Model Processing</h4>
                <p className="text-xs text-gray-500 mt-1">API costs for real-time text generation, voice synthesis, and linguistic accuracy.</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- DONATION CARD / CHECKOUT SECTION --- */}
        <div className="bg-[#1a2e2a] text-white p-8 sm:p-14 rounded-[3.5rem] shadow-2xl relative overflow-hidden text-center space-y-8 border border-[#D4AF37]/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center mx-auto border border-white/10">
              <Heart className="text-[#D4AF37]" size={30} fill="currentColor" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-black italic">Make Your Contribution</h2>
            <p className="text-gray-300 text-sm max-w-md mx-auto">
              Scan the QR code below via mobile banking or click the secure Payoneer link to contribute.
            </p>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-5 rounded-3xl inline-block shadow-2xl relative z-10">
            <img 
              src="/payoneer-qr.png" 
              alt="Scan to Donate via Payoneer" 
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain mx-auto"
            />
            <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-gray-600">Scan via Card / App</p>
          </div>

          {/* Action Button */}
          <div className="max-w-md mx-auto relative z-10 space-y-4">
            <a 
              href={PAYONEER_LINK}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-[#D4AF37] text-[#1a2e2a] py-5 px-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-center shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-3 group"
            >
              Open Secure Payment Link <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>

            <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold pt-2">
              <ShieldCheck size={16} /> 100% Encrypted & Secure Transactions
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="w-full text-center py-10 text-gray-400 text-xs font-bold tracking-widest uppercase border-t border-gray-100 mt-16">
        &copy; 2026 Dawah Siraat Mission · Built for Humanity
      </footer>

    </div>
  );
}