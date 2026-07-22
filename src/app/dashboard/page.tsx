"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from 'framer-motion';
import { SessionProvider } from "next-auth/react";
import { 
  Home, Sparkles, Menu, LogOut, BookOpen, Compass, Shield, ChevronLeft, CheckCircle, Scroll, Award, BookOpenCheck, Flame, Landmark, Loader2, RefreshCw 
} from 'lucide-react';

function DashboardContent() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const activeUser = { 
    name: session?.user?.name || "Momin Seeker", 
    email: session?.user?.email || "seeker@sirat.ai" 
  }; 

  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>("Lahore");
  
  const [dhikrCount, setDhikrCount] = useState(0);
  const [dhikrPhrase, setDhikrPhrase] = useState("SubhanAllah");

  // Dynamic Daily Tasks State
  const [tasks, setTasks] = useState([
    { id: 1, text: "Fajr Prayer in Congregation", completed: true },
    { id: 2, text: "Read 1 Ruku of Surah Al-Baqarah", completed: false },
    { id: 3, text: "Morning Dhikr & Istighfar", completed: true },
    { id: 4, text: "Give Sadaqah / Help a brother", completed: false },
  ]);

  // NEW FEATURE: Dynamic Spiritual Reflection & AI Insight State
  const [reflectionIndex, setReflectionIndex] = useState(0);
  const reflections = [
    "“Verily, in the remembrance of Allah do hearts find rest.” (Surah Ar-Ra'd: 28). Your consistency today builds your eternal sanctuary.",
    "“And whoever puts their trust in Allah, He is sufficient for them.” Keep your intentions pure and let Sirat AI assist your daily knowledge journey.",
    "Every small act of goodness recorded in your daily routine multiplies in weight. Stay steadfast on the path of true light.",
    "“Seek knowledge from the cradle to the grave.” Exploring authentic scholarly traditions elevates both mind and soul."
  ];

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

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

  // Dynamic Prayer Timings Integration (Aladhan API)
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

  const completedWeight = Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);

  if (sessionStatus === "loading") {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#fdfcf8] space-y-4">
        <div className="p-4 bg-[#1a2e2a] rounded-2xl shadow-xl border-b-4 border-[#D4AF37]">
          <Landmark className="animate-spin text-[#D4AF37]" size={36} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#fdfcf8] overflow-hidden font-sans text-[#1a2e2a] w-full relative">
      
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden block z-[9998]"
          />
        )}
      </AnimatePresence>

      {/* COMPACT & SLIM SIDEBAR */}
      <aside className={`fixed top-0 bottom-0 left-0 h-full w-64 bg-[#1a2e2a] text-white p-4 flex flex-col shrink-0 lg:relative lg:translate-x-0 transition-all duration-300 ease-in-out z-[9999] ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:w-0 lg:p-0 lg:opacity-0 overflow-hidden'}`}>
        <div className="flex items-center justify-between mb-6 px-2 pt-2">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#D4AF37] rounded-lg">
              <Sparkles size={16} className="text-[#1a2e2a]" />
            </div>
            <span className="text-lg font-black italic tracking-tighter uppercase">Sirat<span className="text-[#D4AF37]">.ai</span></span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} aria-label="Close Sidebar" className="p-1.5 text-white/40 hover:text-white rounded-full lg:hidden">
            <ChevronLeft size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-1 min-h-0 text-sm">
          <button onClick={() => router.push('/')} className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-white/5 opacity-80 font-medium text-left">
            <Home size={16} className="text-[#D4AF37]" /> Home
          </button>
          <button onClick={() => router.push('/quran')} className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-white/5 opacity-80 font-medium text-left">
            <BookOpen size={16} className="text-[#D4AF37]" /> Al-Quran
          </button>
          <button onClick={() => router.push('/hadith')} className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-white/5 opacity-80 font-medium text-left">
            <Scroll size={16} className="text-[#D4AF37]" /> Hadith
          </button>
          <button onClick={() => router.push('/chat')} className="flex items-center gap-3 w-full p-2.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl font-bold text-left">
            <Sparkles size={16} /> AI Chatbot
          </button>
        </div>

        {/* Dynamic Prayer Times Widget */}
        <div className="mb-3 p-3 bg-white/5 rounded-xl border border-white/5 space-y-2 shrink-0 text-xs">
          <p className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
            <Compass size={11} /> Prayers ({locationName})
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            {[
              { label: "Fajr", time: prayerTimes?.Fajr },
              { label: "Dhuhr", time: prayerTimes?.Dhuhr },
              { label: "Asr", time: prayerTimes?.Asr },
              { label: "Maghrib", time: prayerTimes?.Maghrib },
              { label: "Isha", time: prayerTimes?.Isha }
            ].map((p, idx) => (
              <div key={`side-prayer-${idx}`} className="flex justify-between px-2 py-1 bg-[#142320] rounded border border-white/5">
                <span className="opacity-60">{p.label}</span>
                <span className="font-bold text-[#D4AF37]">{p.time ? p.time.split(" ")[0] : "--"}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-2.5 p-2.5 bg-white/5 rounded-xl mb-2 border border-white/5 text-xs">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#1a2e2a] font-bold select-none">
              {activeUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-bold truncate">{activeUser.name}</p>
              <p className="text-[9px] opacity-50 truncate">{activeUser.email}</p>
            </div>
          </div> 
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="flex items-center gap-2.5 w-full p-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-xs font-bold">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full min-w-0 w-full relative overflow-hidden bg-white">
        
        {/* CLEAN TOP NAVBAR */}
        <header className="border-b px-4 md:px-6 py-3 min-h-[65px] w-full flex items-center justify-between relative z-40 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle Sidebar" className={`p-2 rounded-xl text-[#1a2e2a] transition-all hover:bg-gray-100 ${!isSidebarOpen ? 'bg-gray-100' : ''}`}>
              <Menu size={20} />
            </button>
            <div>
              <h1 className="text-xs font-black uppercase tracking-wider text-[#1a2e2a]">Sanctuary Dashboard</h1>
              <p className="text-[10px] text-gray-400">Welcome, {activeUser.name.split(" ")[0]}</p>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 text-[#1a2e2a] px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold">
            2026 EDITION
          </div>
        </header>

        {/* SIMPLIFIED MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#fdfcf8] min-w-0 w-full">
          
          {/* Welcome Banner */}
          <div className="bg-[#1a2e2a] text-white rounded-3xl p-6 relative overflow-hidden shadow-lg border-b-4 border-[#D4AF37]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37]">Spiritual Growth</span>
                <h2 className="text-2xl font-serif font-black italic">The Path of True Light</h2>
                <p className="text-white/60 text-xs">Stay consistent in your daily worship and remembrance.</p>
              </div>
              <button onClick={() => router.push('/chat')} className="bg-[#D4AF37] text-[#1a2e2a] font-black text-[10px] uppercase tracking-wider px-5 py-3 rounded-xl shadow hover:bg-white transition-all">
                Ask AI Bot
              </button>
            </div>
          </div>

          {/* NEW FEATURE: DYNAMIC SPIRITUAL REFLECTION & AI INSIGHT WIDGET */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">
                <Sparkles size={14} /> Daily Spiritual Reflection & Insight
              </div>
              <p className="text-xs md:text-sm font-serif italic text-[#1a2e2a] leading-relaxed">
                {reflections[reflectionIndex]}
              </p>
            </div>
            <button 
              onClick={() => setReflectionIndex((prev) => (prev + 1) % reflections.length)} 
              title="Generate New Insight"
              className="p-3 bg-gray-50 hover:bg-[#D4AF37] hover:text-[#1a2e2a] rounded-xl text-gray-600 transition-all border border-gray-100 shrink-0"
            >
              <RefreshCw size={16} />
            </button>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Amaal Progress</p>
                <h3 className="text-xl font-serif font-black">{completedWeight}% Done</h3>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><Award size={18} /></div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Quran Index</p>
                <h3 className="text-xl font-serif font-black">Juz 15</h3>
              </div>
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><BookOpenCheck size={18} /></div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Streak</p>
                <h3 className="text-xl font-serif font-black">12 Days</h3>
              </div>
              <div className="p-2.5 bg-red-50 text-red-500 rounded-xl"><Flame size={18} /></div>
            </div>

          </div>

          {/* Interactive Tools: Tasbeeh & Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Tasbeeh Vault */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-serif font-black text-[#1a2e2a]">Tasbeeh Counter</h3>
                  <button onClick={rotateDhikr} className="text-[9px] font-black uppercase tracking-widest bg-gray-50 hover:bg-gray-100 text-[#1a2e2a] px-3 py-1.5 rounded-lg border">
                    Switch Phrase
                  </button>
                </div>
                
                <div 
                  onClick={() => setDhikrCount(prev => prev + 1)}
                  className="bg-[#fdfcf8] border border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-[#D4AF37] transition-all select-none space-y-1"
                >
                  <p className="text-2xl font-serif font-bold text-[#1a2e2a]">{dhikrPhrase}</p>
                  <p className="text-5xl font-mono font-black text-[#D4AF37]">{dhikrCount}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-50 text-xs">
                <button onClick={() => setDhikrCount(0)} className="text-red-500 font-bold hover:underline">Reset</button>
                <span className="text-[9px] text-gray-400 uppercase tracking-wider">Tap box to count</span>
              </div>
            </div>

            {/* Daily Habits */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-base font-serif font-black text-[#1a2e2a]">Daily Routine</h3>
                <div className="space-y-2">
                  {tasks.map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => toggleTask(task.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all text-xs font-bold ${task.completed ? 'bg-emerald-50/50 border-emerald-100 text-emerald-900 opacity-60' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                    >
                      <span className={task.completed ? 'line-through' : ''}>{task.text}</span>
                      <CheckCircle size={16} className={task.completed ? 'text-emerald-600' : 'text-gray-300'} />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-[9px] font-black text-center uppercase tracking-widest text-gray-300 border-t pt-3 mt-4">
                Self-Accountability Verified
              </div>
            </div>

          </div>

        </main>
        
        <footer className="py-3 border-t bg-white text-center text-[9px] text-gray-400 font-bold uppercase tracking-wide shrink-0">
          &copy; 2026 Sirat AI · Minimal Sanctuary Architecture
        </footer>

      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <SessionProvider>
      <Suspense fallback={<div className="h-screen flex items-center justify-center font-black uppercase tracking-widest text-[#1a2e2a] opacity-20">Loading...</div>}>
        <DashboardContent />
      </Suspense>
    </SessionProvider>
  );
}
