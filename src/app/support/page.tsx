"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Copy, ArrowLeft, CreditCard, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SupportPage() {
  const router = useRouter();

  const PAYONEER_LINK = "https://link.payoneer.com/Token?t=C0C21690B6A740699CAA86DEAA84554D&src=pl";

  return (
    <div className="min-h-screen bg-[#fdfcf8] p-4 md:p-8 font-sans selection:bg-[#D4AF37] selection:text-white flex flex-col items-center justify-center">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full space-y-8 bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-50 text-center"
      >
        {/* --- HEADER --- */}
        <div className="space-y-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-[#1a2e2a] mx-auto font-black text-[10px] uppercase tracking-[0.3em] transition-all">
            <ArrowLeft size={14} /> Back
          </button>
          <div className="bg-[#1a2e2a] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
            <Heart className="text-[#D4AF37]" size={28} fill="currentColor" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-black italic text-[#1a2e2a]">Support <span className="text-[#D4AF37]">Sirat.ai</span></h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
            Build a Sadaqah-e-Jariya. Support our AI & Dawah mission.
          </p>
        </div>

        {/* --- QR CODE SECTION --- */}
        <div className="relative p-6 bg-[#fcfaf2] rounded-[2.5rem] border border-[#D4AF37]/20 inline-block mx-auto group">
          <div className="absolute -top-3 -right-3 bg-[#1a2e2a] text-[#D4AF37] p-2 rounded-xl shadow-lg">
            <Sparkles size={16} />
          </div>
          
          <div className="bg-white p-4 rounded-2xl shadow-inner">
            {/* Yahan aap QR code image ka path dein */}
            <img 
              src="/payoneer-qr.png" 
              alt="Scan to Donate" 
              className="w-48 h-48 md:w-56 md:h-56 object-contain"
            />
          </div>
          
          <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#1a2e2a]/60">
            Scan to Pay via Card
          </p>
        </div>

        {/* --- DIRECT LINK BUTTON --- */}
        <div className="space-y-4 pt-4">
          <a 
            href={PAYONEER_LINK}
            target="_blank" 
            className="w-full bg-[#1a2e2a] text-[#D4AF37] py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-center shadow-xl hover:brightness-125 transition-all flex items-center justify-center gap-2 group"
          >
            Open Payment Link <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
          </a>
          
          <div className="flex items-center justify-center gap-4 text-gray-300">
             <div className="h-[1px] w-full bg-gray-100" />
             <span className="text-[10px] font-black uppercase whitespace-nowrap">Secure Payment</span>
             <div className="h-[1px] w-full bg-gray-100" />
          </div>
        </div>

        {/* --- TRUST FOOTER --- */}
        <div className="flex items-center justify-center gap-3 text-green-600 bg-green-50/50 py-3 px-6 rounded-2xl border border-green-100 inline-flex mx-auto">
           <ShieldCheck size={18} />
           <span className="text-[10px] font-black uppercase tracking-widest">100% Transparent Use of Funds</span>
        </div>
      </motion.div>

      <p className="mt-8 text-[10px] text-gray-300 font-black uppercase tracking-[0.4em]">
        &copy; 2026 Dawah Siraat Mission
      </p>

    </div>
  );
}