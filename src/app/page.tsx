"use client";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import FunnelGateModal from '@/components/auth/FunnelGateModal';
import { 
  Send, BookOpen, Scroll, Book, Library, 
  Play, Sparkles, ArrowUpRight, Heart, Globe, User, X, CheckCircle2, ShieldCheck, Compass
} from 'lucide-react';

// --- 1. MONTHLY DONATION BANNER COMPONENT ---
function DonationBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();
  if (!isVisible) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-5xl mx-auto px-4 my-16"
    >
      <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-[#b38b4d] via-[#d4af37] to-[#b38b4d] p-10 md:p-14 text-center text-white shadow-[0_30px_60px_-15px_rgba(212,175,55,0.3)]">
        
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-8 top-8 text-white/70 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="max-w-3xl mx-auto space-y-8">
          <h3 className="text-4xl md:text-5xl font-serif font-black tracking-tight italic">
            Support Global Islamic Wisdom
          </h3>
          
          <p className="text-white/90 text-sm md:text-lg leading-relaxed font-medium">
            Your contributions help <span className="font-bold underline decoration-white/30">Sirat.ai</span> remain a free, accessible, and authentic digital hub for seekers worldwide.
          </p>

          <div className="pt-4">
            <button onClick={() => router.push('/support')} className="group relative inline-flex items-center gap-3 bg-[#1a2e2a] px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] text-[#D4AF37] hover:bg-black transition-all active:scale-95 shadow-2xl">
              <Heart size={18} className="fill-[#D4AF37]" />
              Support The Mission
            </button>
          </div>
        </div>

        <div className="absolute -left-10 -bottom-10 opacity-10 rotate-12 pointer-events-none">
          <Sparkles size={240} />
        </div>
      </div>
    </motion.div>
  );
}

