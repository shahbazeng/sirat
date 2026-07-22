"use client";

import { useRouter } from 'next/navigation';
import { useSession, signOut, SessionProvider } from "next-auth/react";
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, Suspense, useRef } from 'react';
import { 
  Send, Home, Loader2, Sparkles, Menu, Plus, MessageSquare, LogOut, History, Trash2, Copy, Mic, BookOpen, Volume2, ChevronLeft, User, Heart, X, ArrowRight
} from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  userId?: string;
  userEmail?: string;
}

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "";
function ChatContent() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: session, status } = useSession();

  const activeUser = {
    name: session?.user?.name || "Momin Seeker",
    email: session?.user?.email || "seeker@sirat.ai"
  };
  
  const [query, setQuery] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [isLoading, setIsLoading] = useState(false); 
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>("Lahore");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const userCacheKey = `sirat_chat_cache_${activeUser.email.replace(/[^a-zA-Z0-9]/g, "_")}`;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  const renderFormattedMessage = (content: string) => {
    if (!content) return null;
    const parts = content.split(/(\[\d+:\d+\])/g);
    return parts.map((part, i) => {
      if (part.match(/(\[\d+:\d+\])/)) {
        const match = part.match(/\[(\d+):(\d+)\]/);
        if (match) {
          const surahId = match[1];
          const ayahId = match[2];
          return (
            <button 
              key={`btn-${surahId}-${ayahId}-${i}`}
              onClick={() => router.push(`/quran/${surahId}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-sirat-gold/20 text-sirat-gold rounded-lg font-black text-[10px] mx-1 hover:bg-sirat-gold hover:text-sirat-dark transition-all border border-sirat-gold/30 mb-1"
            >
              <BookOpen size={10} /> Surah {surahId}:{ayahId}
            </button>
          );
        }
      }
      return (
        <span key={`text-${i}`} className="inline prose prose-sm max-w-none break-words">
          <ReactMarkdown>{part}</ReactMarkdown>
        </span>
      );
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const q = urlParams.get('q');
      if (q && status === "authenticated") {
        handleSearch(q);
        router.replace('/chat');
      }
    }
  }, [status]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/chat`, { 
          method: 'GET',
          credentials: 'include' 
        });
        if (!res.ok) throw new Error("History security sync intercept.");
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const strictlyFilteredChats = data.filter((s: ChatSession) => s.userEmail === activeUser.email);
          setSessions(strictlyFilteredChats);
          localStorage.setItem(userCacheKey, JSON.stringify(strictlyFilteredChats));
        }
      } catch (err) {
        const cached = localStorage.getItem(userCacheKey);
        if (cached) {
          setSessions(JSON.parse(cached));
        } else {
          setSessions([]); 
        }
      }
    };
    
    if (status === "authenticated" && session?.user?.email && activeUser.email !== "seeker@sirat.ai") {
      fetchHistory();
    } else if (status === "authenticated" && !session?.user?.email) {
      setSessions([]);
    }
  }, [status, currentSessionId, userCacheKey, activeUser.email]);

  useEffect(() => {
    const fetchPrayers = async () => {
      try {
        const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Lahore&country=Pakistan&method=1');
        const data = await res.json();
        if (data?.data?.timings) {
          setPrayerTimes(data.data.timings);
          setLocationName("Lahore, PK");
        }
      } catch (err) {
        console.error("Namaz API Error:", err);
      }
    };
    fetchPrayers();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  }, [sessions, isLoading, currentSessionId]);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Aapka device support nahi karta.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'ur-PK';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      setQuery(event.results[0][0].transcript);
    };
    recognition.start();
  };
   
  const stripMarkdown = (text: string) => {
    return text.replace(/\[\d+:\d+\]/g, '').replace(/[#*`_~]/g, '').replace(/\n/g, ' ').trim();
  };

  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const cleanText = stripMarkdown(text);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'ur-PK';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Jawab copy ho gaya!");
  };

  const deleteChat = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Kya aap ye chat delete karna chahte hain?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/chat?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        const updated = sessions.filter(s => s.id !== id);
        setSessions(updated);
        localStorage.setItem(userCacheKey, JSON.stringify(updated));
        if (currentSessionId === id) setCurrentSessionId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setQuery("");
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          prompt: text, 
          sessionId: currentSessionId,
          userEmail: activeUser.email 
        }),
      });
      const data = await response.json();
      if (data && data.id) {
        setSessions(prev => {
          const updated = prev.find(s => s.id === data.id) ? prev.map(s => s.id === data.id ? data : s) : [data, ...prev];
          localStorage.setItem(userCacheKey, JSON.stringify(updated));
          return updated;
        });
        setCurrentSessionId(data.id);
      }
    } catch (e) {
      const mockSessionId = currentSessionId || `session-${Date.now()}`;
      const newMsgUser: Message = { role: 'user', content: text };
      const newMsgAI: Message = { role: 'ai', content: "Momin Bhai, network connection dynamic loop fallback state checked. Please verify terminal database deployment status." };
      setSessions(prev => {
        const updated = prev.find(s => s.id === mockSessionId) ? prev.map(s => s.id === mockSessionId ? { ...s, messages: [...s.messages, newMsgUser, newMsgAI] } : s) : [{ id: mockSessionId, title: text.slice(0, 30) + "...", messages: [newMsgUser, newMsgAI], createdAt: new Date().toISOString(), userEmail: activeUser.email }, ...prev];
        localStorage.setItem(userCacheKey, JSON.stringify(updated));
        return updated;
      });
      setCurrentSessionId(mockSessionId);
    } finally {
      setIsLoading(false);
    }
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);

  if (status === "loading") {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#071310] relative overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-[#D4AF37]/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="relative flex flex-col items-center gap-6 z-10">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
            <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#b38b4d] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] animate-pulse">
              <svg className="w-5 h-5 text-[#071310]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="font-arabic text-[#D4AF37] text-xl font-bold tracking-wider">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-100/70 animate-pulse">
              Synchronizing Momin Session Token...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-[#fdfcf8] overflow-hidden font-sans text-sirat-dark relative">
      
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md lg:hidden block z-[9998]"
          />
        )}
      </AnimatePresence>

      {/* ================= DYNAMIC SIDEBAR INTERFACE ================= */}
      <aside 
        className={`
          fixed top-0 bottom-0 left-0 h-full w-72 bg-sirat-dark text-white p-5 flex flex-col shrink-0
          lg:relative lg:translate-x-0 transition-all duration-300 ease-in-out will-change-transform
          ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:p-0 lg:opacity-0 overflow-hidden'}
        `}
        style={{ zIndex: 9999 }}
      >
        <div className="flex items-center justify-between mb-8 px-2 pt-6 lg:pt-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sirat-gold rounded-lg shadow-md">
              <Sparkles size={20} className="text-sirat-dark" />
            </div>
            <span className="text-xl font-black italic tracking-tighter uppercase">Sirat<span className="text-sirat-gold">.ai</span></span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full lg:hidden">
            <ChevronLeft size={20} />
          </button>
        </div>

        <button 
          onClick={() => { setCurrentSessionId(null); if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
          className="flex items-center gap-2 w-full p-4 border border-white/10 rounded-2xl hover:bg-sirat-gold hover:text-sirat-dark transition-all mb-6 font-bold text-sm shadow-inner shrink-0"
        >
          <Plus size={18} /> New Discussion
        </button>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar min-h-0">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-4 px-2 flex items-center gap-2 sticky top-0 bg-sirat-dark py-1 z-10">
            <History size={12}/> Recent History
          </p>
          {sessions.map(s => (
            <div key={s.id} className="group relative">
              <button 
                onClick={() => { setCurrentSessionId(s.id); if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
                className={`flex items-center gap-3 w-full p-3 rounded-xl text-left text-sm transition-all ${currentSessionId === s.id ? 'bg-sirat-gold text-sirat-dark font-bold' : 'hover:bg-white/5 opacity-70'}`}
              >
                <MessageSquare size={16} className="shrink-0" />
                <span className="truncate pr-6">{s.title}</span>
              </button>
              <button onClick={(e) => deleteChat(e, s.id)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-red-400 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Prayers Tracking Panel */}
        <div className="mb-4 p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3 shrink-0 mt-4">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
            <Sparkles size={12} className="text-sirat-gold" /> Prayer Times ({locationName})
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {[
              { label: "Fajr", time: prayerTimes?.Fajr },
              { label: "Dhuhr", time: prayerTimes?.Dhuhr },
              { label: "Asr", time: prayerTimes?.Asr },
              { label: "Maghrib", time: prayerTimes?.Maghrib },
              { label: "Isha", time: prayerTimes?.Isha }
            ].map((p, idx) => (
              <div key={`prayer-${idx}`} className="flex justify-between p-2 bg-sirat-dark/50 rounded-lg border border-white/5">
                <span className="opacity-60">{p.label}</span>
                <span className="font-bold text-sirat-gold">{p.time ? p.time.split(" ")[0] : "--:--"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PROFILE CARD & INTERACTIVE DROPDOWN */}
        <div className="pt-4 border-t border-white/10 shrink-0 relative">
          
          <AnimatePresence>
            {isProfileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-20 left-0 right-0 bg-[#0d1f1b] border border-[#D4AF37]/30 rounded-2xl p-2 shadow-2xl z-50 space-y-1 text-white"
              >
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <p className="text-xs font-bold text-[#D4AF37]">Ummah Tier</p>
                  <p className="text-[10px] opacity-60">Verified Seeker Plan</p>
                </div>
                
                <button 
                  onClick={() => { setIsProfileMenuOpen(false); setIsProfileModalOpen(true); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-bold hover:bg-white/10 transition-all text-left"
                >
                  <User size={14} className="text-[#D4AF37]" /> View Profile Details
                </button>
                
                <button 
                  onClick={() => { setIsProfileMenuOpen(false); router.push('/support'); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-bold hover:bg-white/10 transition-all text-left text-[#D4AF37]"
                >
                  <Heart size={14} className="fill-[#D4AF37]" /> Support & Donations
                </button>

                <div className="h-[1px] bg-white/10 my-1" />

                <button 
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all text-left"
                >
                  <LogOut size={14} /> Exit Sanctuary
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-2xl mb-3 border border-white/5 cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-sirat-gold flex items-center justify-center text-sirat-dark font-black text-lg shrink-0 select-none shadow-md group-hover:scale-105 transition-transform">
              {activeUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold truncate">{activeUser.name}</p>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Active Seeker" />
              </div>
              <p className="text-[10px] opacity-50 truncate">{activeUser.email}</p>
            </div>
            <ChevronLeft size={16} className={`text-white/40 group-hover:text-white transition-transform -rotate-90 ${isProfileMenuOpen ? 'rotate-90' : ''}`} />
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTAINER VIEWPORT ================= */}
      <div className="flex-1 flex flex-col h-full min-w-0 w-full relative overflow-hidden">
        
        <header className="bg-white/95 backdrop-blur-md border-b px-4 md:px-6 py-4 min-h-[70px] w-full flex items-center justify-between relative z-40 shadow-sm shrink-0">
          <div className="flex items-center relative">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2.5 rounded-xl text-sirat-dark transition-all hover:bg-gray-100 ${!isSidebarOpen ? 'bg-sirat-gold/10 ring-4 ring-sirat-gold/5' : ''}`}
            >
              <Menu size={24} />
            </button>
          </div>
          
          <div className={`flex items-center justify-center lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 pointer-events-none transition-opacity duration-200 ${isSidebarOpen ? 'lg:opacity-0' : 'lg:opacity-100'}`}>
             <span className="text-base md:text-lg font-black italic tracking-tighter uppercase">
               Sirat<span className="text-sirat-gold">.ai</span>
             </span>
          </div>
          
          <div className="flex items-center ml-auto">
            <button onClick={() => router.push('/dashboard')} className="p-2.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-sirat-dark transition-all">
              <Home size={22}/>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 space-y-6 bg-[#fdfcf8] min-w-0 w-full">
          {!currentSession && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-8 py-10">
              <div className="w-16 h-16 bg-sirat-gold/10 rounded-full flex items-center justify-center mb-2">
                <Sparkles size={32} className="text-sirat-gold animate-pulse" />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-serif italic font-black text-sirat-dark">Assalam-o-Alaikum, {activeUser.name}</h2>
                <p className="text-gray-400 text-xs md:text-sm max-w-sm mx-auto">Islam, Quran aur Hadith ke mutaliq koi bhi sawal poochein.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full px-2">
                {["Quran mein Sabr ka zikr?", "Zakat nikalne ka tariqa?", "Tahajjud ki fazilat", "Aaj ki achi baat"].map((text, idx) => (
                  <button key={`suggest-${idx}`} onClick={() => handleSearch(text)} className="p-4 bg-white border border-gray-100 rounded-2xl text-left text-xs font-bold text-gray-500 hover:border-sirat-gold hover:text-sirat-gold transition-all shadow-sm flex items-center justify-between group break-words">
                    <span className="pr-2">{text}</span> 
                    <Plus size={14} className="opacity-0 group-hover:opacity-100 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentSession?.messages?.map((msg, i) => (
            <div key={`msg-${i}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-2 md:gap-3`}>
              {msg.role === 'ai' && (
                 <div className="w-8 h-8 rounded-lg bg-sirat-gold shrink-0 flex items-center justify-center shadow-md mt-1">
                   <Sparkles size={14} className="text-sirat-dark" />
                 </div>
              )}

              <div className={`max-w-[88%] sm:max-w-[80%] md:max-w-[70%] p-4 md:p-6 shadow-md transition-all relative ${
                msg.role === 'user' 
                ? 'bg-sirat-dark text-white rounded-[1.75rem] rounded-tr-none border-b-4 border-sirat-gold/30' 
                : 'bg-white border border-gray-100 rounded-[1.75rem] rounded-tl-none text-sirat-dark'
              }`}>
                <div className="prose prose-sm md:prose-base prose-stone prose-p:leading-relaxed prose-strong:text-sirat-gold max-w-none break-words overflow-x-auto">
                  {msg.role === 'ai' ? renderFormattedMessage(msg.content) : <ReactMarkdown>{msg.content}</ReactMarkdown>}
                </div>

                {msg.role === 'ai' && (
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 gap-2 flex-wrap">
                    <div className="flex gap-1.5">
                      <button onClick={() => copyToClipboard(msg.content)} className="flex items-center gap-1 text-[10px] font-bold text-sirat-gold border border-sirat-gold/20 px-2.5 py-1 rounded-full hover:bg-sirat-gold/10 transition-all">
                        <Copy size={10} /> Copy
                      </button>
                      <button onClick={() => speak(msg.content)} className={`flex items-center gap-1 text-[10px] font-bold border px-2.5 py-1 rounded-full transition-all ${isSpeaking ? 'bg-red-50 text-red-500 border-red-200' : 'text-sirat-gold border-sirat-gold/20 hover:bg-sirat-gold/10'}`}>
                         <Volume2 size={10} /> {isSpeaking ? "Stop" : "Listen"}
                      </button>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-20 italic">Sirat Verified</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 items-start animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <Loader2 size={14} className="animate-spin text-gray-400"/>
              </div>
              <div className="bg-gray-50 border border-dashed border-gray-200 p-5 rounded-[1.75rem] rounded-tl-none w-[70%] sm:w-[50%]">
                 <div className="h-2 bg-gray-200 rounded w-3/4 mb-3"></div>
                 <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          )}
          <div ref={scrollRef} className="h-2" />
        </main>

        <footer className="p-3 md:p-6 bg-gradient-to-t from-[#fdfcf8] via-[#fdfcf8] to-transparent shrink-0 z-20 pb-6">
          <div className="max-w-4xl mx-auto relative flex items-center w-full">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              placeholder="Ask Siraat AI anything regarding Islamic guidance..."
              className="w-full py-4 md:py-5 px-5 md:px-6 pr-28 rounded-[1.75rem] border border-gray-200 focus:ring-4 focus:ring-sirat-gold/5 outline-none shadow-xl transition-all text-xs md:text-sm bg-white"
            />

            <div className="absolute right-2.5 flex items-center gap-1 md:gap-1.5">
              <button 
                onClick={startListening}
                className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                <Mic size={20} />
              </button>
              <button 
                onClick={() => handleSearch(query)} 
                disabled={isLoading || !query.trim()}
                className="bg-sirat-dark p-2.5 rounded-full text-white hover:bg-sirat-gold active:bg-sirat-gold transition-all shadow-md disabled:bg-gray-200 shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
          <p className="text-[9px] text-center mt-3 text-gray-400 font-bold tracking-wide uppercase">
            &copy; 2026 Dawah Siraat · Verified Knowledge Environment
          </p>
        </footer>
      </div>

      {/* ================= VIEW PROFILE DETAILS MODAL ================= */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute inset-0 bg-[#040b09]/90 backdrop-blur-md" 
            />

            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#0d1f1b] border border-sirat-gold/30 p-8 md:p-10 rounded-[3rem] w-full max-w-md text-center text-white shadow-2xl overflow-hidden"
            >
              <button onClick={() => setIsProfileModalOpen(false)} className="absolute right-6 top-6 text-white/50 hover:text-white transition-colors">
                <X size={22} />
              </button>

              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sirat-gold to-amber-600 flex items-center justify-center text-sirat-dark font-black text-3xl mx-auto mb-4 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                {activeUser.name.charAt(0).toUpperCase()}
              </div>

              <h3 className="text-2xl font-serif font-black tracking-tight mb-1">
                {activeUser.name}
              </h3>
              <p className="text-sirat-gold text-xs font-bold tracking-widest uppercase mb-6">
                Verified Ummah Seeker
              </p>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3 text-left mb-6 text-xs">
                <div className="flex justify-between">
                  <span className="opacity-60">Email Account:</span>
                  <span className="font-bold text-sirat-gold">{activeUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Platform Access:</span>
                  <span className="font-bold text-emerald-400">Full Access (Free Tier)</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Database Protocol:</span>
                  <span className="font-bold">Secure Local & Cloud Sync</span>
                </div>
              </div>

              <button 
                onClick={() => setIsProfileModalOpen(false)}
                className="w-full bg-sirat-gold text-sirat-dark py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:brightness-110 transition-all shadow-lg"
              >
                Close Profile
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function ChatPage() {
  return (
    <SessionProvider>
      <Suspense fallback={
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#071310] relative overflow-hidden">
          <div className="absolute w-[500px] h-[500px] bg-[#D4AF37]/10 blur-[140px] rounded-full pointer-events-none" />
          <div className="relative flex flex-col items-center gap-6 z-10">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#b38b4d] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] animate-pulse">
                <svg className="w-5 h-5 text-[#071310]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-100/70 animate-pulse">
              Sirat AI Loading...
            </p>
          </div>
        </div>
      }>
        <ChatContent />
      </Suspense>
    </SessionProvider>
  );
}

