"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, ExternalLink, Sparkles, ShieldCheck, Globe, Users, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SupportClient() {
  const router = useRouter();
  const PAYONEER_LINK = "https://link.payoneer.com/Token?t=C0C21690B6A740699CAA86DEAA84554D&src=pl";

  return (
    <div className="min-h-screen bg-[#fdfcf8] p-4 md:p-12 font-sans selection:bg-[#D4AF37] selection:text-white flex flex-col items-center justify-center">
      
      {/* Global SEO Optimized Landing Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full space-y-10 bg-white p-6 sm:p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 text-center relative overflow-hidden"
      >
        {/* Background Divine Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/5 blur-[100px] rounded-full pointer-events-none" />

        {/* --- HEADER --- */}
        <div className="space-y-4 relative z-10">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-[#1a2e2a] mx-auto font-black text-[10px] uppercase tracking-[0.3em] transition-all">
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          
          <div className="bg-[#1a2e2a] w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-xl border border-[#D4AF37]/30">
            <Heart className="text-[#D4AF37]" size={34} fill="currentColor" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1a2e2a]/5 text-[#1a2e2a] font-bold text-xs">
            <Globe size={14} className="text-[#D4AF37]" /> Global Islamic Sadaqah & Dawah Initiative
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-black italic text-[#1a2e2a] leading-tight">
            Empower Humanity with <span className="text-[#D4AF37]">Sirat AI</span>
          </h1>
          
          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Contribute to the world’s leading AI-powered Islamic knowledge platform. Your support acts as a continuous <span className="font-bold text-[#1a2e2a]">Sadaqah-e-Jariya</span>, helping spread authentic Quranic guidance globally across the US, UK, Canada, Australia, and beyond.
          </p>
        </div>

        {/* --- GLOBAL IMPACT METRICS (SEO Optimized Copy) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left relative z-10">
          <div className="bg-[#fcfaf2] p-5 rounded-2xl border border-[#D4AF37]/20 space-y-1">
            <Users className="text-[#D4AF37] mb-2" size={20} />
            <h4 className="font-black text-xs uppercase tracking-wider text-[#1a2e2a]">Global Ummah Reach</h4>
            <p className="text-[11px] text-gray-500">Serving seekers of Islamic knowledge worldwide 24/7.</p>
          </div>
          <div className="bg-[#fcfaf2] p-5 rounded-2xl border border-[#D4AF37]/20 space-y-1">
            <ShieldCheck className="text-[#D4AF37] mb-2" size={20} />
            <h4 className="font-black text-xs uppercase tracking-wider text-[#1a2e2a]">100% Transparent</h4>
            <p className="text-[11px] text-gray-500">Funds directly power server infrastructure & AI models.</p>
          </div>
          <div className="bg-[#fcfaf2] p-5 rounded-2xl border border-[#D4AF37]/20 space-y-1">
            <Award className="text-[#D4AF37] mb-2" size={20} />
            <h4 className="font-black text-xs uppercase tracking-wider text-[#1a2e2a]">Sadaqah Jariya</h4>
            <p className="text-[11px] text-gray-500">A permanent spiritual investment for your hereafter.</p>
          </div>
        </div>

        {/* --- QR CODE & PAYMENT SECTION --- */}
        <div className="relative p-6 sm:p-8 bg-[#fcfaf2] rounded-[2.5rem] border border-[#D4AF37]/30 inline-block mx-auto group z-10 w-full max-w-md">
          <div className="absolute -top-3 -right-3 bg-[#1a2e2a] text-[#D4AF37] p-2.5 rounded-2xl shadow-lg">
            <Sparkles size={18} />
          </div>
          
          <div className="bg-white p-4 rounded-3xl shadow-inner inline-block">
            <img 
              src="/payoneer-qr.png" 
              alt="Scan to Donate for Islamic Charity & AI Dawah" 
              className="w-48 h-48 md:w-56 md:h-56 object-contain mx-auto"
            />
          </div>
          
          <p className="mt-4 text-[11px] font-black uppercase tracking-widest text-[#1a2e2a]">
            Scan via Mobile or Pay Securely Online
          </p>
        </div>

        {/* --- DIRECT LINK BUTTON --- */}
        <div className="space-y-4 pt-2 relative z-10 max-w-md mx-auto w-full">
          <a 
            href={PAYONEER_LINK}
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full bg-[#1a2e2a] text-[#D4AF37] py-5 px-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-center shadow-xl hover:brightness-125 transition-all flex items-center justify-center gap-3 group"
          >
            Contribute via Secure Payment <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
          
          <div className="flex items-center justify-center gap-4 text-gray-300">
             <div className="h-[1px] w-full bg-gray-100" />
             <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Encrypted & Secure</span>
             <div className="h-[1px] w-full bg-gray-100" />
          </div>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <p className="mt-8 text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] text-center">
        &copy; 2026 Dawah Siraat Mission · Global Islamic AI Platform
      </p>

    </div>
  );
}