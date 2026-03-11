"use client";

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import ReactMarkdown from 'react-markdown';
import { 
  Send, Home, Loader2, Sparkles, User, Menu, Plus, MessageSquare, LogOut, History, Trash2, Copy, Mic
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

function ChatContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
const [prayerTimes, setPrayerTimes] = useState<any>(null);

useEffect(() => {
  const fetchPrayers = async () => {
    try {
      // Lahore ke liye Prayer Times fetch karna
      const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Lahore&country=Pakistan&method=1');
      const data = await res.json();
      setPrayerTimes(data.data.timings);
    } catch (err) {
      console.error("Prayer API error:", err);
    }
  };
  fetchPrayers();
}, []);

const [isListening, setIsListening] = useState(false);

const startListening = () => {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    alert("Aapka browser voice support nahi karta. Chrome ya Edge use karein.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'ur-PK'; // Urdu support

  recognition.onstart = () => setIsListening(true);
  recognition.onend = () => setIsListening(false);

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    setQuery(transcript);
  };

  recognition.start();
};
 






const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  alert("Jawab copy ho gaya!"); // Aap isay toast notification se bhi badal sakte hain
};


const deleteChat = async (e: React.MouseEvent, id: string) => {
  e.stopPropagation(); // Is se chat select nahi hogi, sirf delete hogi
  if (!confirm("Kya aap ye chat delete karna chahte hain?")) return;

  try {
    const res = await fetch(`/api/chat?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setSessions(prev => prev.filter(s => s.id !== id));
      if (currentSessionId === id) setCurrentSessionId(null);
    }
  } catch (err) {
    console.error("Delete error:", err);
  }
};
  // 1. Auth Guard: Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  // 2. Load History from Database
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/chat');
        const data = await res.json();
        if (Array.isArray(data)) {
          setSessions(data);
          // Agar URL mein query nahi hai, toh latest chat khol dein
          if (data.length > 0 && !searchParams.get('q')) {
            setCurrentSessionId(data[0].id);
          }
        }
      } catch (err) {
        console.error("Database fetch error:", err);
      }
    };
    if (status === "authenticated") fetchHistory();
  }, [status]);

  // 3. Handle Initial Query from Home
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && status === "authenticated") {
      handleSearch(q);
      // Clean URL after starting chat
      router.replace('/chat');
    }
  }, [status]);

  // Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, isLoading, currentSessionId]);

  const handleSearch = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setQuery("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: text,
          sessionId: currentSessionId 
        }),
      });
      
      const data = await response.json();
      
      if (data.id) {
        // Update local state with new message
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
      console.error("Chat error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);

  if (status === "loading") return (
    <div className="h-screen flex items-center justify-center bg-[#fdfcf8]">
       <Loader2 className="animate-spin text-sirat-gold" size={40} />
    </div>
  );

  return (
    <div className="flex h-screen bg-[#fdfcf8] overflow-hidden font-sans text-sirat-dark">
      
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-50 w-72 h-full bg-sirat-dark text-white p-5 transition-transform duration-300 flex flex-col shadow-2xl`}>
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="p-2 bg-sirat-gold rounded-lg">
            <Sparkles size={20} className="text-sirat-dark" />
          </div>
          <span className="text-xl font-black italic tracking-tighter uppercase">Sirat<span className="text-sirat-gold">.ai</span></span>
        </div>

        <button 
          onClick={() => { setCurrentSessionId(null); setIsSidebarOpen(false); }}
          className="flex items-center gap-2 w-full p-4 border border-white/10 rounded-2xl hover:bg-sirat-gold hover:text-sirat-dark transition-all mb-6 font-bold text-sm shadow-inner"
        >
          <Plus size={18} /> New Discussion
        </button>
        
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
    
    {/* Delete Trash Icon */}
    <button 
      onClick={(e) => deleteChat(e, s.id)}
      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
    >
      <Trash2 size={14} />
    </button>
  </div>
))}
        </div>
{/* PRAYER TIMES WIDGET */}
<div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
  <p className="text-[10px] font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
    <Sparkles size={12} className="text-sirat-gold" /> Prayer Times (Lahore)
  </p>
  
  <div className="grid grid-cols-2 gap-2 text-[11px]">
    {[
      { label: "Fajr", time: prayerTimes?.Fajr },
      { label: "Dhuhr", time: prayerTimes?.Dhuhr },
      { label: "Asr", time: prayerTimes?.Asr },
      { label: "Maghrib", time: prayerTimes?.Maghrib },
      { label: "Isha", time: prayerTimes?.Isha }
    ].map((p, idx) => (
      <div key={idx} className="flex justify-between p-2 bg-sirat-dark/50 rounded-lg border border-white/5">
        <span className="opacity-60">{p.label}</span>
        <span className="font-bold text-sirat-gold">{p.time || "--:--"}</span>
      </div>
    ))}
  </div>
