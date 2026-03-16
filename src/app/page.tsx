"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { motion } from 'framer-motion';
import { 
  Send, BookOpen, Scroll, Book, Library, 
  Play, Home, Sparkles, ArrowUpRight, Heart, Globe, User, X, Menu
} from 'lucide-react';

// --- 1. MONTHLY DONATION BANNER COMPONENT ---
function DonationBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-5xl mx-auto px-4 my-16"
    >
      <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-[#b38b4d] via-[#d4af37] to-[#b38b4d] p-10 md:p-14 text-center text-white shadow-[0_30px_60px_-15px_rgba(212,175,55,0.3)]">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-8 top-8 text-white/70 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif font-black tracking-tight italic">
            Become a Monthly Donor
          </h2>
          
          <p className="text-white/90 text-sm md:text-lg leading-relaxed font-medium">
            Monthly donations help us improve <span className="font-bold underline decoration-white/30">Sirat.ai</span> and sustain operations so we focus less on fundraising and more on creating impact for the Ummah.
          </p>

          <div className="pt-4">
            <button className="group relative inline-flex items-center gap-3 bg-[#1a2e2a] px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] text-[#D4AF37] hover:bg-black transition-all active:scale-95 shadow-2xl">
              <Heart size={18} className="fill-[#D4AF37]" />
              Donate now
            </button>
          </div>
        </div>

        {/* Subtle Background Sparkle */}
        <div className="absolute -left-10 -bottom-10 opacity-10 rotate-12">
          <Sparkles size={240} />
        </div>
      </div>
    </motion.div>
  );
}

