"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { motion } from 'framer-motion';
import { 
  User, Mail, Lock, Sparkles, ArrowRight, Loader2, BookOpen, ShieldCheck, Globe 
} from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push("/login?message=Account Created Successfully");
      } else {
        const data = await res.json();
        alert(data.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      alert("Network connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] flex flex-col md:flex-row overflow-hidden selection:bg-[#D4AF37] selection:text-white">
      
      {/* LEFT SIDE: CONCEPTUAL VISUAL */}
      <div className="hidden md:flex md:w-1/2 bg-[#1a2e2a] relative flex-col justify-center p-20 text-white overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 space-y-8"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full w-fit">
            <Globe size={14} className="text-[#D4AF37]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Join the Global Ummah</span>
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-serif font-black leading-tight tracking-tighter italic">
            Seeker of <br />
            <span className="text-[#D4AF37]">Light.</span>
          </h1>

          <div className="p-8 bg-white/5 border-l-2 border-[#D4AF37] rounded-r-3xl space-y-4">
             <BookOpen size={24} className="text-[#D4AF37]" />
             <p className="text-2xl font-serif italic leading-relaxed" dir="rtl">
               وَقُل رَّبِّ زِدْنِي عِلْمًا
             </p>
             <p className="text-sm text-white/60 font-medium tracking-wide">
               "My Lord, increase me in knowledge."
             </p>
          </div>
          
          <p className="text-white/40 text-sm max-w-sm leading-relaxed font-bold uppercase tracking-widest">
            Registration is your first step into the City of Knowledge. Your data is handled with Amanah.
          </p>
        </motion.div>

        {/* Decorative Glow */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[100px]" />
      </div>

      {/* RIGHT SIDE: CLEAN REGISTRATION FORM */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-20 bg-white relative">
        {/* Logo for mobile */}
        <div className="absolute top-8 left-8 md:hidden">
            <span className="text-xl font-black italic tracking-tighter uppercase text-[#1a2e2a]">Sirat<span className="text-[#D4AF37]">.ai</span></span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-10"
        >
          <div className="text-center md:text-left space-y-3">
            <h2 className="text-4xl font-black text-[#1a2e2a] tracking-tight">Create Your Account</h2>
            <p className="text-gray-400 text-sm font-medium">Join 50,000+ seekers worldwide in the pursuit of wisdom.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              {/* Name */}
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required
                  className="w-full py-5 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-8 focus:ring-[#D4AF37]/5 focus:bg-white focus:border-[#D4AF37]/30 transition-all text-sm font-medium"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required
                  className="w-full py-5 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-8 focus:ring-[#D4AF37]/5 focus:bg-white focus:border-[#D4AF37]/30 transition-all text-sm font-medium"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="Create Password" 
                  required
                  className="w-full py-5 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-8 focus:ring-[#D4AF37]/5 focus:bg-white focus:border-[#D4AF37]/30 transition-all text-sm font-medium"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-[#1a2e2a] text-[#D4AF37] py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Initialize Journey <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="p-6 bg-[#fdfcf8] rounded-3xl border border-gray-50 text-center">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3">
              Already a member of the city?
            </p>
            <button 
              onClick={() => router.push("/login")}
              className="text-[#1a2e2a] font-black hover:text-[#D4AF37] transition-colors text-sm underline decoration-[#D4AF37]/30 underline-offset-4"
            >
              Sign In to Your Sanctuary
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 opacity-20">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Privacy Secured</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}