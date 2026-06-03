"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react";
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { 
  Send, Home, Loader2, Sparkles, Menu, Plus, MessageSquare, LogOut, History, Trash2, Copy, Mic, BookOpen, Volume2
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

  const status = "authenticated"; 
  const activeUser = { 
    name: "Shahbaz Ali", 
    email: "shahbaz@gmail.com" 
  }; 
  
  const [query, setQuery] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>("Lahore");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const renderFormattedMessage = (content: string) => {
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
        <span key={`text-${i}`} className="inline prose prose-sm max-w-none">
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
    const fetchPrayersByLocation = async () => {
      if (typeof navigator !== "undefined" && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          try {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=1`);
            const data = await res.json();
            if(data?.data?.timings) setPrayerTimes(data.data.timings);

            const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
            const geoData = await geoRes.json();
            setLocationName(geoData.city || geoData.locality || "Your Location");
            
          } catch (err) {
            console.error("Prayer/Geo API error:", err);
            fetchPrayersFallback();
          }
        }, (error) => {
          console.error("Geolocation error:", error);
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
        if(data?.data?.timings) setPrayerTimes(data.data.timings);
        setLocationName("Lahore, PK");
      } catch (err) {
        console.error("Fallback error:", err);
      }
    };

    fetchPrayersByLocation();
  }, []);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Aapka browser voice support nahi karta.");
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

          utterance.onerror = (event) => {
            console.error("TTS Error:", event);
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
        setSessions(prev => prev.filter(s => s.id !== id));
        if (currentSessionId === id) setCurrentSessionId(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/chat`);
        if (!res.ok) return; 
        const data = await res.json();
        if (Array.isArray(data)) {
          setSessions(data);
        }
      } catch (err) {
        console.error("Database fetch error caught gracefully on Native Framework:", err);
      }
    };
    if (status === "authenticated") fetchHistory();
  }, [status]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, isLoading, currentSessionId]);

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
          if (exists) {
            return prev.map(s => s.id === data.id ? data : s);
          }
          return [data, ...prev];
        });
        setCurrentSessionId(data.id);
      }
    } catch (e) {
      console.error("Chat API native connection break:", e);
      
      const mockSessionId = currentSessionId || `mock-${Date.now()}`;
      const newMsgUser: Message = { role: 'user', content: text };
      const newMsgAI: Message = { role: 'ai', content: "Connection Fault: Please double check if your local server terminal is active." };
      
      setSessions(prev => {
        const exists = prev.find(s => s.id === mockSessionId);
        if (exists) {
          return prev.map(s => s.id === mockSessionId ? { ...s, messages: [...s.messages, newMsgUser, newMsgAI] } : s);
        }
        return [{ id: mockSessionId, title: text, messages: [newMsgUser, newMsgAI], createdAt: new Date().toISOString() }, ...prev];
      });
      setCurrentSessionId(mockSessionId);
    } finally {
      setIsLoading(false);
    }
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);

  return (
    <div className="flex h-screen bg-[#fdfcf8] overflow-hidden font-sans text-sirat-dark w-full relative">
      
      {/* ================= 1. FIXED BACKDROP OVERLAY FOR NATIVE MOBILE ================= */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          onTouchStart={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-md lg:hidden block"
          style={{ zIndex: 99998, position: 'fixed' }}
        />
      )}

      {/* ================= 2. PURE NATIVE STANDARDS IOS COMPATIBLE DRAWER ================= */}
      <aside 
        className={`
          fixed top-0 bottom-0 left-0 h-full w-72 bg-sirat-dark text-white p-5 flex flex-col
          lg:relative lg:translate-x-0 lg:shadow-none
          transition-transform duration-300 ease-in-out will-change-transform
          ${isSidebarOpen ? 'translate-x-0 shadow-[15px_0_40px_rgba(0,0,0,0.6)]' : '-translate-x-full'}
        `}
        style={{ zIndex: 99999, position: 'fixed', touchAction: 'pan-y' }}
      >
        {/* Brand Header area */}
        <div className="flex items-center justify-between mb-8 px-2 pt-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sirat-gold rounded-lg shadow-md">
              <Sparkles size={20} className="text-sirat-dark" />
            </div>
            <span className="text-xl font-black italic tracking-tighter uppercase">Sirat<span className="text-sirat-gold">.ai</span></span>
          </div>
          
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            onTouchEnd={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-white/60 hover:text-white bg-white/10 rounded-full transition-all"
            style={{ cursor: 'pointer' }}
          >
            <Plus size={20} className="rotate-45" />
          </button>
        </div>

        <button 
          onClick={() => { setCurrentSessionId(null); setIsSidebarOpen(false); }}
          className="flex items-center gap-2 w-full p-4 border border-white/10 rounded-2xl hover:bg-sirat-gold hover:text-sirat-dark transition-all mb-6 font-bold text-sm shadow-inner"
        >
          <Plus size={18} /> New Discussion
        </button>
        
        {/* Recent History Scroll Window */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-4 px-2 flex items-center gap-2">
            <History size={12}/> Recent History
          </p>
          {sessions.map(s => (
            <div key={s.id} className="group relative">
              <button 
                onClick={() => { setCurrentSessionId(s.id); setIsSidebarOpen(false); }}
                className={`flex items-center gap-3 w-full p-3 rounded-xl text-left text-sm transition-all ${currentSessionId === s.id ? 'bg-sirat-gold text-sirat-dark font-bold' : 'hover:bg-white/5 opacity-70'}`}
              >
                <MessageSquare size={16} className="shrink-0" />
                <span className="truncate pr-6">{s.title}</span>
              </button>
              
              <button 
                onClick={(e) => deleteChat(e, s.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 lg:group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Dynamic Prayer Widget container */}
        <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
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
                <span className="font-bold text-sirat-gold">{p.time || "--:--"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Allocation Segment */}
        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl mb-3 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-sirat-gold flex items-center justify-center text-sirat-dark font-black text-lg">
              {activeUser?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{activeUser?.name}</p>
              <p className="text-[10px] opacity-50 truncate">{activeUser?.email}</p>
            </div>
          </div> 
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-3 w-full p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-bold"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ================= 3. RE-CONFIGURED VIEWPORT INTERFACE (iOS Specific Viewport Fix) ================= */}
      {/* Humne flex-col stack aur absolute height limits ko clear kar diya taake layer events block na hon */}
      <div className="flex-1 flex flex-col h-full min-w-0 w-full relative z-10 overflow-hidden">
        
        {/* ================= FIXED TOP HEADER: LOWERED TO CLEAR NOTCH / DYNAMIC ISLAND ================= */}
        {/* 'pt-12 pb-4 min-h-[90px]' forces the header down past the status bar so it is perfectly responsive and clickable */}
        <header className="bg-white/95 backdrop-blur-md border-b px-6 pt-12 pb-4 min-h-[90px] w-full flex items-center justify-between relative z-50 shadow-sm">
          
          {/* Hamburger Trigger Button Box */}
          <div className="flex items-center lg:hidden relative" style={{ zIndex: 100 }}>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsSidebarOpen(true);
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsSidebarOpen(true);
              }}
              className="p-3 -ml-2 hover:bg-gray-100 active:bg-gray-200 rounded-xl text-sirat-dark block"
              style={{ cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
            >
              <Menu size={26} />
            </button>
          </div>
          
          {/* Logo Brand Title (Middle Dynamic Stack Alignment Fixed) */}
          <div className="flex items-center justify-center lg:hidden absolute left-1/2 top-2/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none mt-1 z-10">
             <span className="text-lg font-black italic tracking-tighter uppercase select-none">
               Sirat<span className="text-sirat-gold">.ai</span>
             </span>
          </div>
          
          {/* Home Icon Action Trigger */}
          <div className="flex items-center ml-auto relative" style={{ zIndex: 100 }}>
            <button 
              onClick={(e) => {
                e.preventDefault();
                router.push('/');
              }} 
              onTouchStart={(e) => {
                e.preventDefault();
                router.push('/');
              }}
              className="p-3 -mr-2 hover:bg-gray-100 active:bg-gray-200 rounded-full text-gray-400 hover:text-sirat-dark transition-all block"
              style={{ cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}
            >
              <Home size={24}/>
            </button>
          </div>
        </header>

        {/* Chat Scrolling Content Matrix */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 bg-[#fdfcf8] z-10">
          {!currentSession && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-10 py-10">
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-20 h-20 bg-sirat-gold/10 rounded-full flex items-center justify-center mb-4">
                <Sparkles size={40} className="text-sirat-gold animate-pulse" />
              </motion.div>
              <div className="space-y-4">
                <h2 className="text-3xl font-serif italic font-black text-sirat-dark">Assalam-o-Alaikum, {activeUser?.name}</h2>
                <p className="text-gray-400 text-sm max-w-sm mx-auto">Islam, Quran aur Hadith ke mutaliq koi bhi sawal poochein.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full px-4">
                {["Quran mein Sabr ka zikr?", "Zakat nikalne ka tariqa?", "Tahajjud ki fazilat", "Aaj ki achi baat"].map((text, idx) => (
                  <button key={`suggest-${idx}`} onClick={() => handleSearch(text)} className="p-4 bg-white border border-gray-100 rounded-2xl text-left text-xs font-bold text-gray-500 hover:border-sirat-gold hover:text-sirat-gold transition-all shadow-sm flex items-center justify-between group">
                    {text} <Plus size={14} className="opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentSession?.messages?.map((msg, i) => (
            <div 
              key={`msg-${i}`} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500`}
            >
              {msg.role === 'ai' && (
                 <div className="w-8 h-8 rounded-lg bg-sirat-gold shrink-0 flex items-center justify-center shadow-md">
                   <Sparkles size={16} className="text-sirat-dark" />
                 </div>
              )}

              <div className={`max-w-[85%] md:max-w-[70%] p-5 md:p-7 shadow-lg transition-all relative group ${
                msg.role === 'user' 
                ? 'bg-sirat-dark text-white rounded-[2rem] rounded-tr-none border-b-4 border-sirat-gold/30' 
                : 'bg-white border border-gray-100 rounded-[2rem] rounded-tl-none text-sirat-dark'
              }`}>
                <div className="prose prose-stone prose-p:leading-relaxed prose-strong:text-sirat-gold max-w-none break-words">
                  {msg.role === 'ai' ? renderFormattedMessage(msg.content) : <ReactMarkdown>{msg.content}</ReactMarkdown>}
                </div>

                {msg.role === 'ai' && (
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 gap-2 flex-wrap">
                    <div className="flex gap-2">
                      <button onClick={() => copyToClipboard(msg.content)} className="flex items-center gap-2 text-[10px] font-bold text-sirat-gold border border-sirat-gold/20 px-3 py-1.5 rounded-full hover:bg-sirat-gold/10 transition-all">
                        <Copy size={12} /> Copy
                      </button>
                      <button onClick={() => speak(msg.content)} className={`flex items-center gap-2 text-[10px] font-bold border px-3 py-1.5 rounded-full transition-all ${isSpeaking ? 'bg-red-50 text-red-500 border-red-200 animate-pulse' : 'text-sirat-gold border-sirat-gold/20 hover:bg-sirat-gold/10'}`}>
                         <Volume2 size={12} /> {isSpeaking ? "Stop" : "Listen"}
                      </button>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-20 italic">Sirat Verified</span>
                  </div>
                )}
              </div>
            </div>
          ))}
            
          {isLoading && (
            <div className="flex gap-4 items-start animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Loader2 size={16} className="animate-spin text-gray-400"/>
              </div>
              <div className="bg-gray-50 border border-dashed border-gray-200 p-6 rounded-[2rem] rounded-tl-none w-[65%]">
                 <div className="h-2 bg-gray-200 rounded w-3/4 mb-3"></div>
                 <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          )}
          <div ref={scrollRef} className="h-4" />
        </main>

        {/* Chat Input Footer Area */}
        <footer className="p-4 md:p-8 bg-gradient-to-t from-[#fdfcf8] via-[#fdfcf8] to-transparent z-20 pb-8">
          <div className="max-w-4xl mx-auto relative group flex items-center">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              placeholder="Ask a question by speaking or writing....."
              className="w-full py-5 px-6 pr-32 rounded-[2rem] border border-gray-200 focus:ring-8 focus:ring-sirat-gold/5 outline-none shadow-2xl transition-all text-sm md:text-base"
            />

            <div className="absolute right-3 flex items-center gap-2">
              <button 
                onClick={startListening}
                className={`p-2.5 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                <Mic size={22} />
              </button>
              <button 
                onClick={() => handleSearch(query)} 
                disabled={isLoading || !query.trim()}
                className="bg-sirat-dark p-3 rounded-full text-white hover:bg-sirat-gold active:bg-sirat-gold transition-all shadow-lg disabled:bg-gray-200"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-center mt-4 text-gray-400 font-medium">
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