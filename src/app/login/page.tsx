"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Sparkles, ArrowRight, Loader2, BookOpen, Globe, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/chat");
      router.refresh();
    } else {
      alert("Invalid Credentials. Please check your email and password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] flex flex-col md:flex-row overflow-hidden selection:bg-[#D4AF37] selection:text-white">
      
      {/* LEFT SIDE: THE CITY OF KNOWLEDGE VISUAL */}
      <div className="hidden md:flex md:w-1/2 bg-[#1a2e2a] relative flex-col justify-center p-20 text-white overflow-hidden">
        {/* Subtle Islamic Pattern Overlay */}
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
        {/* Divine Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[80px]" />

        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 space-y-8"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full w-fit">
            <Sparkles size={14} className="text-[#D4AF37]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Gateway to Wisdom</span>
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-serif font-black leading-tight tracking-tighter italic">
            Madinat <br />
            <span className="text-[#D4AF37]">al-Ilm.</span>
          </h1>
          
          <p className="text-white/50 text-lg max-w-md leading-relaxed font-medium">
            Step into the digital city of knowledge. A sanctuary where the legacy of the past meets the intelligence of the future.
          </p>

          <div className="flex gap-12 pt-10 border-t border-white/5">
            <div>
              <p className="text-3xl font-serif font-bold italic text-[#D4AF37]">Authentic</p>
              <p className="text-[10px] uppercase font-black tracking-widest opacity-40">Scholarship</p>
            </div>
            <div>
              <p className="text-3xl font-serif font-bold italic text-[#D4AF37]">Global</p>
              <p className="text-[10px] uppercase font-black tracking-widest opacity-40">Impact</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE: CLEAN LOGIN FORM */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-20 relative bg-white">
        {/* Mobile-only logo */}
        <div className="absolute top-8 left-8 md:hidden">
            <span className="text-xl font-black italic tracking-tighter uppercase text-[#1a2e2a]">Sirat<span className="text-[#D4AF37]">.ai</span></span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-12"
        >
          <div className="text-center md:text-left space-y-4">
            <h2 className="text-4xl font-black text-[#1a2e2a] tracking-tight">Access Your Sanctuary</h2>
            <p className="text-gray-400 text-sm font-medium">Please enter your credentials to continue your journey.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              {/* Email */}
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37] transition-colors" size={20} />
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
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37] transition-colors" size={20} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  required
                  className="w-full py-5 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-8 focus:ring-[#D4AF37]/5 focus:bg-white focus:border-[#D4AF37]/30 transition-all text-sm font-medium"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-[#1a2e2a] text-[#D4AF37] py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(26,46,42,0.2)] hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In to Sirat <ArrowRight size={16} /></>}
            </button>
          </form>

          {/* Footer Card Section */}
          <div className="p-6 bg-[#fdfcf8] rounded-3xl border border-gray-50 text-center space-y-4">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              Don't have an account yet?
            </p>
            <button 
              onClick={() => router.push("/register")}
              className="text-[#1a2e2a] font-black hover:text-[#D4AF37] transition-colors text-sm underline decoration-[#D4AF37]/30 underline-offset-4"
            >
              Join the Global Community
            </button>
          </div>
          
          <p className="text-center text-[9px] text-gray-300 font-bold uppercase tracking-[0.3em]">
            &copy; 2026 Sirat · Authentic Neural Wisdom
          </p>
        </motion.div>
      </div>
    </div>
  );
}