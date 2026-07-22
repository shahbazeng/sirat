"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Target, ShieldCheck, HeartPulse, BookOpen, Users, Compass, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AboutClient() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1A2E2A] font-sans">
      
      {/* 1. HERO: The Authority Statement */}
      <section className="py-24 px-6 text-center max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block py-1.5 px-6 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-black uppercase tracking-[0.3em] mb-6 border border-[#D4AF37]/20">
            The Global Sanctuary of Knowledge
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-black mb-8 leading-tight">
            The Future of <span className="text-[#D4AF37] italic">Authenticated</span> Islamic Wisdom.
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
            Sirat AI is the world’s premier AI-driven platform merging traditional scholarly verification with advanced neural networks to provide verified, context-aware answers to modern life challenges.
          </p>
        </motion.div>
      </section>

      {/* 2. OUR JOURNEY: Solving Complexity */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-[#1A2E2A]">
              Why Sirat AI Exists
            </h2>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              In the digital age, seeking authentic Islamic knowledge can be overwhelming. Generic AI models often lack the nuanced depth of Fiqh (jurisprudence) and spiritual context. Sirat AI was built to solve this by creating a reliable bridge between 1400 years of scholarly tradition and cutting-edge artificial intelligence.
            </p>
            <ul className="space-y-3 pt-2">
              {['Rigorous Verification & Scholarly Oversight', 'Contextual Intelligence for Modern Life', 'User-Centric Ethics & Privacy First'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 font-semibold text-sm md:text-base text-gray-800">
                  <ShieldCheck className="text-[#D4AF37] shrink-0" size={20} /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#1A2E2A] p-10 md:p-14 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
              <BookOpen size={180} />
            </div>
            <h3 className="text-2xl text-[#D4AF37] font-serif font-bold mb-4">Our Core Philosophy</h3>
            <p className="text-emerald-100/80 leading-relaxed text-sm md:text-base">
              Knowledge is an sacred trust (Amanah). We handle that trust by ensuring our AI models are trained on authenticated datasets and validated against core scholarly traditions, ensuring every guidance aligns with the pure principles of the faith.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CORE PILLARS */}
      <section className="py-24 bg-[#FDFCF8]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-3 inline-block">Foundation</span>
          <h2 className="text-3xl md:text-5xl font-serif font-black mb-16">The Pillars of Sirat</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <BookOpen size={28} />, title: "Scholarly Dataset", desc: "Powered by a massive structured repository of verified Tafsir, Sahih Hadith, and Fiqh literature." },
              { icon: <Target size={28} />, title: "Context Awareness", desc: "Our AI comprehends modern scenarios, delivering practical solutions firmly rooted in Islamic principles." },
              { icon: <Users size={28} />, title: "Community Driven", desc: "Built specifically for the needs of the global Ummah, focusing on real-world spiritual and ethical questions." }
            ].map((p, i) => (
              <div key={i} className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all text-left flex flex-col justify-between group">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-[#D4AF37] mb-6 group-hover:bg-[#1A2E2A] group-hover:text-[#D4AF37] transition-colors">
                    {p.icon}
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-3">{p.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. OUR COMMITMENT: Privacy & Ethics */}
      <section className="py-24 bg-[#1A2E2A] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <HeartPulse size={48} className="mx-auto text-[#D4AF37]" />
          <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight">Data Ethics & Privacy Sanctuary</h2>
          <p className="text-base md:text-lg text-emerald-100/80 leading-relaxed max-w-2xl mx-auto font-medium">
            We believe that your personal search for truth should remain strictly confidential. Sirat AI employs end-to-end security measures. We never profile your spiritual inquiries or share data for commercial gains.
          </p>
        </div>
      </section>

      {/* 5. FUTURE ROADMAP */}
      <section className="py-28 max-w-5xl mx-auto px-6 text-center">
        <Compass className="mx-auto text-[#D4AF37] mb-6" size={48} />
        <h2 className="text-3xl md:text-5xl font-serif font-black mb-6">Building the Future of Hidayah</h2>
        <p className="text-gray-600 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Our global roadmap includes expanded multi-language support, verified fatwa citation modules, and direct academic integrations to create the world's most trusted Islamic intelligence ecosystem.
        </p>
        <button 
          onClick={() => router.push('/chat')}
          className="bg-[#1A2E2A] text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-[#1A2E2A] transition-all shadow-xl"
        >
          Begin Your Journey Today
        </button>
      </section>

    </div>
  );
}