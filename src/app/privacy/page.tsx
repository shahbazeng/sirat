"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, FileText, Eye, Info, Sparkles } from 'lucide-react';

const PrivacyPolicy = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#1A2E2A] py-20 px-6 relative overflow-hidden">
      {/* Aesthetic Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1A2E2A]/5 rounded-full blur-[120px]" />

      <article className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-block p-3 bg-[#1A2E2A]/5 rounded-2xl mb-6">
            <Sparkles className="text-[#D4AF37]" size={24} />
          </div>
          <h1 className="text-6xl md:text-7xl font-serif font-black mb-6 tracking-tight">Privacy Policy</h1>
          <p className="text-lg opacity-60 font-light">Last updated: June 26, 2026. Your sacred trust is our guiding light.</p>
        </motion.div>

        {/* Sections Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8"
        >
          {[
            { icon: <Info />, title: "Data Transparency", desc: "We collect only what is essential for your spiritual and intellectual quest. Every byte is handled with reverence and precision." },
            { icon: <Lock />, title: "Sacred Encryption", desc: "Your inquiries are protected by military-grade end-to-end encryption. What you ask remains between you and the wisdom of the system." },
            { icon: <Eye />, title: "Zero Profiling", desc: "We reject the modern trend of commercial surveillance. Your journey is private; no ads, no trackers, no third-party data selling." },
            { icon: <FileText />, title: "Complete Control", desc: "You are the master of your history. A single click in your dashboard allows for the permanent deletion of your interaction logs." },
            { icon: <Shield />, title: "Scholarly Integrity", desc: "Behind the AI, our commitment to scholarly ethics ensures that your data is never used to undermine the dignity of the knowledge provided." }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              className="group p-8 bg-white/40 backdrop-blur-md border border-white/50 rounded-[2rem] shadow-xl shadow-[#1A2E2A]/5 hover:bg-white/60 transition-all duration-500"
            >
              <div className="flex items-start gap-6">
                <div className="p-4 bg-[#1A2E2A] text-[#D4AF37] rounded-2xl group-hover:rotate-6 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-serif mb-3 text-[#1A2E2A]">{item.title}</h3>
                  <p className="text-[#1A2E2A]/70 leading-relaxed text-lg">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 p-10 bg-[#1A2E2A] rounded-[2.5rem] text-white text-center shadow-2xl"
        >
          <h4 className="text-2xl font-serif mb-4 text-[#D4AF37]">Need to talk?</h4>
          <p className="text-lg opacity-80 mb-6">Your queries are sacred, and so is your peace of mind.</p>
          <a href="mailto:privacy@sirat.ai" className="inline-block px-8 py-4 bg-white text-[#1A2E2A] rounded-full font-bold hover:bg-[#D4AF37] hover:text-white transition-all">
            privacy@siratai.com
          </a>
        </motion.div>
      </article>

      {/* SEO Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Policy",
          "name": "Sirat AI Privacy Policy",
          "url": "https://siratai/privacy"
        })}
      </script>
    </div>
  );
};

export default PrivacyPolicy;