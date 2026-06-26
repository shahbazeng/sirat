"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, User, Menu, X, ArrowUpRight, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation'; // <--- Yeh line sahi kar di hai

export default function Header({ setIsMobileMenuOpen }: { setIsMobileMenuOpen: (v: boolean) => void }) {
  const router = useRouter();
  
  return (
    <nav className="bg-[#1a2e2a]/95 backdrop-blur-md text-white px-4 md:px-12 py-5 flex items-center justify-between sticky top-0 z-[100] border-b border-white/5 shadow-xl transition-all duration-300">
        
        {/* Left: Mobile Menu Trigger + Logo Stack */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition"
          >
            <Menu size={24} className="text-[#D4AF37]" />
          </button>

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
        
        {/* Center: Links Layout */}
        <div className="hidden lg:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.3em] opacity-70">
          <a href="/quran" className="hover:text-[#D4AF37] transition-all">Al-Quran</a>
          <a href="/hadith" className="hover:text-[#D4AF37] transition-all">Hadith</a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => router.push('/dashboard')} 
            className="flex items-center gap-2 px-3 md:px-6 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all"
          >
            <User size={16} className="text-[#D4AF37]" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">My Dashboard</span>
          </button>

          <button 
            onClick={() => router.push('/support')}
            className="bg-[#D4AF37] text-[#1a2e2a] px-5 md:px-8 py-2 md:py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg"
          >
            <span className="sm:hidden">Support</span>
            <span className="hidden sm:inline">Support Mission</span>
          </button> 
        </div>
    </nav>
  );
}