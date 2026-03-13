"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Sparkles, ArrowRight, Loader2, BookOpen } from "lucide-react";

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
      alert("Ghalat Email ya Password!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center p-6 relative overflow-hidden selection:bg-[#D4AF37] selection:text-white">
      
      {/* Background Decor - Minimalist Divine Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_#D4AF3708_0%,_transparent_70%)] -z-10" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#1a2e2a]/5 rounded-full blur-[100px]" />

      <div className="w-full max-w-md relative">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-[#1a2e2a] rounded-2xl shadow-xl mb-4 -rotate-3 hover:rotate-0 transition-transform duration-500">
            <Sparkles className="text-[#D4AF37]" size={32} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-[#1a2e2a]">
            Welcome to <span className="text-[#D4AF37]">Sirat.ai</span>
          </h1>
        </div>

        {/* Card Section */}
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-white">
          
          {/* Quranic Verse Section for Knowledge Awareness */}
          <div className="text-center mb-8 p-5 bg-[#1a2e2a]/5 rounded-2xl border border-[#D4AF37]/20">
            <div className="flex justify-center mb-2 text-[#D4AF37]">
              <BookOpen size={18} />
            </div>
            <p className="text-xl font-serif text-[#1a2e2a] mb-1 font-bold leading-relaxed" dir="rtl">
              هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ
            </p>
            <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-[#1a2e2a]/60 mt-2">
              "Are those who know equal to those who do not know?"
            </p>
            <p className="text-[8px] mt-1 opacity-40 font-bold tracking-widest uppercase text-[#1a2e2a]">
              [ SURAH AZ-ZUMAR 39:9 ]
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
              <input 
                type="email" 
                placeholder="Apna Email" 
                required 
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 outline-none focus:ring-4 focus:ring-[#D4AF37]/5 focus:border-[#D4AF37]/30 transition-all text-[#1a2e2a] bg-white/50" 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                required 
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 outline-none focus:ring-4 focus:ring-[#D4AF37]/5 focus:border-[#D4AF37]/30 transition-all text-[#1a2e2a] bg-white/50" 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>

            {/* Login Button */}
            <button 
              disabled={loading} 
              className="w-full bg-[#1a2e2a] text-[#D4AF37] py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:brightness-125 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:text-gray-400"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>Dakhil Hon <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Card Footer */}
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Account nahi hai? {" "}
              <button 
                onClick={() => router.push("/register")} 
                className="text-[#D4AF37] font-black hover:underline transition-all"
              >
                Register Karein
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}