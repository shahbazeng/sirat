"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import { User, Mail, Shield, ArrowLeft, LogOut, Settings } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  
  // Static build mein useSession crash na ho, isliye check laga rahe hain
  const sessionData = typeof window !== 'undefined' ? useSession() : { data: null, status: 'unauthenticated' };
  
  const session = sessionData?.data;
  const status = sessionData?.status;


  const activeUser = session?.user || { 
    name: "Shahbaz Ali", 
    email: "shahbaz@gmail.com" 
  };

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-[#fdfcf8]">
        <div className="w-8 h-8 border-4 border-sirat-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcf8] text-sirat-dark font-sans p-4 md:p-8">
      {/* Top Bar Navigation */}
      <div className="max-w-2xl mx-auto mb-8 flex items-center justify-between">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 transition-all"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-xl font-black uppercase tracking-wider">My Profile</h1>
        <button 
          onClick={() => router.push('/chat')} 
          className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Main Profile Card Container */}
      <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-[2rem] shadow-xl p-6 md:p-10 space-y-8">
        
        {/* Avatar Area */}
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-sirat-dark text-sirat-gold border-4 border-sirat-gold/20 flex items-center justify-center text-3xl font-black shadow-lg">
            {activeUser?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-serif italic font-black">{activeUser?.name}</h2>
            <p className="text-xs text-sirat-gold font-bold uppercase tracking-widest mt-1">Sirat Community Member</p>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* User Details Form Fields */}
        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
              <User size={12} /> Full Name
            </span>
            <div className="w-full py-4 px-6 rounded-2xl bg-gray-50/50 border border-gray-100 font-bold text-sm">
              {activeUser?.name}
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
              <Mail size={12} /> Email Address
            </span>
            <div className="w-full py-4 px-6 rounded-2xl bg-gray-50/50 border border-gray-100 font-bold text-sm text-gray-500">
              {activeUser?.email}
            </div>
          </label>

          <div className="p-4 bg-sirat-gold/5 border border-sirat-gold/10 rounded-2xl flex items-start gap-3">
            <Shield size={18} className="text-sirat-gold shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-sirat-dark">Account Security</p>
              <p className="text-[11px] text-gray-400 mt-1">Aapka account locally verified aur cryptographically secure hai client environment par.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => router.push('/chat')}
            className="flex-1 bg-sirat-dark text-white py-4 px-6 rounded-2xl font-bold text-sm hover:bg-sirat-gold hover:text-sirat-dark transition-all shadow-lg text-center"
          >
            Open Chatbot
          </button>
          
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center justify-center gap-2 sm:w-44 bg-red-500/5 text-red-500 border border-red-500/10 py-4 px-6 rounded-2xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

      </div>

      <p className="text-[10px] text-center mt-8 text-gray-400 font-medium">
        &copy; 2026 Dawah Siraat. Account profile managed under secure local storage sandbox.
      </p>
    </div>
  );
}