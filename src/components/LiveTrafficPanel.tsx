"use client";
import { useEffect, useState } from "react";
import { Activity, MapPin, Users } from "lucide-react";

export default function LiveTrafficPanel() {
  const [liveUsers, setLiveUsers] = useState(0);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch('/api/active-users');
        const data = await res.json();
        setLiveUsers(data.count);
      } catch (e) { console.error("Traffic poll failed"); }
    };
    
    fetchLive();
    const interval = setInterval(fetchLive, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-700">
      {/* Live Counter Card */}
      <div className="bg-[#1a2e2a] p-10 rounded-[2rem] text-white flex flex-col justify-between shadow-2xl">
        <div className="flex justify-between items-start">
          <h3 className="font-black text-xl">System Pulse</h3>
          <Activity size={24} className="text-[#D4AF37] animate-pulse" />
        </div>
        <div className="text-[12rem] font-black leading-none my-6">{liveUsers}</div>
        <p className="text-gray-400 font-medium">Currently active on siratai.com</p>
      </div>

      {/* Traffic Details */}
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <h3 className="font-black text-xl mb-6">Traffic Insights</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <span className="flex items-center gap-2 font-bold text-sm"><MapPin size={16}/> Lahore, Pakistan</span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-[10px] font-bold uppercase">Active</span>
          </div>
          {/* Future: Add more live sessions here */}
        </div>
      </div>
    </div>
  );
}