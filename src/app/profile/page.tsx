"use client";

import React from 'react';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, Mail, ShieldCheck, ArrowLeft, LogOut, 
  Settings, Bell, CreditCard, Sparkles 
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Auth Guard: Agar session nahi hai toh login par bhej dein
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#fdfcf8] p-4 md:p-12 flex flex-col items-center font-sans">
      
      {/* --- TOP NAVIGATION --- */}
      <div className="max-w-2xl w-full flex justify-between items-center mb-8">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-400 hover:text-sirat-dark transition-all font-bold text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="bg-sirat-dark p-2 rounded-xl">
          <Sparkles size={18} className="text-sirat-gold" />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full space-y-6"
      >
        {/* --- MAIN PROFILE CARD --- */}
        <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] p-8 md:p-12 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sirat-gold/5 rounded-full blur-3xl" />
          
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-24 h-24 bg-sirat-dark rounded-full flex items-center justify-center text-sirat-gold text-4xl font-serif font-black mb-4 border-4 border-white shadow-2xl">
              {session.user?.name?.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-3xl font-serif font-black italic text-sirat-dark">
              Account <span className="text-sirat-gold">Sanctuary</span>
            </h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-2">Member of Sirat Global Community</p>
          </div>

          <div className="grid gap-4">
            {/* Name Field */}
            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-[2rem] border border-transparent hover:border-sirat-gold/20 transition-all">
              <div className="p-3 bg-white rounded-xl shadow-sm text-sirat-gold">
                <User size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Full Name</p>
                <p className="font-bold text-sirat-dark">{session.user?.name}</p>
              </div>
            </div>

            {/* Email Field */}
            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-[2rem] border border-transparent hover:border-sirat-gold/20 transition-all">
              <div className="p-3 bg-white rounded-xl shadow-sm text-sirat-gold">
                <Mail size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Primary Email</p>
                <p className="font-bold text-sirat-dark">{session.user?.email}</p>
              </div>
            </div>

            {/* Status Field */}
            <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-[2rem] border border-transparent hover:border-sirat-gold/20 transition-all">
              <div className="p-3 bg-white rounded-xl shadow-sm text-sirat-gold">
                <ShieldCheck size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Account Standing</p>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sirat-dark">Verified Seeker</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="mt-10 pt-10 border-t border-gray-100 flex flex-col gap-4">
            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="group w-full bg-sirat-dark text-white p-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95"
            >
              <LogOut size={18} className="text-sirat-gold group-hover:rotate-12 transition-transform" />
              Sign Out of Session
            </button>
            <p className="text-[9px] text-center text-gray-300 font-bold uppercase tracking-widest">
              Last Login: {new Date().toLocaleDateString()} · Secure Session
            </p>
          </div>
        </div>

        {/* --- EXTRA SETTINGS CARDS (Dummy for now) --- */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-white rounded-3xl border border-gray-100 flex items-center gap-3 opacity-50 cursor-not-allowed">
            <Settings size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">Settings</span>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-gray-100 flex items-center gap-3 opacity-50 cursor-not-allowed">
            <Bell size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">Alerts</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}