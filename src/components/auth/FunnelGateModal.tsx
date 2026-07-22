"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FunnelGateModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && name.trim()) {
      setStep(2);
    } else if (step === 2 && email.trim()) {
      localStorage.setItem("sirat_user_name", name);
      localStorage.setItem("sirat_user_email", email);
      onClose();
      router.push('/dashboard');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#040b09]/90 backdrop-blur-md" 
        />

        {/* Modal Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-[#0d1f1b] border border-[#D4AF37]/30 p-8 md:p-12 rounded-[3rem] w-full max-w-md text-center text-white shadow-[0_20px_60px_rgba(212,175,55,0.15)] overflow-hidden"
        >
          {/* Close Button */}
          <button onClick={onClose} className="absolute right-6 top-6 text-white/50 hover:text-white transition-colors">
            <X size={22} />
          </button>

          {/* Top Sparkle Badge */}
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 px-4 py-1.5 rounded-full mb-6 border border-[#D4AF37]/20">
            <Sparkles size={14} className="text-[#D4AF37]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Sirat AI Sanctuary</span>
          </div>

          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-6">
              <h3 className="text-3xl font-serif font-black tracking-tight">
                What should we call you, Momin?
              </h3>
              <p className="text-emerald-100/70 text-sm leading-relaxed">
                Enter your name to personalize your spiritual learning experience across the Ummah.
              </p>
              
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Abdullah / Fatima"
                required
                className="w-full py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-[#D4AF37] transition-all text-center text-lg"
              />

              <button 
                type="submit"
                className="w-full bg-[#D4AF37] text-[#0d1f1b] py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                Continue <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleNext} className="space-y-6">
              <h3 className="text-3xl font-serif font-black tracking-tight">
                JazakAllahu Khair, {name}!
              </h3>
              <p className="text-emerald-100/70 text-sm leading-relaxed">
                Save your progress, bookmarks, and daily AI spiritual insights directly to your portal.
              </p>
              
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-[#D4AF37] transition-all text-center text-lg"
              />

              <button 
                type="submit"
                className="w-full bg-[#D4AF37] text-[#0d1f1b] py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                Enter Sirat Portal <Sparkles size={16} />
              </button>
            </form>
          )}

          {/* Subtle footer note */}
          <p className="text-[10px] text-white/40 uppercase tracking-widest mt-8">
            Secure & Private · Free Forever for the Ummah
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}