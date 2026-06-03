"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from 'framer-motion';
import { SessionProvider } from "next-auth/react";
import { 
  Home, Sparkles, Menu, Plus, LogOut, BookOpen, Heart, Compass, Shield, ChevronLeft, Sun, CheckCircle, Scroll, Award, BookOpenCheck, Flame
} from 'lucide-react';

function DashboardContent() {
  const router = useRouter();
  
  // FIXED: Static data pipeline override karke NextAuth hook active kiya hai
  const { data: session, status: sessionStatus } = useSession();

  // Dynamic user context configurations with clean state recovery properties
  const activeUser = { 
    name: session?.user?.name || "Momin Seeker", 
    email: session?.user?.email || "seeker@sirat.ai" 
  }; 

  // --- STATE ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>("Lahore");
  
  // Dhikr Counter Engine State
  const [dhikrCount, setDhikrCount] = useState(0);
  const [dhikrPhrase, setDhikrPhrase] = useState("SubhanAllah");

  // Daily Routine Action Tracker State
  const [tasks, setTasks] = useState([
    { id: 1, text: "Fajr Prayer in Congregation", completed: true },
    { id: 2, text: "Read 1 Ruku of Surah Al-Baqarah", completed: false },
    { id: 3, text: "Morning Dhikr & Istighfar", completed: true },
    { id: 4, text: "Give Sadaqah / Help a brother", completed: false },
  ]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  // FIXED: Unauthenticated states block architecture
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
    }
  }, [sessionStatus, router]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const rotateDhikr = () => {
    const phrases = ["SubhanAllah", "Alhamdulillah", "Allahu Akbar", "Astaghfirullah"];
    const currentIndex = phrases.indexOf(dhikrPhrase);
    const nextIndex = (currentIndex + 1) % phrases.length;
    setDhikrPhrase(phrases[nextIndex]);
    setDhikrCount(0);
  };

  useEffect(() => {
    const fetchPrayers = async () => {
      try {
        const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Lahore&country=Pakistan&method=1');
        const data = await res.json();
        if(data?.data?.timings) setPrayerTimes(data.data.timings);
        setLocationName("Lahore, PK");
      } catch (err) {
        console.error("Prayer fetching issue caught:", err);
      }
    };
    fetchPrayers();
  }, []);

  // Calculate dynamic Imaan-Taqwa progression weight
  const completedWeight = Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);

  // Simple loading gate context sync to prevent flickering layout flashes
  if (sessionStatus === "loading") {
    return <div className="h-screen flex items-center justify-center bg-[#fdfcf8] font-black uppercase tracking-widest text-[#1a2e2a] opacity-30">Verifying Roohani Token Security...</div>;
  }

  return (
    <div className="flex h-screen bg-[#fdfcf8] overflow-hidden font-sans text-[#1a2e2a] w-full relative">
      
      {/* Mobile Sidebar overlay backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md lg:hidden block z-[9998]"
          />
        )}
      </AnimatePresence>

      {/* ================= ROOHANI CONTROL SIDEBAR ================= */}
      <aside className={`fixed top-0 bottom-0 left-0 h-full w-72 bg-[#1a2e2a] text-white p-5 flex flex-col shrink-0 lg:relative lg:translate-x-0 transition-all duration-300 ease-in-out z-[9999] ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:w-0 lg:p-0 lg:opacity-0 overflow-hidden'}`}>
        <div className="flex items-center justify-between mb-8 px-2 pt-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D4AF37] rounded-lg shadow-md">
              <Sparkles size={20} className="text-[#1a2e2a]" />
            </div>
            <span className="text-xl font-black italic tracking-tighter uppercase">Sirat<span className="text-[#D4AF37]">.ai</span></span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full lg:hidden">
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Quick Navigation Gateways inside sidebar */}
        <div className="flex-1 space-y-1.5 min-h-0">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-4 px-2">Navigation Portals</p>
          <button onClick={() => router.push('/')} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 opacity-80 text-sm font-bold text-left">
            <Home size={18} className="text-[#D4AF37]" /> Main Landing Page
          </button>
          <button onClick={() => router.push('/quran')} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 opacity-80 text-sm font-bold text-left">
            <BookOpen size={18} className="text-[#D4AF37]" /> Al-Quran Portal
          </button>
          <button onClick={() => router.push('/hadith')} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 opacity-80 text-sm font-bold text-left">
            <Scroll size={18} className="text-[#D4AF37]" /> Hadith Encyclopedia
          </button>
          <button onClick={() => router.push('/chat')} className="flex items-center gap-3 w-full p-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl text-sm font-black text-left">
            <Sparkles size={18} /> Ask Sirat AI Bot
          </button>
        </div>

        {/* Fixed Prayer Timings Widget */}
        <div className="mb-4 p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3 shrink-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] flex items-center gap-2">
            <Compass size={12} className="animate-spin" style={{ animationDuration: '8s' }} /> Prayers ({locationName})
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {[
              { label: "Fajr", time: prayerTimes?.Fajr },
              { label: "Dhuhr", time: prayerTimes?.Dhuhr },
              { label: "Asr", time: prayerTimes?.Asr },
              { label: "Maghrib", time: prayerTimes?.Maghrib },
              { label: "Isha", time: prayerTimes?.Isha }
            ].map((p, idx) => (
              <div key={`side-prayer-${idx}`} className="flex justify-between p-2 bg-[#142320] rounded-lg border border-white/5">
                <span className="opacity-60">{p.label}</span>
                <span className="font-bold text-[#D4AF37]">{p.time ? p.time.split(" ")[0] : "--:--"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* IDENTITY ALLOCATION PANEL: FIXED TO BE ABSOLUTELY DYNAMIC */}
        <div className="pt-4 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl mb-3 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#1a2e2a] font-black text-lg select-none">
              {activeUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{activeUser.name}</p>
              <p className="text-[10px] opacity-50 truncate">{activeUser.email}</p>
            </div>
          </div> 
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="flex items-center gap-3 w-full p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-bold">
            <LogOut size={18} /> Exit Sanctuary
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT MODULE SPACE ================= */}
      <div className="flex-1 flex flex-col h-full min-w-0 w-full relative overflow-hidden">
        
        {/* TOP INTERACTIVE NAVBAR */}
        <header className="bg-white/95 backdrop-blur-md border-b px-4 md:px-8 py-4 min-h-[75px] w-full flex items-center justify-between relative z-40 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2.5 rounded-xl text-[#1a2e2a] transition-all hover:bg-gray-100 ${!isSidebarOpen ? 'bg-[#D4AF37]/10 ring-4 ring-[#D4AF37]/5' : ''}`}>
              <Menu size={22} />
            </button>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-[#1a2e2a]">Sanctuary Dashboard</h3>
              <p className="text-[10px] text-gray-400 font-medium">Welcome Back, Brother {activeUser.name.split(" ")[0]}</p>
            </div>
          </div>
          <div className="bg-[#1a2e2a] text-white px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider border border-[#D4AF37]/30">
            YEAR: <span className="text-[#D4AF37]">2026 ACTIVE</span>
          </div>
        </header>

        {/* WORKSPACE AREA SCROLL PANEL */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 space-y-8 bg-[#fdfcf8] min-w-0 w-full">
          
          {/* ================= LAYER 1: SPIRITUAL MOTIVATION GRID BANNER ================= */}
          <div className="bg-gradient-to-br from-[#1a2e2a] to-[#142320] text-white rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden shadow-2xl border-b-8 border-[#D4AF37]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')] opacity-[0.03] pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-[#D4AF37]">
                  <Shield size={12} /> True Success Roadmap
                </div>
                <h2 className="text-3xl md:text-5xl font-serif font-black italic tracking-tight">The Path of True Light</h2>
                <p className="text-white/60 text-xs md:text-sm font-medium max-w-xl">
                  "Tum Allah ke naik bande ho {activeUser.name.split(" ")[0]}, bhatkan se bacho aur apna har qadam Sirat-e-Mustaqeem par thamao. Yeh dunia temporary pipeline hai, asal target Aakhirat ki kamyabi hai!"
                </p>
              </div>
              <button onClick={() => router.push('/chat')} className="bg-[#D4AF37] text-[#1a2e2a] font-black text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-xl hover:bg-white transition-all whitespace-nowrap shrink-0 active:scale-95">
                Consult Sirat AI Bot
              </button>
            </div>
          </div>

          {/* ================= LAYER 2: ROOHANI METRICS TRACKER ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amaal Progress</p>
                  <h4 className="text-2xl font-serif font-black italic text-[#1a2e2a]">Daily Taqwa Weight</h4>
                </div>
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><Award size={20} /></div>
              </div>
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="opacity-50">Routine Checklist Sync</span>
                  <span className="text-emerald-600">{completedWeight}% Done</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${completedWeight}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quran Index</p>
                  <h4 className="text-2xl font-serif font-black italic text-[#1a2e2a]"> Tilawat Tracking</h4>
                </div>
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><BookOpenCheck size={20} /></div>
              </div>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-serif font-black text-[#1a2e2a]">Juz 15</span>
                <span className="text-xs font-bold text-gray-400">/ Surah Al-Kahf</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Consistency Engine</p>
                  <h4 className="text-2xl font-serif font-black italic text-[#1a2e2a]">Istiqamah Streak</h4>
                </div>
                <div className="p-2.5 bg-red-50 text-red-500 rounded-xl"><Flame size={20} className="animate-bounce" /></div>
              </div>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-serif font-black text-[#1a2e2a]">12 Days</span>
                <span className="text-xs font-bold text-gray-400">Without missing congregation</span>
              </div>
            </div>

          </div>

          {/* ================= LAYER 3: INTERACTIVE CORE DASHBOARD FEATURES ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between relative group">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-ping" />
                    <h4 className="text-xl font-serif font-black italic text-[#1a2e2a]">Jannat Numa Tasbeeh Vault</h4>
                  </div>
                  <button onClick={rotateDhikr} className="text-[10px] font-black uppercase tracking-widest bg-gray-50 hover:bg-gray-100 text-[#1a2e2a] px-3 py-1.5 rounded-xl border transition-all">
                    Change Phrase
                  </button>
                </div>
                <p className="text-xs text-gray-400 font-medium">Tap anywhere or hit the clicker button to increment your remembrance score metrics.</p>
                
                <div 
                  onClick={() => setDhikrCount(prev => prev + 1)}
                  className="bg-[#fdfcf8] border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center cursor-pointer hover:border-[#D4AF37] active:scale-98 transition-all select-none space-y-2 relative"
                >
                  <p className="text-4xl md:text-5xl font-serif font-black text-[#1a2e2a] tracking-wide">{dhikrPhrase}</p>
                  <p className="text-6xl md:text-7xl font-mono font-black text-[#D4AF37]">{dhikrCount}</p>
                  <p className="text-[9px] font-black uppercase text-gray-300 tracking-widest">Click Box area to trigger +1</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50">
                <button onClick={() => setDhikrCount(0)} className="text-xs font-bold text-red-500 hover:underline">Reset Score</button>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-30 italic">Rewards multiply exponentially</span>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between relative">
              <div className="space-y-4 w-full">
                <div className="space-y-1">
                  <h4 className="text-xl font-serif font-black italic text-[#1a2e2a]">Azaaim & Habit Formations</h4>
                  <p className="text-xs text-gray-400 font-medium">Fulfill your daily covenants with Allah. Complete tasks to elevate weight.</p>
                </div>

                <div className="space-y-2.5 pt-2">
                  {tasks.map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => toggleTask(task.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${task.completed ? 'bg-emerald-50/50 border-emerald-100 text-emerald-900 opacity-60' : 'bg-white border-gray-100 hover:border-gray-300'}`}
                    >
                      <span className={`text-xs md:text-sm font-bold ${task.completed ? 'line-through' : ''}`}>{task.text}</span>
                      <CheckCircle size={18} className={task.completed ? 'text-emerald-600 fill-emerald-100' : 'text-gray-300'} />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-[9px] font-black text-center uppercase tracking-widest text-gray-300 border-t pt-4 mt-6">
                Amanah Audit · Self-Accountability Matrix Verified
              </div>
            </div>

          </div>

          {/* ================= LAYER 4: SECT-AGNOSTIC PORTS ================= */}
          <div className="space-y-4 pt-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 px-2">Access Direct Knowledge Modules</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div onClick={() => router.push('/quran')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:border-[#D4AF37] transition-all flex items-center justify-between group">
                <div className="space-y-1">
                  <h5 className="font-serif font-black text-lg text-[#1a2e2a] group-hover:text-[#D4AF37]">Al-Quran Index</h5>
                  <p className="text-[10px] text-gray-400 font-medium">Read verses with context mapping</p>
                </div>
                <ChevronLeft size={16} className="rotate-180 transform group-hover:translate-x-1 transition-transform text-[#D4AF37]" />
              </div>

              <div onClick={() => router.push('/hadith?type=sunni')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:border-[#D4AF37] transition-all flex items-center justify-between group">
                <div className="space-y-1">
                  <h5 className="font-serif font-black text-lg text-[#1a2e2a] group-hover:text-[#D4AF37]">Sihah-e-Sittah (Sunni)</h5>
                  <p className="text-[10px] text-gray-400 font-medium">6 Primary canonical text reference banks</p>
                </div>
                <ChevronLeft size={16} className="rotate-180 transform group-hover:translate-x-1 transition-transform text-[#D4AF37]" />
              </div>

              <div onClick={() => router.push('/hadith?type=shia')} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:border-[#D4AF37] transition-all flex items-center justify-between group">
                <div className="space-y-1">
                  <h5 className="font-serif font-black text-lg text-[#1a2e2a] group-hover:text-[#D4AF37]">Kutub al-Arba’ah (Shia)</h5>
                  <p className="text-[10px] text-gray-400 font-medium">4 Fundamental reference validation pools</p>
                </div>
                <ChevronLeft size={16} className="rotate-180 transform group-hover:translate-x-1 transition-transform text-[#D4AF37]" />
              </div>
            </div>
          </div>

        </main>
        
        <footer className="py-4 border-t bg-white text-center text-[9px] text-gray-400 font-bold uppercase tracking-wide shrink-0">
          &copy; 2026 Dawah Siraat · Sanctuary Full Stack Ecosystem Validated
        </footer>

      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <SessionProvider>
      <Suspense fallback={<div className="h-screen flex items-center justify-center font-black uppercase tracking-widest text-[#1a2e2a] opacity-20">Sirat AI Sanctuary Loading...</div>}>
        <DashboardContent />
      </Suspense>
    </SessionProvider>
  );
}