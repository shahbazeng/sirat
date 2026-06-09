"use client";
import React, { useState, useEffect } from 'react';
import { Trash2, Loader2, UploadCloud, Heart, MessageCircle, Share2, Globe, User, LayoutGrid, Plus, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SiratSocialHub() {
  const [data, setData] = useState({ posts: [] });
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', image: '', tags: '' });
  const [uploading, setUploading] = useState(false);
  const [userName, setUserName] = useState('');

  // 1. Initial Load & User Name Prompt
  useEffect(() => {
    const name = localStorage.getItem('sirat_name') || 'Guest';
    setUserName(name);
    if (name === 'Guest') {
      const newName = prompt("Welcome to Global Sanctuary! What should we call you?");
      if (newName) {
        localStorage.setItem('sirat_name', newName);
        setUserName(newName);
      }
    }
    
    fetchData();
    fetch('/api/discussion').then(res => res.json()).then(setMessages);

    const channel = supabase
      .channel('realtime:Discussion')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Discussion' }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/community');
      const json = await res.json();
      setData(Array.isArray(json) ? { posts: json } : { posts: json.posts || [] });
    } catch (e) { setData({ posts: [] }); }
    finally { setLoading(false); }
  };

  const handlePublish = async () => {
    if (!form.title || !form.image) return alert("Title aur Image lazmi hain!");
    await fetch('/api/community', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: `${form.title}|${form.content}|${form.tags}`, image: form.image })
    });
    setForm({ title: '', content: '', image: '', tags: '' });
    setShowUpload(false);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6">
      <main className="max-w-4xl mx-auto space-y-8">
        <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border w-fit mx-auto">
          {[ {id: 'feed', label: 'Feed', icon: <LayoutGrid size={18}/>}, {id: 'global', label: 'Global', icon: <Globe size={18}/>}, {id: 'myposts', label: 'My Sanctuary', icon: <User size={18}/>} ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition ${activeTab === tab.id ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'global' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-[2rem] border shadow-sm h-[600px] flex flex-col">
            <h2 className="text-xl font-black mb-4">Global Sanctuary</h2>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((m: any, i) => (
                <div key={i} className="bg-orange-50 p-4 rounded-2xl w-fit max-w-[80%] border-l-4 border-orange-500">
                  <p className="text-[10px] font-bold text-orange-600 uppercase">{m.userName || 'Anonymous'}</p>
                  <p className="text-sm text-gray-800">{m.content}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="flex-1 p-3 bg-gray-100 rounded-xl outline-none" placeholder="Say something to the world..."
                onKeyDown={(e) => {
                  if(e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                    fetch('/api/discussion', { method: 'POST', body: JSON.stringify({ content: e.currentTarget.value, userName }) });
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button className="bg-black text-white px-6 rounded-xl font-bold"><Send size={18}/></button>
            </div>
          </motion.div>
        ) : (
          // ... Feed and MyPosts logic remains same as provided
          <>{/* Upload & Feed logic goes here */}</>
        )}
      </main>
    </div>
  );
}