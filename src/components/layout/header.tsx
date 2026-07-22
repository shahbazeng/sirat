"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { User, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Header({ setIsMobileMenuOpen }: { setIsMobileMenuOpen: (v: boolean) => void }) {
  const router = useRouter();
  
  return (
    <nav className="bg-[#1a2e2a]/95 backdrop-blur-md text-white px-3 sm:px-6 md:px-12 h-16 sm:h-20 flex items-center justify-between sticky top-0 z-[100] border-b border-white/5 shadow-xl transition-all duration-300 w-full overflow-visible">
        
        {/* Left: Mobile Menu Trigger + Maximized Logo */}
        <div className="flex items-center gap-2 sm:gap-4 h-full">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition text-[#D4AF37]"
            aria-label="Open Mobile Menu"
          >
            <Menu size={24} />
          </button>

          <motion.div 
            initial={{ x: -20, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center group cursor-pointer h-full" 
            onClick={() => router.push('/')}
          >
            {/* LOGO SIZE MAXIMUM WITHOUT INCREASING NAVBAR HEIGHT */}
            <div className="relative w-52 sm:w-64 md:w-80 h-16 sm:h-20 md:h-24 flex items-center overflow-visible">
              <Image 
                src="/sirat-ai-logo.png" 
                alt="Sirat AI Logo" 
                fill 
                className="object-contain object-left scale-[1.8] sm:scale-[1.4] origin-left"
                priority
              />
            </div>
          </motion.div>
        </div>
        
        {/* Center: Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.3em] opacity-75">
          <a href="/quran" className="hover:text-[#D4AF37] transition-all">Al-Quran</a>
          <a href="/hadith" className="hover:text-[#D4AF37] transition-all">Hadith</a>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <button 
            onClick={() => router.push('/dashboard')} 
            className="flex items-center gap-1.5 px-3 sm:px-5 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-xs font-bold"
          >
            <User size={15} className="text-[#D4AF37]" />
            <span className="text-[10px] font-black uppercase tracking-wider hidden sm:inline">Dashboard</span>
          </button>

          <button 
            onClick={() => router.push('/support')}
            className="bg-[#D4AF37] text-[#1a2e2a] px-4 sm:px-6 md:px-8 py-2 md:py-2.5 rounded-full font-black text-[10px] uppercase tracking-wider hover:brightness-110 transition-all shadow-md whitespace-nowrap"
          >
            <span className="sm:hidden">Support</span>
            <span className="hidden sm:inline">Support Mission</span>
          </button> 
        </div>
    </nav>
  );
}