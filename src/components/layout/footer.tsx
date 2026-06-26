import React from 'react';
import { Sparkles, ChevronRight, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#142320] text-white pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
        {/* Column 1: Brand */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="bg-[#D4AF37] p-2 rounded-xl"><Sparkles size={18} className="text-[#1a2e2a]" /></div>
            {/* Updated Brand Name to reflect Siratai.com */}
            <span className="text-2xl font-black uppercase italic">Siratai<span className="text-[#D4AF37]">.com</span></span>
          </div>
          <p className="text-white/60 text-xs">Verified knowledge on Al-Quran and Sahih Hadith.</p>
        </div>

        {/* Column 2: Knowledge Center */}
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Knowledge Center</h4>
          <ul className="space-y-3 text-xs font-bold uppercase tracking-widest text-white/60">
            <li><a href="/quran" className="hover:text-[#D4AF37] transition-colors">Al-Quran Index</a></li>
            <li><a href="/hadith" className="hover:text-[#D4AF37] transition-colors">Hadith Texts</a></li>
            <li><a href="/chat" className="hover:text-[#D4AF37] transition-colors">Ask Siraat Bot</a></li>
          </ul>
        </div>

        {/* Column 3: Contact Registry */}
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Contact Registry</h4>
          <ul className="space-y-4 text-xs text-white/70">
            <li className="flex items-center gap-2"><MapPin size={14} className="text-[#D4AF37]"/> Lahore, Pakistan</li>
            <li className="flex items-center gap-2"><Mail size={14} className="text-[#D4AF37]"/> <a href="mailto:support@siratai.com" className="hover:underline">support@siratai.com</a></li>
          </ul>
        </div>

        {/* Column 4: Company */}
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Company</h4>
          <ul className="space-y-3 text-xs font-bold uppercase tracking-widest text-white/60">
            <li><a href="/about" className="hover:text-[#D4AF37] transition-colors">About Us</a></li>
            <li><a href="/privacy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-[#D4AF37] transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-white/5 text-center md:text-left text-[10px] font-bold uppercase tracking-widest text-white/30">
        <p>&copy; 2026 Siratai.com. All rights reserved.</p>
      </div>
    </footer>
  );
}