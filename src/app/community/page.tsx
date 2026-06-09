"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Trash2, Loader2, UploadCloud, Heart, MessageCircle, Share2, Globe, User, LayoutGrid, Plus, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

export default function SiratSocialHub() {
  // Supabase lazy initialization for Build Stability
  const supabase = useMemo(() => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );
  }, []);

  const [data, setData] = useState({ posts: [] });
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', image: '', tags: '' });
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/community');
      const json = await res.json();
      setData(Array.isArray(json) ? { posts: json } : { posts: json.posts || [] });
    } catch (e) { setData({ posts: [] }); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
    
    // Global Discussion Subscription
    const channel = supabase
      .channel('realtime:Discussion')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Discussion' }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { data: uploadData } = await supabase.storage.from('sirat-bucket').upload(`${Date.now()}_${file.name}`, file);
    const { data: urlData } = supabase.storage.from('sirat-bucket').getPublicUrl(uploadData!.path);
    setForm(prev => ({ ...prev, image: urlData.publicUrl }));
    setUploading(false);
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
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((m: any, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-xl w-fit"><p className="text-sm">{m.content}</p></div>
              ))}
            </div>
            <input className="p-3 bg-gray-100 rounded-xl" placeholder="Say something global..." onKeyDown={(e) => {
              if(e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                fetch('/api/discussion', { method: 'POST', body: JSON.stringify({ content: e.currentTarget.value }) });
                e.currentTarget.value = '';
              }
            }} />
          </motion.div>
        ) : (
          <>
            <button onClick={() => setShowUpload(!showUpload)} className="w-full bg-orange-500 text-white py-3 rounded-2xl font-bold">
              {showUpload ? 'Close' : 'Create New Post'}
            </button>
            {showUpload && (
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border">
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Title..." className="w-full font-black mb-2 outline-none" />
                <div className="flex gap-4"><label className="cursor-pointer bg-gray-100 p-2 rounded-xl"><UploadCloud size={20}/><input type="file" className="hidden" onChange={handleFileChange}/></label>
                <button onClick={handlePublish} className="bg-black text-white px-8 rounded-xl font-bold">Publish</button></div>
              </div>
            )}
            <div className="flex flex-col gap-6">
              {data.posts.map((p: any) => <PostCard key={p.id} p={p} onDelete={fetchData} />)}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function PostCard({ p, onDelete }: { p: any, onDelete: () => void }) {
  const [title, content] = (p.content || "||").split('|');
  return (
    <div className="bg-white p-6 rounded-[2rem] border">
      <img src={p.image} className="w-full h-64 object-cover rounded-[1.5rem] mb-4" />
      <h3 className="font-black text-xl">{title}</h3>
      <p className="text-gray-600 mb-4">{content}</p>
      <button onClick={() => fetch(`/api/community/posts/${p.id}`, {method:'DELETE'}).then(onDelete)} className="text-red-500">Delete</button>
    </div>
  );
}