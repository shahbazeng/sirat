"use client";
import React from 'react';
import { X, CreditCard, Smartphone, Globe, Copy, CheckCircle2 } from 'lucide-react';

export default function DonateModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied: " + text);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1a2e2a]/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-[#fdfcf8] w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition">
          <X size={24} className="text-[#1a2e2a]" />
        </button>

        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-black text-[#1a2e2a] mb-2">Support Sirat AI</h2>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Sadaqah Jariyah for Digital Dawah</p>
          </div>

          <div className="space-y-4">
            {/* 1. EASYPAISA / JAZZCASH (For Pakistan) */}
            <div className="p-6 bg-white border border-gray-100 rounded-3xl hover:border-[#D4AF37] transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><Smartphone size={24}/></div>
                  <span className="font-black text-sm uppercase tracking-widest">EasyPaisa / JazzCash</span>
                </div>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">INSTANT</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Account Number</p>
                  <p className="font-mono font-bold text-[#1a2e2a]">03xx-xxxxxxx</p>
                </div>
                <button onClick={() => copyToClipboard("03xxxxxxxxx")} className="text-[#D4AF37] hover:scale-110 transition-transform"><Copy size={20}/></button>
              </div>
            </div>

            {/* 2. BANK TRANSFER (International/Local) */}
            <div className="p-6 bg-white border border-gray-100 rounded-3xl hover:border-[#D4AF37] transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Globe size={24}/></div>
                <span className="font-black text-sm uppercase tracking-widest">International Bank (IBAN)</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Meezan Bank | Shahbaz Ali</p>
                <div className="flex justify-between items-center">
                  <p className="font-mono font-bold text-[#1a2e2a] text-xs">PK76MEZN00XXXXXXXXXXXXXXXX</p>
                  <button onClick={() => copyToClipboard("PK76MEZN...")} className="text-[#D4AF37] hover:scale-110 transition-transform"><Copy size={18}/></button>
                </div>
              </div>
            </div>

            {/* 3. STRIPE / CARD (Direct Payment) */}
            <button className="w-full bg-[#1a2e2a] text-[#D4AF37] py-6 rounded-3xl font-black text-lg flex items-center justify-center gap-3 hover:brightness-125 transition-all shadow-xl">
              <CreditCard size={24} /> Pay via Debit/Credit Card
            </button>
          </div>

          <p className="mt-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            Server Cost & API Fees are covered by your support.
          </p>
        </div>
      </div>
    </div>
  );
}