// 2. MAIN LANDING PAGE
export default function SiratLandingPage() {
  const [query, setQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [isFunnelOpen, setIsFunnelOpen] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;
    const userName = localStorage.getItem("sirat_user_name");
    if (!userName) {
      setIsFunnelOpen(true);
    } else {
      router.push(`/chat?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] font-sans selection:bg-[#D4AF37] selection:text-white overflow-x-hidden flex flex-col justify-between">
      <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />
      
      <FunnelGateModal isOpen={isFunnelOpen} onClose={() => setIsFunnelOpen(false)} />

      {/* MOBILE OVERLAY DRAWER PANEL */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
            className="fixed inset-0 bg-[#1a2e2a] z-[200] p-8 flex flex-col lg:hidden h-screen"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="relative w-48 h-16 flex items-center overflow-visible" onClick={() => { setIsMobileMenuOpen(false); router.push('/'); }}>
                <Image 
                  src="/sirat-ai-logo.png" 
                  alt="Sirat AI Logo" 
                  fill 
                  className="object-contain object-left scale-[1.7] origin-left cursor-pointer"
                  priority
                />
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-3 bg-white/5 border border-white/10 rounded-full active:scale-90 transition-all"
              >
                <X size={28} className="text-[#D4AF37]" />
              </button>
            </div>
            
            <div className="flex flex-col gap-6">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-2">Universal Hub</p>
              
              <a href="/quran" onClick={() => setIsMobileMenuOpen(false)} className="flex justify-between items-center group">
                <span className="text-3xl font-serif italic text-white group-hover:text-[#D4AF37] transition-colors">Al-Quran</span>
                <ArrowUpRight className="text-[#D4AF37] opacity-50 group-hover:opacity-100" size={24} />
              </a>
              
              <div className="h-[1px] w-full bg-white/5" />

              <a href="/hadith" onClick={() => setIsMobileMenuOpen(false)} className="flex justify-between items-center group">
                <span className="text-3xl font-serif italic text-white group-hover:text-[#D4AF37] transition-colors">Hadith</span>
                <ArrowUpRight className="text-[#D4AF37] opacity-50 group-hover:opacity-100" size={24} />
              </a>

              <div className="h-[1px] w-full bg-white/5" />

              <a href="/chat" onClick={() => setIsMobileMenuOpen(false)} className="flex justify-between items-center group">
                <span className="text-3xl font-serif italic text-white group-hover:text-[#D4AF37] transition-colors">Dashboard</span>
                <User className="text-[#D4AF37] opacity-50 group-hover:opacity-100" size={24} />
              </a>
            </div>

            <div className="mt-auto">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); router.push('/support'); }}
                className="w-full bg-[#D4AF37] text-[#1a2e2a] py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(212,175,55,0.2)] flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                <Heart size={20} className="fill-[#1a2e2a]" />
                Support Mission
              </button>
              <p className="text-center text-white/30 text-[10px] font-bold uppercase tracking-widest mt-6">
                &copy; 2026 Sirat AI · Universal Islamic Hub
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence> 

      <main className="flex-grow">
        
        {/* 1. HERO SECTION - Wahi Hira Sacred Vector Background */}
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center py-20 px-4 overflow-hidden bg-[#071310]">
          
          <div className="absolute inset-0 opacity-40 pointer-events-none flex items-center justify-center overflow-hidden">
            <svg className="w-[1100px] h-[1100px] text-[#D4AF37]" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M300 0L480 350H120L300 0Z" fill="url(#heavenLight)" fillOpacity="0.7" />
              <path d="M300 0L560 400H40L300 0Z" fill="url(#heavenLight)" fillOpacity="0.3" />
              <path d="M0 600V380L120 300L180 330L260 220L340 350L420 270L520 390L600 350V600H0Z" fill="#040b09" />
              <path d="M150 600V350L220 280L280 370L380 250L480 420L600 370V600H150Z" fill="#0b1a16" fillOpacity="0.9" />
              <circle cx="300" cy="290" r="60" fill="#D4AF37" fillOpacity="0.5" filter="blur(20px)" />
              <circle cx="300" cy="290" r="20" fill="#FFF" fillOpacity="0.95" filter="blur(6px)" />
              <defs>
                <linearGradient id="heavenLight" x1="300" y1="0" x2="300" y2="400" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#D4AF37" stopOpacity="1" />
                  <stop offset="1" stopColor="#D4AF37" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D4AF37]/15 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />

          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-20 w-full max-w-4xl text-center"
          >
            <div className="text-center mb-8">
              <p className="font-arabic text-[#D4AF37] text-2xl md:text-3xl font-bold tracking-wide mb-3 leading-loose drop-shadow-lg">
                اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
              </p>
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/90 italic drop-shadow">
                "Read in the name of your Lord who created" (The First Revelation - Surah Al-Alaq 96:1)
              </span>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full shadow-sm mb-10 border border-white/15">
              <Sparkles size={16} className="text-[#D4AF37]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]">Universal Digital Islamic Hub</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 leading-[0.9] font-black tracking-tighter drop-shadow-lg">
              Authentic Knowledge.<br /> 
              <span className="italic text-[#D4AF37]">Universal Guidance.</span>
            </h1>

            <p className="text-emerald-100/90 text-base md:text-xl max-w-2xl mx-auto mb-12 font-medium drop-shadow">
              Explore Al-Quran, authentic Hadith, and reliable Islamic answers. Designed for every believer worldwide, free from divisions.
            </p>

            <div className="relative max-w-2xl mx-auto mb-20 group">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Ask any question about Islam, Quran, or Sunnah..."
                aria-label="Search Islamic knowledge"
                className="w-full py-7 px-10 rounded-[2rem] border-none outline-none focus:ring-4 focus:ring-[#D4AF37]/30 bg-white shadow-2xl text-lg transition-all text-gray-900"
              />
              <button 
                onClick={handleSearch}
                aria-label="Submit search"
                className="absolute right-3 top-3 bottom-3 aspect-square bg-[#1a2e2a] text-[#D4AF37] rounded-[1.5rem] flex items-center justify-center hover:bg-black transition-all"
              >
                <Send size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto px-4">
              <ResourceCard icon={<BookOpen size={24}/>} title="Al-Quran" link="/quran" iconColor="text-emerald-600" />
              <ResourceCard icon={<Scroll size={24}/>} title="Hadith" link="/hadith" iconColor="text-amber-600" />
              <ResourceCard icon={<Book size={24}/>} title="Fiqh & Ethics" link="/fiqh" iconColor="text-sky-600" />
              <ResourceCard icon={<Library size={24}/>} title="Sirat AI" link="/chat" iconColor="text-orange-600" /> 
            </div>
          </motion.div>
        </section>

        {/* 2. DAILY ROOHANI REFLECTION WIDGET (NEW FEATURE) */}
        <section className="bg-[#0d1f1b] py-12 px-6 border-y border-[#D4AF37]/20 relative overflow-hidden">
          <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-10 text-center text-white relative shadow-2xl backdrop-blur-md">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-[#0d1f1b] px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
              Daily Ayah Reflection
            </div>
            <p className="font-arabic text-[#D4AF37] text-xl md:text-2xl font-bold mt-4 mb-3 leading-relaxed">
              وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ
            </p>
            <p className="text-emerald-100/90 text-sm md:text-base italic max-w-2xl mx-auto mb-4">
              "And whoever fears Allah - He will make for him a way out and will provide for him from where he does not expect." (Surah At-Talaq 65:2-3)
            </p>
            <button onClick={() => router.push('/chat?q=Tell me more about Surah At-Talaq verse 2')} className="inline-flex items-center gap-2 text-xs font-bold text-[#D4AF37] hover:underline uppercase tracking-widest">
              Explore Tafsir with AI <ArrowUpRight size={14} />
            </button>
          </div>
        </section>

        {/* 3. COMMUNITY MISSION BANNER */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-[#1a2e2a] text-white py-4 px-6 text-center font-black uppercase tracking-[0.2em] text-[12px] flex flex-col md:flex-row items-center justify-center gap-4 shadow-xl border-b-4 border-[#D4AF37]/30"
        >
          <span className="flex items-center gap-2">
            <Globe size={16} className="text-[#D4AF37]" /> 
            CONNECTING THE GLOBAL UMMAH THROUGH AUTHENTIC KNOWLEDGE
          </span>
          <button 
            onClick={() => router.push('/support')} 
            className="bg-[#D4AF37] text-[#1a2e2a] px-5 py-1.5 rounded-full font-bold hover:brightness-110 transition-colors"
          >
            SUPPORT THE PLATFORM →
          </button>
        </motion.div>

        {/* 4. WHY SIRAT AI? (NEW TRUST & FEATURES SECTION) */}
        <section className="py-24 px-6 bg-[#fdfcf8]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">Uncompromised Authenticity</span>
              <h2 className="text-4xl md:text-5xl font-serif font-black text-[#1A2E2A]">
                Built for the Modern Seeker of Truth
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Every response and citation is thoroughly mapped to verified Quranic verses and Sahih Hadith databases.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all space-y-4 group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#1A2E2A]">Strictly Verified</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  No unverified rumors or weak narrations. All answers are anchored in authentic scholarly consensus.
                </p>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all space-y-4 group">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Compass size={28} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#1A2E2A]">Universal & Non-Sectarian</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  A pure sanctuary welcoming every believer worldwide, focused solely on the core teachings of Islam.
                </p>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all space-y-4 group">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-2xl group-hover:bg-sky-600 group-hover:text-white transition-colors">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#1A2E2A]">Instant Citations</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Get direct Surah and Ayah reference badges in every answer for easy verification and deeper reading.
                </p>
              </div>
            </div>
          </div>
        </section>

        <DonationBanner />

        {/* 5. DAWAH SECTION */}
        <section className="bg-[#1a2e2a] text-white py-32 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="w-12 h-[2px] bg-[#D4AF37]"></span>
                <p className="text-[#D4AF37] font-black uppercase tracking-[0.4em] text-xs">The Digital Minbar</p>
              </div>
              <h2 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
                Dawat-e-Sirat <br/> 
                <span className="text-emerald-400">on YouTube</span>
              </h2>
              <p className="text-emerald-100/70 text-lg max-w-md leading-relaxed">
                Join our global community of seekers. Watch thought-provoking episodes, Tafsir sessions, and heart-softening reminders for everyday life.
              </p>
              <div className="flex gap-4 pt-4">
                <a 
                  href="https://www.youtube.com/@DawahSirat" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#D4AF37] text-[#1a2e2a] px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-white transition-all flex items-center gap-3"
                >
                  <Play size={16} className="fill-[#1a2e2a]" /> Visit Dawah Siraat
                </a>
              </div>
            </div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="relative aspect-video bg-black rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-900/50 border border-white/10"
            >
               <img 
                 src="https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1000" 
                 className="w-full h-full object-cover opacity-50 hover:opacity-70 transition-opacity duration-500" 
                 alt="Dawah Sirat YouTube Channel" 
               />
               <a 
                 href="https://www.youtube.com/@DawahSirat" 
                 target="_blank" 
                 className="absolute inset-0 flex items-center justify-center group"
               >
                 <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 transition-all group-hover:bg-[#D4AF37] group-hover:border-transparent">
                   <Play size={32} className="fill-white ml-2 group-hover:fill-[#1a2e2a]" />
                 </div>
               </a>
               <div className="absolute top-8 left-8 bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                 Subscribe
               </div>
            </motion.div>
          </div>
        </section>

        {/* 6. GLOBAL IMPACT SECTION */}
        <section className="py-20 px-6 bg-[#fdfcf8]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-[#D4AF37] font-black uppercase tracking-[0.4em] text-xs mb-3">Universal Accessibility</p>
              <h2 className="text-3xl md:text-5xl font-serif font-black text-[#1A2E2A]">
                Seeking Guidance Across the Ummah
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ImpactCard 
                icon="🌙" 
                title="Everyday Ethics" 
                count="12,400+" 
                description="Guidance on family values, character, and daily Sunnah etiquette."
                theme={{ bg: "bg-[#FDF6E3]", divider: "bg-[#D4AF37]", dot: "bg-[#D4AF37]", btn: "bg-[#1A2E2A]" }}
              />
              <ImpactCard 
                icon="⚖️" 
                title="Halal & Finance" 
                count="8,200+" 
                description="Transparent calculations and principles for ethical living."
                theme={{ bg: "bg-[#E8F5E9]", divider: "bg-[#2D5A27]", dot: "bg-[#2D5A27]", btn: "bg-[#2D5A27]" }}
              />
              <ImpactCard 
                icon="📜" 
                title="Quran & Hadith" 
                count="25,900+" 
                description="Direct access to verified verses and authentic traditions."
                theme={{ bg: "bg-[#FFF8E1]", divider: "bg-[#D4AF37]", dot: "bg-[#D4AF37]", btn: "bg-[#D4AF37]" }}
              />
            </div>
          </div>
        </section>
      </main>
      
      <Footer/>
    </div>
  );
}

function ResourceCard({ icon, title, link, iconColor }: { icon: React.ReactNode, title: string, link: string, iconColor: string }) {
  return (
    <Link href={link} className="block">
      <motion.div 
        whileHover={{ y: -8 }}
        className="bg-white p-8 rounded-[2.5rem] flex flex-col items-center gap-4 transition-all shadow-sm hover:shadow-xl border border-gray-100 group cursor-pointer"
      >
        <div className={`${iconColor} opacity-90 group-hover:scale-110 transition-transform duration-500`}>
          {icon}
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-black transition-colors">
          {title}
        </h3>
      </motion.div>
    </Link>
  );
}

function ImpactCard({ icon, title, count, description, theme }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-[2rem] border border-[#f0f0f0] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] relative group"
    >
      <div className="mb-6">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${theme.bg}`}>
          {icon}
        </div>
      </div>

      <h3 className="text-2xl font-serif font-bold text-[#1A2E2A] mb-3">{title}</h3>
      <div className="flex items-center gap-2 mb-6">
        <div className={`h-[2px] w-full ${theme.divider}`} />
        <div className={`w-2 h-2 rounded-full ${theme.dot}`} />
        <div className={`h-[2px] w-full ${theme.divider}`} />
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Global Reach</p>
          <div className="text-2xl font-black text-[#1A2E2A]">{count}</div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed max-w-[120px]">{description}</p>
      </div>

      <div className={`absolute right-6 bottom-8 w-12 h-12 rounded-full flex items-center justify-center ${theme.btn} text-white shadow-lg`}>
        <ArrowUpRight size={20} />
      </div>
    </motion.div>
  );
}