</div>
        {/* Profile & Logout Section */}
        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl mb-3 border border-white/5">
            <div className="w-10 h-10 rounded-full bg-sirat-gold flex items-center justify-center text-sirat-dark font-black text-lg">
              {session?.user?.name?.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">{session?.user?.name}</p>
              <p className="text-[10px] opacity-50 truncate">{session?.user?.email}</p>
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

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Top Navbar */}
        <header className="bg-white/80 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between z-10">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"><Menu size={24}/></button>
          <div className="flex items-center gap-2 lg:hidden">
             <span className="text-lg font-black italic tracking-tighter uppercase">Sirat<span className="text-sirat-gold">.ai</span></span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button onClick={() => router.push('/')} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-sirat-dark">
              <Home size={22}/>
            </button>
          </div>
        </header>

        {/* Messages List */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8">
          {!currentSession && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto animate-in fade-in duration-700">
              <div className="w-20 h-20 bg-sirat-gold/10 rounded-full flex items-center justify-center mb-6">
                <Sparkles size={40} className="text-sirat-gold animate-pulse" />
              </div>
              <h2 className="text-2xl font-serif italic mb-2">Assalam-o-Alaikum, {session?.user?.name}!</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Islam ke mutaliq koi bhi sawal poochein. Hum Quran aur Sahih Hadith ki roshni mein jawab dene ki koshish karenge.
              </p>
            </div>
          )}
          {currentSession?.messages?.map((msg, i) => (
  <div 
    key={i} 
    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500`}
  >
    {/* AI Icon */}
    {msg.role === 'ai' && (
       <div className="w-8 h-8 rounded-lg bg-sirat-gold shrink-0 flex items-center justify-center shadow-md">
         <Sparkles size={16} className="text-sirat-dark" />
       </div>
    )}

    {/* Message Bubble */}
    <div className={`max-w-[80%] md:max-w-[70%] p-5 md:p-7 shadow-lg transition-all relative group ${
      msg.role === 'user' 
      ? 'bg-sirat-dark text-white rounded-[2rem] rounded-tr-none border-b-4 border-sirat-gold/30' 
      : 'bg-white border border-gray-100 rounded-[2rem] rounded-tl-none text-sirat-dark'
    }`}>
      <div className="prose prose-stone prose-p:leading-relaxed prose-strong:text-sirat-gold max-w-none">
        <ReactMarkdown>{msg.content}</ReactMarkdown>
      </div>

      {/* Action Buttons (Copy) */}
      {msg.role === 'ai' && (
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <button 
            onClick={() => copyToClipboard(msg.content)}
            className="flex items-center gap-2 text-[10px] font-bold text-sirat-gold hover:bg-sirat-gold hover:text-sirat-dark px-3 py-1.5 rounded-full border border-sirat-gold/20 transition-all active:scale-90"
          >
            <Copy size={12} /> Copy Response
          </button>
          <span className="text-[9px] font-black uppercase tracking-widest opacity-30 italic">Sirat Verified</span>
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
              <div className="bg-gray-50 border border-dashed border-gray-200 p-6 rounded-[2rem] rounded-tl-none w-[60%]">
                 <div className="h-2 bg-gray-200 rounded w-3/4 mb-3"></div>
                 <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          )}
          <div ref={scrollRef} className="h-4" />
        </main>

        {/* Floating Input Area */}
        {/* Floating Input Area */}
        <footer className="p-4 md:p-8 bg-gradient-to-t from-[#fdfcf8] via-[#fdfcf8] to-transparent">
  <div className="max-w-4xl mx-auto relative group flex items-center">
    <input 
      type="text" 
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
      placeholder="Bol kar ya likh kar sawal poochein..."
      className="w-full py-5 px-8 pr-32 rounded-[2rem] border border-gray-200 focus:ring-8 focus:ring-sirat-gold/5 outline-none shadow-2xl transition-all"
    />

    <div className="absolute right-3 flex items-center gap-2">
      <button 
        onClick={startListening}
        className={`p-3 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:bg-gray-100'}`}
      >
        <Mic size={22} />
      </button>
      
      <button 
        onClick={() => handleSearch(query)} 
        disabled={isLoading || !query.trim()}
        className="bg-sirat-dark p-3.5 rounded-full text-white hover:bg-sirat-gold transition-all shadow-lg disabled:bg-gray-200"
      >
        <Send size={22} />
      </button>
    </div>
  </div>
  
  <p className="text-[10px] text-center mt-4 text-gray-400 font-medium">
    &copy; 2026 Dawah Siraat. Knowledge is based on established Islamic Texts.
  </p>
</footer>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
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





 