// 2. MAIN LANDING PAGE
export default function SiratLandingPage() {
  const [query, setQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] font-sans selection:bg-[#D4AF37] selection:text-white overflow-x-hidden">
      
      {/* 1. NAVBAR - Responsive Version */}
      <nav className="bg-[#1a2e2a]/95 backdrop-blur-md text-white px-4 md:px-12 py-5 flex items-center justify-between sticky top-0 z-50 border-b border-white/5 shadow-2xl">
        
        {/* Left: Mobile Menu + Logo */}
        <div className="flex items-center gap-3">
          {/* MOBILE MENU ICON - Sirf Mobile par nazar aye ga */}
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
        
        {/* Center: Desktop Links (Hidden on Mobile) */}
        <div className="hidden lg:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.3em] opacity-70">
          <a href="/quran" className="hover:text-[#D4AF37] transition-all">Al-Quran</a>
          <a href="/hadith" className="hover:text-[#D4AF37] transition-all">Hadith</a>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => router.push('/chat')} 
            className="flex items-center gap-2 px-3 md:px-6 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all"
          >
            <User size={16} className="text-[#D4AF37]" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">My Dashboard</span>
          </button>

          <button 
            onClick={() => router.push('/donate')}
            className="bg-[#D4AF37] text-[#1a2e2a] px-5 md:px-8 py-2 md:py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg"
          >
            <span className="sm:hidden">Support</span>
            <span className="hidden sm:inline">Support Mission</span>
          </button>
        </div>
      </nav>

      {/* MOBILE OVERLAY MENU - Premium Colors Update */}
{isMobileMenuOpen && (
  <motion.div 
    initial={{ x: '-100%', opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: '-100%', opacity: 0 }}
    className="fixed inset-0 bg-[#1a2e2a] z-[100] p-8 flex flex-col lg:hidden"
  >
    {/* Header inside Menu */}
    <div className="flex justify-between items-center mb-16">
      <div className="flex items-center gap-2">
        <div className="bg-[#D4AF37] p-1.5 rounded-lg">
          <Sparkles size={18} className="text-[#1a2e2a]" />
        </div>
        <span className="text-2xl font-black italic tracking-tighter text-white">
          SIRAT<span className="text-[#D4AF37]">.AI</span>
        </span>
      </div>
      <button 
        onClick={() => setIsMobileMenuOpen(false)} 
        className="p-3 bg-white/5 border border-white/10 rounded-full active:scale-90 transition-all"
      >
        <X size={28} className="text-[#D4AF37]" />
      </button>
    </div>
    
    {/* Navigation Links */}
    <div className="flex flex-col gap-6">
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-2">Sirat</p>
      
      <a href="/quran" className="flex justify-between items-center group">
        <span className="text-3xl font-serif italic text-white group-hover:text-[#D4AF37] transition-colors">Al-Quran</span>
        <ArrowUpRight className="text-[#D4AF37] opacity-50 group-hover:opacity-100" size={24} />
      </a>
      
      <div className="h-[1px] w-full bg-white/5" />

      <a href="/hadith" className="flex justify-between items-center group">
        <span className="text-3xl font-serif italic text-white group-hover:text-[#D4AF37] transition-colors">Hadith</span>
        <ArrowUpRight className="text-[#D4AF37] opacity-50 group-hover:opacity-100" size={24} />
      </a>

      <div className="h-[1px] w-full bg-white/5" />

      <a href="/chat" className="flex justify-between items-center group">
        <span className="text-3xl font-serif italic text-white group-hover:text-[#D4AF37] transition-colors">Dashboard</span>
        <User className="text-[#D4AF37] opacity-50 group-hover:opacity-100" size={24} />
      </a>
    </div>

    {/* Bottom Call to Action */}
    <div className="mt-auto">
      <button 
        onClick={() => router.push('/donate')}
        className="w-full bg-[#D4AF37] text-[#1a2e2a] py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(212,175,55,0.2)] flex items-center justify-center gap-3 active:scale-95 transition-all"
      >
        <Heart size={20} className="fill-[#1a2e2a]" />
        Support Mission
      </button>
      <p className="text-center text-white/30 text-[10px] font-bold uppercase tracking-widest mt-6">
        © 2026 Sirat AI · Authentic Wisdom
      </p>
    </div>
  </motion.div>
)}

      {/* ... baqi aapka Hero Section, Banner, etc. as it is rahein ga */}

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-24 px-4 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,_#D4AF3715_0%,_transparent_70%)] -z-10" />

        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-xl mb-10 border border-gray-50">
            <Sparkles size={16} className="text-[#D4AF37] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a2e2a]/60 font-mono">2026 AI Engine Active</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-serif text-[#1a2e2a] mb-12 leading-[0.95] font-black tracking-tighter">
            Authentic Wisdom. <br />
            <span className="italic text-[#D4AF37] font-medium serif underline decoration-[#1a2e2a]/5">Divine Light.</span>
          </h1>

          <div className="relative max-w-3xl mx-auto mb-20 group">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Sawal poochein..."
              className="relative w-full py-8 px-12 pr-24 rounded-full border-none outline-none focus:ring-8 focus:ring-[#D4AF37]/5 text-gray-800 bg-white text-xl shadow-[0_40px_100px_rgba(0,0,0,0.07)] transition-all placeholder:text-gray-300"
            />
            <button 
              onClick={handleSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#1a2e2a] hover:bg-[#D4AF37] text-white hover:text-[#1a2e2a] p-5 rounded-full shadow-2xl transition-all active:scale-90"
            >
              <Send size={24} />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto px-4">
            <ResourceCard icon={<BookOpen size={28}/>} title="Al-Quran" />
            <ResourceCard icon={<Scroll size={28}/>} title="Hadith" />
            <ResourceCard icon={<Book size={28}/>} title="Fiqh" />
            <ResourceCard icon={<Library size={28}/>} title="Siraat" />
          </div>
        </motion.div>
      </section>

      {/* 3. 7-DAY CHALLENGE BANNER */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-[#D4AF37] text-[#1a2e2a] py-4 px-6 text-center font-black uppercase tracking-[0.2em] text-[12px] flex flex-col md:flex-row items-center justify-center gap-4 shadow-xl"
      >
        <span className="flex items-center gap-2">
          <Sparkles size={16} /> EMERGENCY FUNDRAISING: 7 DAYS REMAINING
        </span>
        <div className="flex gap-4 bg-[#1a2e2a] text-[#D4AF37] px-4 py-1 rounded-full">
          <span>06d : 23h : 45m</span>
        </div>
        <button onClick={() => router.push('/donate')} className="underline hover:scale-105 transition-transform">
          BECOME A FOUNDING SUPPORTER →
        </button>
      </motion.div>

      {/* --- ADDING THE MONTHLY DONATION BANNER HERE --- */}
      <DonationBanner />

      {/* 4. DAWAH SECTION */}
      <section className="bg-[#1a2e2a] text-white py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <p className="text-[#D4AF37] font-black uppercase tracking-[0.4em] text-xs">The Digital Minbar</p>
            <h2 className="text-5xl md:text-7xl font-serif font-bold leading-tight">Dawat-e-Sirat <br/> on YouTube</h2>
            <button className="bg-[#D4AF37] text-[#1a2e2a] px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl">
              Visit Dawah Siraat
            </button>
          </div>
          <div className="relative aspect-video bg-black rounded-[3rem] overflow-hidden shadow-2xl">
             <img src="https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1000" className="w-full h-full object-cover opacity-40" alt="Dawah" />
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 transition-transform cursor-pointer">
                 <Play size={32} className="fill-white ml-2" />
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* 5. MISSION PROGRESS */}
      <section className="bg-[#1a2e2a] py-20 px-6">
        <div className="max-w-5xl mx-auto bg-[#fdfcf8] rounded-[4rem] p-12 md:p-20 text-[#1a2e2a] shadow-2xl">
            <h2 className="text-5xl font-serif font-black italic mb-12 text-center md:text-left tracking-tighter">Mission Progress</h2>
            <div className="space-y-4 mb-16">
               <div className="flex justify-between items-end">
                  <span className="text-xs font-black uppercase opacity-40">Goal: $50,000</span>
                  <span className="text-4xl font-serif italic font-bold">45% <span className="text-xs font-sans not-italic opacity-30 tracking-widest">RAISED</span></span>
               </div>
               <div className="h-4 bg-gray-100 rounded-full overflow-hidden p-1 border border-gray-50">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '45%' }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="h-full bg-[#1a2e2a] rounded-full"
                  />
               </div>
            </div>
        </div>
      </section>

      {/* 6. GLOBAL IMPACT (Pulse of Ummah) - Premium Updated Version */}
<section className="py-32 bg-[#fdfcf8] relative overflow-hidden">
  {/* Background Subtle Elements */}
  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')] opacity-[0.03] pointer-events-none" />
  
  <div className="max-w-7xl mx-auto px-6 relative z-10">
    <div className="text-center max-w-3xl mx-auto mb-20">
      <motion.p 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }}
        className="text-[#D4AF37] font-black uppercase tracking-[0.4em] text-[10px] mb-4"
      >
        The Pulse of Ummah
      </motion.p>
      <h2 className="text-4xl md:text-7xl font-serif font-black text-[#1a2e2a] leading-tight tracking-tighter">
        Seeking Guidance <br /> Across the <span className="italic text-[#D4AF37] drop-shadow-sm">Ummah.</span>
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      <ImpactCard 
        icon="🌙" 
        title="Family Laws" 
        count="12,400+" 
        description="Nikah, Divorce & Inheritance guidance based on Sharia."
        glowColor="rgba(212,175,55,0.2)"
      />
      <ImpactCard 
        icon="⚖️" 
        title="Zakat & Finance" 
        count="8,200+" 
        description="Halal Investment and Zakat calculations verified."
        glowColor="rgba(26,46,42,0.1)"
      />
      <ImpactCard 
        icon="✨" 
        title="Sunnah Ethics" 
        count="25,900+" 
        description="Daily Adab and Akhlaq from authentic Sahih Hadith."
        glowColor="rgba(212,175,55,0.2)"
      />
    </div>
  </div>
</section>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function ResourceCard({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white p-8 rounded-[2.5rem] flex flex-col items-center gap-4 transition-all shadow-sm hover:shadow-2xl border border-gray-50 group cursor-pointer"
    >
      <div className="text-[#1a2e2a] group-hover:text-[#D4AF37] transition-colors duration-500">{icon}</div>
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a2e2a]">{title}</h3>
    </motion.div>
  );
}

// --- UPDATED IMPACT CARD COMPONENT ---
function ImpactCard({ icon, title, count, description, glowColor }: any) {
  return (
    <motion.div 
      whileHover={{ y: -20 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative p-10 rounded-[3.5rem] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] group cursor-default overflow-hidden"
    >
      {/* Hover Glow Effect */}
      <div 
        className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10"
        style={{ backgroundColor: glowColor }}
      />

      <div className="relative z-10">
        <div className="text-5xl mb-8 transform group-hover:scale-125 transition-transform duration-500 block w-fit">
          {icon}
        </div>
        
        <h3 className="text-2xl font-black text-[#1a2e2a] mb-3 group-hover:text-[#D4AF37] transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-400 text-sm leading-relaxed mb-8 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all duration-500">
          {description}
        </p>

        <div className="flex items-center justify-between mt-auto border-t border-gray-50 pt-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Total Solved</p>
            <p className="text-2xl font-serif italic font-bold text-[#1a2e2a] group-hover:text-[#D4AF37]">
              {count}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-full group-hover:bg-[#1a2e2a] group-hover:text-white transition-all">
            <ArrowUpRight size={20} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}