"use client";
import React, { useState, useEffect } from 'react';
import { Trash2, Loader2, UploadCloud, X, Heart, MessageCircle, Share2, Globe, User, LayoutGrid, Plus, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SiratSocialHub() {
  const [data, setData] = useState({ posts: [] });
  const [messages, setMessages] = useState<any[]>([]); // New state for Global Chat
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', image: '', tags: '' });
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
const [userName, setUserName] = useState('');
  const fetchData = async () => {
    try {
      const res = await fetch('/api/community');
      const json = await res.json();
      setData(Array.isArray(json) ? { posts: json } : (json.posts ? json : { posts: [] }));
    } catch (e) { setData({ posts: [] }); }
    finally { setLoading(false); }
  };

  useEffect(() => { 
    fetchData(); 
    
    // Global Discussion Realtime Listener
    const channel = supabase
      .channel('realtime:Discussion')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Discussion' }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    const { data: uploadData } = await supabase.storage.from('sirat-bucket').upload(`${Date.now()}_${file.name}`, file);
    const { data: urlData } = supabase.storage.from('sirat-bucket').getPublicUrl(uploadData!.path);
    setForm(prev => ({ ...prev, image: urlData.publicUrl }));
    setUploading(false);
  };

  const handlePublish = async () => {
    if (!form.title || !form.image) return alert("Title aur Image lazmi hain!");
    const combinedContent = `${form.title}|${form.content}|${form.tags}`;
    await fetch('/api/community', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: combinedContent, image: form.image })
    });
    setForm({ title: '', content: '', image: '', tags: '' });
    setPreview(null);
    setShowUpload(false);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6">
      <main className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border w-fit mx-auto">
          {[ 
            {id: 'feed', label: 'Feed', icon: <LayoutGrid size={18}/>}, 
            {id: 'global', label: 'Global', icon: <Globe size={18}/>},
            {id: 'myposts', label: 'My Sanctuary', icon: <User size={18}/>} 
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition ${activeTab === tab.id ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Global Discussion Feature */}
        {activeTab === 'global' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-[2rem] border shadow-sm h-[600px] flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((m: any, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-xl w-fit">
                  <p className="text-[10px] font-bold text-gray-400">{m.userName || 'Sirat User'}</p>
                  <p className="text-sm">{m.content}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                className="flex-1 p-3 bg-gray-100 rounded-xl outline-none" 
                placeholder="Say something global..."
                onKeyDown={(e) => {
                  if(e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                    fetch('/api/discussion', { method: 'POST', body: JSON.stringify({ content: e.currentTarget.value }) });
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </motion.div>
        ) : (
          <>
            {/* Upload Trigger */}
            {(activeTab === 'feed' || activeTab === 'myposts') && (
              <button onClick={() => setShowUpload(!showUpload)} className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-2xl font-bold hover:bg-orange-600">
                <Plus size={20} /> {showUpload ? 'Close Post Form' : 'Create New Post'}
              </button>
            )}

            {showUpload && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[2rem] shadow-sm border">
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Post Title..." className="w-full text-lg font-black mb-2 outline-none" />
                <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="What's happening?" className="w-full h-20 mb-2 outline-none" />
                <div className="flex gap-4 items-center">
                   <label className="bg-gray-100 px-4 py-2 rounded-xl cursor-pointer flex gap-2"><UploadCloud size={18}/> {uploading ? '...' : 'Image'}<input type="file" className="hidden" onChange={handleFileChange}/></label>
                   <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="#Tags" className="flex-1 p-2 bg-gray-50 rounded-xl outline-none" />
                   <button onClick={handlePublish} className="bg-black text-white px-8 py-2 rounded-xl font-bold">Publish</button>
                </div>
              </motion.div>
            )}

            {/* Feed */}
            {loading ? <Loader2 className="animate-spin mx-auto mt-20" /> : (
              <div className="flex flex-col gap-6">
                {data.posts.length > 0 ? data.posts.map((p: any) => <PostCard key={p.id} p={p} onDelete={fetchData} />) : <p className="text-center py-20 text-gray-400">No posts yet.</p>}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function PostCard({ p, onDelete }: { p: any, onDelete: () => void }) {
  const [liked, setLiked] = useState(false);
  const [title, content] = (p.content || "||").split('|');
  const formattedDate = p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Just now";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-[2rem] border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center font-bold text-orange-500">S</div>
            <div className="flex flex-col">
                <span className="font-bold text-sm">Sirat User</span>
                <span className="text-[10px] text-gray-400">{formattedDate}</span>
            </div>
        </div>
        <button onClick={() => fetch(`/api/community/posts/${p.id}`, {method:'DELETE'}).then(onDelete)}><Trash2 size={16} className="text-gray-300 hover:text-red-500"/></button>
      </div>
      <img src={p.image} className="w-full h-64 object-cover rounded-[1.5rem] mb-4" />
      <h3 className="font-black text-xl mb-1">{title}</h3>
      <p className="text-gray-600 mb-4">{content}</p>
      <div className="flex items-center gap-6 pt-4 border-t">
        <button onClick={() => setLiked(!liked)} className={liked ? 'text-red-500' : 'text-gray-400'}><Heart size={22} fill={liked ? 'currentColor' : 'none'}/></button>
        <button className="text-gray-400"><MessageCircle size={22}/></button>
        <button className="text-gray-400"><Share2 size={22}/></button>
      </div>
    </motion.div>
  );
}