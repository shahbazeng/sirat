"use client";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image'; // <--- YE LINE ZAROORI THI JO ERROR FIX KAREGI
import { 
  Send, BookOpen, Scroll, Book, Library, 
  Play, Home, Sparkles, ArrowUpRight, Heart, Globe, User, X, Menu,
  Youtube, Facebook, Twitter, Instagram, ChevronRight, Mail, Phone, MapPin
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
            <button onClick={() => router.push('/support')} className="group relative inline-flex items-center gap-3 bg-[#1a2e2a] px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] text-[#D4AF37] hover:bg-black transition-all active:scale-95 shadow-2xl">
              <Heart size={18} className="fill-[#D4AF37]" />
              Donate now
            </button>
          </div>
        </div>

        {/* Subtle Background Sparkle */}
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
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedSirat");
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem("hasVisitedSirat", "true");
    }
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(query)}`);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail.trim()) return;
    alert("JazakAllahu Khair! Subscription successful.");
    setSubscriberEmail("");
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] font-sans selection:bg-[#D4AF37] selection:text-white overflow-x-hidden flex flex-col justify-between">
      <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />
      
      {/* MOBILE OVERLAY DRAWER PANEL */}
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
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-2">Sirat Platform</p>
              
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
                &copy; 2026 Sirat AI · Authentic Wisdom
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence> 

      <main className="flex-grow">
        {/* 2. HERO SECTION */}
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center py-20 px-4 overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-[#FDFCF8]/70 backdrop-blur-[1px] z-10" />

          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-20 w-full max-w-4xl text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-md px-5 py-2 rounded-full shadow-sm mb-10 border border-white/50">
              <Sparkles size={16} className="text-[#D4AF37]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a2e2a]/70">2026 AI Wisdom Engine</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-serif text-[#1a2e2a] mb-12 leading-[0.9] font-black tracking-tighter">
              Authentic Wisdom.<br /> 
              <span className="italic text-[#D4AF37]">Divine Light.</span>
            </h1>

            <div className="relative max-w-2xl mx-auto mb-20 group">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="What would you like to learn today?"
                className="w-full py-7 px-10 rounded-[2rem] border-none outline-none focus:ring-4 focus:ring-[#D4AF37]/20 bg-white/90 shadow-2xl text-lg transition-all text-gray-900"
              />
              <button 
                onClick={handleSearch}
                className="absolute right-3 top-3 bottom-3 aspect-square bg-[#1a2e2a] text-[#D4AF37] rounded-[1.5rem] flex items-center justify-center hover:bg-black transition-all"
              >
                <Send size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto px-4">
              <ResourceCard icon={<BookOpen size={24}/>} title="Al-Quran" link="/quran" iconColor="text-emerald-600" />
              <ResourceCard icon={<Scroll size={24}/>} title="Hadith" link="/hadith" iconColor="text-amber-600" />
              <ResourceCard icon={<Book size={24}/>} title="Fiqh" link="/fiqh" iconColor="text-sky-600" />
              <ResourceCard icon={<Library size={24}/>} title="Siraat" link="/chat" iconColor="text-orange-600" /> 
            </div>
          </motion.div>
        </section>

        {/* 3. EMERGENCY CHALLENGE BANNER */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-red-600 text-white py-4 px-6 text-center font-black uppercase tracking-[0.2em] text-[12px] flex flex-col md:flex-row items-center justify-center gap-4 shadow-xl border-b-4 border-red-800"
        >
          <span className="flex items-center gap-2">
            <Sparkles size={16} className="text-yellow-300" /> 
            EMERGENCY FUNDRAISING: 7 DAYS REMAINING
          </span>
          <div className="flex gap-4 bg-white/10 text-white px-4 py-1 rounded-full font-mono text-[11px] border border-white/20">
            <span>06d : 23h : 45m</span>
          </div>
          <button 
            onClick={() => router.push('/support')} 
            className="bg-white text-red-600 px-4 py-1 rounded-full font-bold hover:bg-gray-100 transition-colors"
          >
            BECOME A FOUNDING SUPPORTER →
          </button>
        </motion.div>

        <DonationBanner />

        {/* 4. DAWAH SECTION */}
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
                Join our community of seekers. Watch thought-provoking episodes, Tafsir sessions, and heart-softening reminders.
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
                 alt="Dawah Sirat" 
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

        {/* 5. MISSION PROGRESS */}
        <section className="bg-[#1a2e2a] py-24 px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4AF37]/5 blur-[120px] rounded-full -z-10" />

          <div className="max-w-5xl mx-auto bg-[#fdfcf8] rounded-[4rem] p-10 md:p-20 text-[#1a2e2a] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
                <div className="space-y-2">
                  <p className="text-[#D4AF37] font-black uppercase tracking-[0.4em] text-[10px]">Financial Transparency</p>
                  <h2 className="text-5xl md:text-6xl font-serif font-black italic tracking-tighter">Mission Progress</h2>
                </div>
                <button 
                  onClick={() => router.push('/support')}
                  className="bg-[#1a2e2a] text-[#D4AF37] px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-2"
                >
                  <Heart size={14} fill="currentColor" /> Fuel the Mission
                </button>
              </div>

              <div className="space-y-6 mb-16">
                 <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-xs font-black uppercase opacity-40">Goal: $50,000</span>
                      <p className="text-sm font-bold text-gray-400">Server & AI Training Costs</p>
                    </div>
                    <div className="text-right">
                      <span className="text-5xl font-serif italic font-black text-[#1a2e2a]">45%</span>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mt-1">Funds Raised</p>
                    </div>
                 </div>
                 
                 <div className="h-5 bg-gray-100 rounded-full overflow-hidden p-1.5 border border-gray-50 shadow-inner relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '45%' }}
                      transition={{ duration: 2.5, ease: "circOut" }}
                      className="h-full bg-gradient-to-r from-[#1a2e2a] to-[#D4AF37] rounded-full relative"
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </motion.div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-gray-100">
                 <div className="space-y-1">
                    <p className="text-2xl font-serif font-bold italic">$22.5k</p>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Received</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-2xl font-serif font-bold italic">1,240</p>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Backers</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-2xl font-serif font-bold italic">07 Days</p>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Remaining</p>
                 </div>
              </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-[#fdfcf8]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-black text-[#1A2E2A] text-center mb-16">
              Seeking Guidance Across the Ummah
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ImpactCard 
                icon="🌙" 
                title="Family Laws" 
                count="12,400+" 
                description="Nikah, Divorce & Inheritance guidance based on Sharia."
                theme={{ bg: "bg-[#FDF6E3]", divider: "bg-[#D4AF37]", dot: "bg-[#D4AF37]", btn: "bg-[#1A2E2A]" }}
              />
              <ImpactCard 
                icon="⚖️" 
                title="Zakat & Finance" 
                count="8,200+" 
                description="Halal Investment and Zakat calculations verified."
                theme={{ bg: "bg-[#E8F5E9]", divider: "bg-[#2D5A27]", dot: "bg-[#2D5A27]", btn: "bg-[#2D5A27]" }}
              />
              <ImpactCard 
                icon="📜" 
                title="Sunnah Ethics" 
                count="25,900+" 
                description="Daily Adab and Akhlaq from authentic Sahih Hadith."
                theme={{ bg: "bg-[#FFF8E1]", divider: "bg-[#D4AF37]", dot: "bg-[#D4AF37]", btn: "bg-[#D4AF37]" }}
              />
            </div>
          </div>
        </section>
      </main>
      
      <Footer/>

      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcome && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowWelcome(false)}
              className="absolute inset-0 bg-[#0a1a15]/95 backdrop-blur-xl" 
            />

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#0d1f1b] p-10 md:p-16 rounded-[4rem] w-full max-w-lg text-center border border-[#D4AF37]/30 shadow-[0_0_80px_rgba(212,175,55,0.2)] overflow-hidden"
            >
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-6">
                  Assalamu Alaikum, Momin!
                </h2>
                
                <p className="text-emerald-100/80 leading-relaxed mb-10 text-lg italic">
                  Welcome to <span className="text-[#D4AF37] font-bold">Siratai.com</span> — <br/>
                  A digital sanctuary for authentic Islamic wisdom.
                </p>

                <button 
                  onClick={() => { setShowWelcome(false); router.push('/dashboard'); }}
                  className="group relative w-full bg-[#D4AF37] text-[#0a1a15] py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:scale-[1.02] transition-all shadow-[0_10px_30px_rgba(212,175,55,0.3)]"
                >
                  Enter Siratai Portal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Solved</p>
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