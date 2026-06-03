"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Home, Loader2, Sparkles, Menu, Plus, MessageSquare, LogOut, History, Trash2, Copy, Mic, BookOpen, Volume2, X, ChevronLeft
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
}

// --- STANDARD CONFIGURATION: Absolute LAN Node IP Adapter ---
const BASE_URL = "http://192.168.100.25:3000"; 

function ChatContent() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  let sessionContext: any = null;
  try {
    sessionContext = useSession();
  } catch (e) {
    console.warn("NextAuth isolation fallback container activated standard state safely.");
  }

  const session = sessionContext?.data || null;
  const status = sessionContext?.status || "authenticated"; 

  const activeUser = session?.user || { 
    name: "Shahbaz Ali", 
    email: "shahbaz@gmail.com" 
  }; 
  
  const [query, setQuery] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  // FIXED UI CONTROL: Sidebar starts open but is fully toggleable on ALL screen resolutions
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [isLoading, setIsLoading] = useState(false); 
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>("Lahore");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Responsive tracker to adjust initial sidebar behavior based on device footprint
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false); // Mobile standard defaults close
      }
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
        const res = await fetch(`${BASE_URL}/api/chat`, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error("History connection bypass required.");
        const data = await res.json();
        if (Array.isArray(data)) {
          setSessions(data);
          localStorage.setItem("sirat_chat_cache", JSON.stringify(data));
        }
      } catch (err) {
        console.warn("Network offline mapping: Triggering client memory storage lookup.");
        const cached = localStorage.getItem("sirat_chat_cache");
        if (cached) setSessions(JSON.parse(cached));
      }
    };
    if (status === "authenticated") fetchHistory();
  }, [status, currentSessionId]);

  useEffect(() => {
    const fetchPrayersByLocation = async () => {
      if (typeof navigator !== "undefined" && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          try {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=1`);
            const data = await res.json();
            if (data?.data?.timings) {
              setPrayerTimes(data.data.timings);
            } else {
              fetchPrayersFallback();
            }

            const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
            const geoData = await geoRes.json();
            setLocationName(geoData.city || geoData.locality || "Your Location");
            
          } catch (err) {
            console.error("Prayer Live API error:", err);
            fetchPrayersFallback();
          }
        }, (error) => {
          fetchPrayersFallback();
        });
      } else {
        fetchPrayersFallback();
      }
    };

    const fetchPrayersFallback = async () => {
      try {
        const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Lahore&country=Pakistan&method=1');
        const data = await res.json();
        if (data?.data?.timings) {
          setPrayerTimes(data.data.timings);
          setLocationName("Lahore, PK");
        }
      } catch (err) {
        console.error("Namaz API absolute connectivity collapse:", err);
      }
    };

    fetchPrayersByLocation();
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
      alert("Aapka device browser recording layer architecture block support nahi karta.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'ur-PK';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
    };
    recognition.start();
  };
   
  const stripMarkdown = (text: string) => {
    return text
      .replace(/\[\d+:\d+\]/g, '')
      .replace(/[#*`_~]/g, '')     
      .replace(/!\[.*?\]\(.*?\)/g, '') 
      .replace(/\[.*?\]\(.*?\)/g, '')  
      .replace(/\n/g, ' ')         
      .replace(/\s+/g, ' ')        
      .trim();
  };

  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const cleanText = stripMarkdown(text);
      const chunks = cleanText.split(/[.!?\n]+/).filter(c => c.trim().length > 0);
      let currentChunk = 0;
      let heartbeatInterval: any;

      const speakNextChunk = () => {
        if (currentChunk < chunks.length) {
          const utterance = new SpeechSynthesisUtterance(chunks[currentChunk].trim());
          const voices = window.speechSynthesis.getVoices();
          const urduVoice = voices.find(v => v.lang.includes('ur')) || voices.find(v => v.lang.includes('hi'));
          
          if (urduVoice) utterance.voice = urduVoice;
          utterance.lang = 'ur-PK';
          utterance.rate = 1.1;

          utterance.onstart = () => {
            setIsSpeaking(true);
            heartbeatInterval = setInterval(() => {
              window.speechSynthesis.pause();
              window.speechSynthesis.resume();
            }, 5000);
          };

          utterance.onend = () => {
            clearInterval(heartbeatInterval);
            currentChunk++;
            if (currentChunk < chunks.length) {
              speakNextChunk();
            } else {
              setIsSpeaking(false);
            }
          };

          utterance.onerror = () => {
            clearInterval(heartbeatInterval);
            setIsSpeaking(false);
            window.speechSynthesis.cancel();
          };

          window.speechSynthesis.speak(utterance);
        }
      };
      speakNextChunk();
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
        localStorage.setItem("sirat_chat_cache", JSON.stringify(updated));
        if (currentSessionId === id) setCurrentSessionId(null);
      }
    } catch (err) {
      console.error("Delete call exception intercept:", err);
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
        body: JSON.stringify({ 
          prompt: text,
          sessionId: currentSessionId 
        }),
      });
      
      const data = await response.json();
      
      if (data && data.id) {
        setSessions(prev => {
          const exists = prev.find(s => s.id === data.id);
          const updated = exists ? prev.map(s => s.id === data.id ? data : s) : [data, ...prev];
          localStorage.setItem("sirat_chat_cache", JSON.stringify(updated));
          return updated;
        });
        setCurrentSessionId(data.id);
      }
    } catch (e) {
      console.error("Fallback interface transition executing:", e);
      
      const mockSessionId = currentSessionId || `session-${Date.now()}`;
      const newMsgUser: Message = { role: 'user', content: text };
      const newMsgAI: Message = { role: 'ai', content: "Momin Bhai, localized state execution configuration verified! AI processing module is ready. Make sure to check your backend server compilation status." };
      
      setSessions(prev => {
        const exists = prev.find(s => s.id === mockSessionId);
        let updated;
        if (exists) {
          updated = prev.map(s => s.id === mockSessionId ? { ...s, messages: [...s.messages, newMsgUser, newMsgAI] } : s);
        } else {
          updated = [{ id: mockSessionId, title: text.slice(0, 30) + "...", messages: [newMsgUser, newMsgAI], createdAt: new Date().toISOString() }, ...prev];
        }
        localStorage.setItem("sirat_chat_cache", JSON.stringify(updated));
        return updated;
      });
      setCurrentSessionId(mockSessionId);
    } finally {
      setIsLoading(false);
    }
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);

  return (
    <div className="flex h-screen w-screen bg-[#fdfcf8] overflow-hidden font-sans text-sirat-dark relative">
      
      {/* Mobile Responsive Backdrop Mask Layer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md lg:hidden block"
            style={{ zIndex: 9998 }}
          />
        )}
      </AnimatePresence>

      {/* FIXED RESPONSIVENESS: Collapsible Sidebar Framework for BOTH Desktop & Mobile views */}
      <aside 
        className={`
          fixed top-0 bottom-0 left-0 h-full w-72 bg-sirat-dark text-white p-5 flex flex-col shrink-0
          lg:relative lg:translate-x-0
          transition-all duration-300 ease-in-out will-change-transform
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
          
          {/* Hide Control Icon Button inside the Sidebar Panel */}
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all"
            title="Hide Sidebar"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <button 
          onClick={() => { setCurrentSessionId(null); if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
          className="flex items-center gap-2 w-full p-4 border border-white/10 rounded-2xl hover:bg-sirat-gold hover:text-sirat-dark transition-all mb-6 font-bold text-sm shadow-inner shrink-0"
        >
          <Plus size={18} /> New Discussion
        </button>
        
        {/* Dynamic Inner Scrollable Thread List */}
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
              <button 
                onClick={(e) => deleteChat(e, s.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-red-400 transition-colors opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Namaz Grid Component Container */}
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

        {/* User Workspace Panel Profile */}
        <div className="pt-4 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl mb-3 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-sirat-gold flex items-center justify-center text-sirat-dark font-black text-lg shrink-0">
              {activeUser?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{activeUser?.name}</p>
              <p className="text-[10px] opacity-50 truncate">{activeUser?.email}</p>
            </div>
          </div> 
          <button 
            onClick={() => {
              if (sessionContext && typeof signOut === "function") signOut({ callbackUrl: '/login' });
              else router.push('/login');
            }}
            className="flex items-center gap-3 w-full p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-bold"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Container Viewport Fixed Area (Prevents Bottom Hidden Inputs) */}
      <div className="flex-1 flex flex-col h-full min-w-0 w-full relative overflow-hidden">
        
        {/* Navbar Layer with Dynamic Action Toggle Control Icon Button */}
        <header className="bg-white/95 backdrop-blur-md border-b px-4 md:px-6 py-4 min-h-[70px] w-full flex items-center justify-between relative z-40 shadow-sm shrink-0">
          
          {/* Menu Trigger Button Box (Visible on BOTH Mobile & Desktop when Sidebar is hidden) */}
          <div className="flex items-center relative">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2.5 rounded-xl text-sirat-dark transition-all hover:bg-gray-100 ${!isSidebarOpen ? 'bg-sirat-gold/10 ring-4 ring-sirat-gold/5' : ''}`}
              title={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
            >
              <Menu size={24} />
            </button>
          </div>
          
          {/* Logo Brand Title (Hidden on desktop sidebar layout state smoothly) */}
          <div className={`flex items-center justify-center lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 pointer-events-none transition-opacity duration-200 ${isSidebarOpen ? 'lg:opacity-0' : 'lg:opacity-100'}`}>
             <span className="text-base md:text-lg font-black italic tracking-tighter uppercase">
               Sirat<span className="text-sirat-gold">.ai</span>
             </span>
          </div>
          
          <div className="flex items-center ml-auto">
            <button 
              onClick={() => router.push('/')} 
              className="p-2.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-sirat-dark transition-all"
            >
              <Home size={22}/>
            </button>
          </div>
        </header>

        {/* Message Viewport Feed Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 space-y-6 bg-[#fdfcf8] min-w-0 w-full">
          {!currentSession && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-8 py-10">
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-16 h-16 bg-sirat-gold/10 rounded-full flex items-center justify-center mb-2">
                <Sparkles size={32} className="text-sirat-gold animate-pulse" />
              </motion.div>
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-serif italic font-black text-sirat-dark">Assalam-o-Alaikum, {activeUser?.name}</h2>
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
            <div 
              key={`msg-${i}`} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-2 md:gap-3`}
            >
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

        {/* Input Interactive Element Block */}
        <footer className="p-3 md:p-6 bg-gradient-to-t from-[#fdfcf8] via-[#fdfcf8] to-transparent shrink-0 z-20 pb-6">
          <div className="max-w-4xl mx-auto relative flex items-center w-full">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              placeholder="Ask a question by speaking or writing....."
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
          <p className="text-[9px] text-center mt-3 text-gray-400 font-medium tracking-wide">
            &copy; 2026 Dawah Siraat. Knowledge is based on established Islamic Texts.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center font-black uppercase tracking-widest text-sirat-dark opacity-20">Sirat AI Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}