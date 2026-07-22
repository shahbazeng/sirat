"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    try {
      const response = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password: password,
        redirect: false,
      });
      if (response?.error) {
        alert("Authentication Error: Invalid email or password.");
      } else {
        router.push("/chat");
        router.refresh();
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Network server connectivity failure. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/chat" });
    } catch (error) {
      console.error("Google Sign In Error:", error);
      alert("Google Authentication Failed.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fdfcf8] flex flex-col md:flex-row overflow-hidden selection:bg-[#D4AF37] selection:text-white">
      {/* SEO Optimized Brand Showcase Section */}
      <section className="hidden md:flex md:w-1/2 bg-[#1a2e2a] relative flex-col justify-center p-20 text-white overflow-hidden" aria-label="Brand Overview">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]" />
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
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Islamic Digital Sanctuary</span>
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-serif font-black leading-tight tracking-tighter italic">
            Madinat <br />
            <span className="text-[#D4AF37]">al-Ilm.</span>
          </h1>
          
          <p className="text-white/50 text-lg max-w-md leading-relaxed font-medium">
            Welcome to Sirat AI. An advanced Islamic AI platform providing instant verified answers from Al-Quran and Sahih Hadith where heritage meets modern intelligence.
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
      </section>

      {/* Authentication Form Section */}
      <section className="flex-1 flex items-center justify-center p-8 md:p-20 relative bg-white" aria-label="Authentication Form">
        <div className="absolute top-8 left-8 md:hidden">
            <span className="text-xl font-black italic tracking-tighter uppercase text-[#1a2e2a]">Sirat<span className="text-[#D4AF37]">.ai</span></span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-10"
        >
          <div className="text-center md:text-left space-y-4">
            <h2 className="text-4xl font-black text-[#1a2e2a] tracking-tight">Access Your Account</h2>
            <p className="text-gray-400 text-sm font-medium">Sign in to continue exploring authentic Islamic wisdom with Sirat AI.</p>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            aria-label="Sign In with Google"
            className="w-full bg-white border border-gray-100 text-gray-600 py-4 rounded-2xl font-bold text-sm hover:border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
          >
            {googleLoading ? <Loader2 className="animate-spin text-[#1a2e2a]" size={20} /> : <FcGoogle size={20} />}
            {googleLoading ? "Connecting..." : "Sign In with Google"}
          </button>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="text-xs text-gray-300 font-medium uppercase">or</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37] transition-colors" size={20} />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required
                  aria-label="Email Address"
                  className="w-full py-5 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-8 focus:ring-[#D4AF37]/5 focus:bg-white focus:border-[#D4AF37]/30 transition-all text-sm font-medium text-gray-900"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37] transition-colors" size={20} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  required
                  aria-label="Password"
                  className="w-full py-5 pl-12 pr-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-8 focus:ring-[#D4AF37]/5 focus:bg-white focus:border-[#D4AF37]/30 transition-all text-sm font-medium text-gray-900"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              aria-label="Sign In to Sirat AI"
              className="w-full bg-[#1a2e2a] text-[#D4AF37] py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(26,46,42,0.2)] hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In to Sirat AI <ArrowRight size={16} /></>}
            </button>
          </form>

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
          
          <footer className="text-center text-[9px] text-gray-300 font-bold uppercase tracking-[0.3em]">
            &copy; 2026 Sirat AI · Authentic Neural Wisdom
          </footer>
        </motion.div>
      </section>
    </main>
  );
}