"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { motion } from 'framer-motion'; // <--- Animation ke liye
import { 
  Send, BookOpen, Scroll, Book, Library, 
  Play, Home, Sparkles, ArrowUpRight, Heart, Globe
} from 'lucide-react';

export default function SiratLandingPage() {
  const [query, setQuery] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] font-sans selection:bg-[#D4AF37] selection:text-white overflow-x-hidden">
      
      {/* 1. NAVBAR - Glassmorphism */}
      <nav className="bg-[#1a2e2a]/95 backdrop-blur-md text-white px-6 md:px-12 py-5 flex items-center justify-between sticky top-0 z-50 border-b border-white/5 shadow-2xl">
        <motion.div 
          initial={{ x: -20, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-3 group cursor-pointer" 
          onClick={() => router.push('/')}
        >
          <div className="bg-[#D4AF37] p-2 rounded-xl shadow-lg group-hover:rotate-[360deg] transition-transform duration-700">
            <Sparkles size={22} className="text-[#1a2e2a]" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase italic">Sirat<span className="text-[#D4AF37]">.ai</span></span>
        </motion.div>
        
        <div className="hidden lg:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.3em] opacity-70">
          <a href="#" className="hover:text-[#D4AF37] transition-all hover:tracking-[0.4em]">Al-Quran</a>
          <a href="#" className="hover:text-[#D4AF37] transition-all hover:tracking-[0.4em]">Hadith</a>
          <a href="#" className="hover:text-[#D4AF37] transition-all hover:tracking-[0.4em]">Dawah</a>
        </div>

        <button className="bg-[#D4AF37] text-[#1a2e2a] px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 shadow-[0_10px_30px_rgba(212,175,55,0.3)]">
          Support Mission
        </button>
      </nav>

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

          {/* Premium Search Bar */}
          <div className="relative max-w-3xl mx-auto mb-20 group">
            <div className={`absolute -inset-2 bg-[#D4AF37] rounded-full blur-2xl opacity-10 transition-opacity duration-500 ${query ? 'opacity-25' : ''}`}></div>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Sawal poochein... (e.g. Huqooq ul Ibad kya hain?)"
              className="relative w-full py-8 px-12 pr-24 rounded-full border-none outline-none focus:ring-8 focus:ring-[#D4AF37]/5 text-gray-800 bg-white text-xl shadow-[0_40px_100px_rgba(0,0,0,0.07)] transition-all placeholder:text-gray-300"
            />
            <button 
              onClick={handleSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#1a2e2a] hover:bg-[#D4AF37] text-white hover:text-[#1a2e2a] p-5 rounded-full shadow-2xl transition-all active:scale-90 group/btn"
            >
              <Send size={24} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
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

      {/* 3. DAWAH SECTION */}
      <section className="bg-[#1a2e2a] text-white py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              whileInView={{ x: 0, opacity: 1 }}
              initial={{ x: -50, opacity: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <p className="text-[#D4AF37] font-black uppercase tracking-[0.4em] text-xs">The Digital Minbar</p>
              <h2 className="text-5xl md:text-7xl font-serif font-bold leading-tight">Dawat-e-Sirat <br/> on YouTube</h2>
              <p className="text-white/50 text-lg leading-relaxed max-w-lg">
                Visualizing the message of Islam through modern storytelling and authentic scholarship. Subscribe to our journey.
              </p>
              <button className="bg-[#D4AF37] text-[#1a2e2a] px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                Visit Dawah Siraat
              </button>
            </motion.div>

            <div className="relative group">
               <div className="absolute -inset-4 bg-[#D4AF37]/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative aspect-video bg-black rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-500">
                  <img src="https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1000" className="w-full h-full object-cover opacity-40" alt="Dawah" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform cursor-pointer">
                      <Play size={32} className="fill-white ml-2" />
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DONATION PROGRESS */}
      <section className="bg-[#1a2e2a] py-20 px-6">
        <div className="max-w-5xl mx-auto bg-[#fdfcf8] rounded-[4rem] p-12 md:p-20 text-[#1a2e2a] shadow-2xl relative overflow-hidden">
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

            <div className="flex flex-col md:flex-row gap-6">
               <button className="flex-1 bg-[#1a2e2a] text-[#D4AF37] py-6 rounded-3xl font-black text-lg hover:brightness-125 transition-all">Support now</button>
               <button className="flex-1 bg-gray-50 text-[#1a2e2a] py-6 rounded-3xl font-black text-lg hover:bg-gray-100 transition-all border border-gray-100">Share Mission</button>
            </div>
        </div>
      </section> 

      {/* 3.5 THE PULSE OF UMMAH - Real-time Questions Visual */}
<section className="py-32 bg-[#fdfcf8] relative overflow-hidden">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center max-w-3xl mx-auto mb-20">
      <motion.p 
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        className="text-[#D4AF37] font-black uppercase tracking-[0.4em] text-[10px] mb-4"
      >
        Global Impact
      </motion.p>
      <h2 className="text-4xl md:text-6xl font-serif font-black text-[#1a2e2a] leading-tight tracking-tighter">
        Seeking Guidance <br /> Across the <span className="italic text-[#D4AF37]">Ummah.</span>
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { q: "Family Laws & Rights", count: "12k+", icon: "🌙" },
        { q: "Financial Integrity (Zakat)", count: "8k+", icon: "⚖️" },
        { q: "Daily Sunnah & Ethics", count: "25k+", icon: "✨" }
      ].map((item, i) => (
        <motion.div 
          key={i}
          whileHover={{ y: -15, backgroundColor: "#1a2e2a", color: "#fdfcf8" }}
          className="p-12 rounded-[3.5rem] border border-gray-100 bg-white shadow-xl transition-all duration-500 group"
        >
          <div className="text-4xl mb-6">{item.icon}</div>
          <h3 className="text-2xl font-bold mb-2 group-hover:text-[#D4AF37] transition-colors">{item.q}</h3>
          <p className="text-sm font-bold opacity-40 uppercase tracking-widest">{item.count} Questions Solved</p>
          <div className="mt-8 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
             <ArrowUpRight className="text-[#D4AF37]" size={32} />
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>
{/* 3.6 MODERN DAWAH EXPERIENCE */}
<section className="py-32 bg-[#1a2e2a] relative overflow-hidden">
  {/* Background Glows */}
  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
  <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />

  <div className="max-w-7xl mx-auto px-6 relative z-10">
    <div className="flex flex-col lg:flex-row items-center gap-20">
      <div className="lg:w-1/2">
        <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 leading-tight">
          Old Wisdom. <br />
          <span className="text-[#D4AF37]">New Vessels.</span>
        </h2>
        <div className="space-y-8">
          {[
            { t: "Neural Accuracy", d: "Hamara AI engine Sahih Bukhari aur Muslim ke filters se guzarta hai." },
            { t: "Bilingual Soul", d: "Roman Urdu aur English ka mix, jo aaj ki nasal ki zaban hai." },
            { t: "Privacy First", d: "Aapka har sawal aur aapka data amanat hai, jo sirf aapke liye hai." }
          ].map((feat, i) => (
            <div key={i} className="flex gap-6 group">
              <div className="h-12 w-1 shadow-2xl bg-[#D4AF37] group-hover:h-16 transition-all duration-500" />
              <div>
                <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">{feat.t}</h4>
                <p className="text-white/40 text-sm leading-relaxed">{feat.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:w-1/2 relative">
        {/* Floating AI Brain Visual */}
        <div className="relative z-10 p-1 bg-gradient-to-br from-[#D4AF37] to-transparent rounded-[4rem]">
          <div className="bg-[#1a2e2a] p-12 rounded-[3.8rem] text-center">
            <Sparkles size={80} className="text-[#D4AF37] mx-auto mb-8 animate-pulse" />
            <div className="space-y-4 opacity-30 text-xs font-mono text-[#D4AF37]">
              <p>SCANNING SAHIH BUKHARI...</p>
              <p>VERIFYING CHAIN OF NARRATION...</p>
              <p>GENERATING AUTHENTIC RESPONSE...</p>
            </div>
            <div className="mt-8 h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 animate={{ x: ["-100%", "100%"] }}
                 transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                 className="h-full w-1/3 bg-[#D4AF37]" 
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
  );
}

function ResourceCard({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white p-8 rounded-[2.5rem] flex flex-col items-center gap-4 transition-all shadow-sm hover:shadow-2xl border border-gray-50 group cursor-pointer"
    >
      <div className="text-[#1a2e2a] group-hover:text-[#D4AF37] transition-colors duration-500">
        {icon}
      </div>
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a2e2a]">{title}</h3>
    </motion.div>
  );
} 






 



 