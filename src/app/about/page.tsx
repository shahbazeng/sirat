"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, ShieldCheck, HeartPulse, BookOpen, Users, Compass } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1A2E2A]">
      
      {/* 1. HERO: The Authority Statement */}
      <section className="py-24 px-6 text-center max-w-5xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-serif font-black mb-8">
          The Future of <span className="text-[#D4AF37]">Authenticated</span> Islamic Wisdom.
        </motion.h1>
        <p className="text-xl opacity-70 mb-12">Sirat AI is the world’s first AI-driven platform merging traditional scholarship with advanced neural networks to provide verified, context-aware answers to modern life challenges.</p>
      </section>

      {/* 2. OUR JOURNEY: Solving Complexity */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-serif mb-6">Why Sirat AI Exists</h2>
            <p className="text-lg leading-relaxed mb-6">In the digital age, seeking authentic Islamic knowledge has become overwhelming. Generic AI models often lack the nuance of Fiqh (jurisprudence) and the depth of spiritual context. Sirat AI was built to solve this by creating a bridge between 1400 years of scholarly tradition and cutting-edge artificial intelligence.</p>
            <ul className="space-y-4">
              {['Rigorous Verification', 'Contextual Intelligence', 'User-Centric Ethics'].map(item => (
                <li key={item} className="flex items-center gap-3 font-semibold"><ShieldCheck className="text-[#D4AF37]" /> {item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-[#1A2E2A] p-12 rounded-[2rem] text-white">
            <h3 className="text-2xl text-[#D4AF37] font-serif mb-4">Our Core Philosophy</h3>
            <p className="opacity-80">Knowledge is a trust. We handle that trust by ensuring our AI models are trained on authenticated datasets and validated by a network of traditional scholars, ensuring every answer aligns with the core principles of the faith.</p>
          </div>
        </div>
      </section>

      {/* 3. CORE PILLARS (5 Sections Breakdown) */}
      <section className="py-20 bg-[#FDFCF8]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif mb-16">The Pillars of Sirat</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <BookOpen />, title: "Scholarly Dataset", desc: "Powered by a massive library of verified Tafsir, Hadith, and Fiqh literature." },
              { icon: <Target />, title: "Context Awareness", desc: "Our AI understands modern scenarios, providing solutions that are both traditional and practical." },
              { icon: <Users />, title: "Community Driven", desc: "Built with the needs of the modern Ummah in mind, focusing on real-world questions." }
            ].map((p, i) => (
              <div key={i} className="p-8 border border-gray-200 rounded-3xl hover:shadow-xl transition-all">
                <div className="text-[#D4AF37] mb-6">{p.icon}</div>
                <h4 className="text-xl font-bold mb-4">{p.title}</h4>
                <p className="opacity-70">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. OUR COMMITMENT: Privacy & Ethics */}
      <section className="py-20 bg-[#1A2E2A] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <HeartPulse size={48} className="mx-auto text-[#D4AF37] mb-8" />
          <h2 className="text-4xl font-serif mb-8">Data Ethics & Privacy</h2>
          <p className="text-xl opacity-80 leading-relaxed mb-8">We believe that your search for truth should be private. Sirat AI employs end-to-end encryption for your queries. We do not profile your search habits for commercial gains. Your quest for wisdom remains yours alone.</p>
        </div>
      </section>

      {/* 5. FUTURE ROADMAP (The Vision) */}
      <section className="py-24 max-w-5xl mx-auto px-6 text-center">
        <Compass className="mx-auto text-[#D4AF37] mb-6" size={48} />
        <h2 className="text-4xl font-serif mb-8">Building the Future of Hidayah</h2>
        <p className="text-lg opacity-70 mb-12 max-w-2xl mx-auto">Our roadmap includes multi-language support, real-time fatwa verification modules, and integration with local educational institutions to create the world's most trusted Islamic AI ecosystem.</p>
        <button className="bg-[#1A2E2A] text-white px-10 py-4 rounded-full font-bold hover:bg-[#D4AF37] transition-all">Join Our Mission</button>
      </section>

      {/* SEO Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Sirat AI",
          "description": "Sirat AI is the leading platform for authenticated Islamic wisdom through AI. Learn about our mission, scholarly verification process, and commitment to privacy.",
          "publisher": { "@type": "Organization", "name": "Sirat AI" }
        })}
      </script>
    </div>
  );
};

export default AboutPage;