"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Sparkles, ArrowRight, Loader2, BookOpen } from "lucide-react";

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
        router.push("/login?message=Account Created! Please Login");
      } else {
        const data = await res.json();
        alert(data.error || "Kuch ghalat hua!");
      }
    } catch (err) {
      alert("Network ka masla hai!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center p-6 relative overflow-hidden selection:bg-[#D4AF37] selection:text-white">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_#D4AF3710_0%,_transparent_70%)] -z-10" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#1a2e2a]/5 rounded-full blur-[100px]" />

      <div className="w-full max-w-md relative">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-[#1a2e2a] rounded-2xl shadow-xl mb-4 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Sparkles className="text-[#D4AF37]" size={32} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-[#1a2e2a]">
            Join <span className="text-[#D4AF37]">Sirat.ai</span>
          </h1>
        </div>

        {/* Card Section */}
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-white">
          
          {/* Quranic Verse Section */}
          <div className="text-center mb-8 p-4 bg-[#1a2e2a]/5 rounded-2xl border border-[#D4AF37]/20">
            <div className="flex justify-center mb-2 text-[#D4AF37]">
              <BookOpen size={18} />
            </div>
            <p className="text-xl font-serif text-[#1a2e2a] mb-1 font-bold" dir="rtl">
              وَقُل رَّبِّ زِدْنِي عِلْمًا
            </p>
            <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#1a2e2a]/60">
              "And say: My Lord, increase me in knowledge"
            </p>
            <p className="text-[8px] mt-1 opacity-40 font-bold tracking-widest">[ SURAH TAHA 20:114 ]</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Pura Naam" 
                required 
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 outline-none focus:ring-4 focus:ring-[#D4AF37]/5 focus:border-[#D4AF37]/30 transition-all text-[#1a2e2a] bg-white/50" 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>

            {/* Email Input */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
              <input 
                type="email" 
                placeholder="Email Address" 
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

            {/* Submit Button */}
            <button 
              disabled={loading} 
              className="w-full bg-[#1a2e2a] text-[#D4AF37] py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:brightness-125 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:text-gray-400"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>Register Karein <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Pehle se account hai? {" "}
              <button 
                onClick={() => router.push("/login")} 
                className="text-[#D4AF37] hover:underline"
              >
                Login Karein
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}