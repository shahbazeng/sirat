"use client";
import { useState, useEffect, useCallback } from "react";
import { signOut } from "next-auth/react";
// ShieldAlert aur baki icons yahan import ho gaye hain
import { Users, LayoutDashboard, Activity, Zap, Search, Bell, Home, LogOut, Database, Cpu, Clock, TrendingUp, RefreshCw, ShieldAlert, CheckCircle } from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import UserManagementTable from "@/components/UserManagementTable";
import LiveTrafficPanel from "@/components/LiveTrafficPanel";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

export default function AdminDashboardClient({ initialUsers, userCount }: any) {
  const [activeTab, setActiveTab] = useState("home");
  const [liveUsers, setLiveUsers] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [systemAlerts] = useState([
    { id: 1, type: 'warning', msg: 'High load in Lahore node' },
    { id: 2, type: 'success', msg: 'AI Model v2.4 initialized' }
  ]);

  const syncData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/active-users');
      const data = await res.json();
      setLiveUsers(data?.count || 0);
    } catch (e) { console.error("Telemetry sync error"); }
    setTimeout(() => setIsRefreshing(false), 800);
  }, []);

  useEffect(() => {
    syncData();
    const interval = setInterval(syncData, 5000);
    return () => clearInterval(interval);
  }, [syncData]);

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-slate-300 p-6 flex flex-col fixed h-full shadow-[5px_0_30px_rgba(0,0,0,0.1)] z-50">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-emerald-500/20">S</div>
          <h1 className="text-xl font-bold text-white tracking-tight">Sirat<span className="text-emerald-400">Zenith</span></h1>
        </div>
        
        <nav className="space-y-2 flex-1">
          {[ 
            { id: 'home', icon: Home, label: 'Overview' },
            { id: 'dashboard', icon: LayoutDashboard, label: 'Analytics' },
            { id: 'users', icon: Users, label: 'User Registry' },
            { id: 'live', icon: Activity, label: 'Live Traffic' }
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} 
              className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-900/20 font-bold' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}>
              <item.icon size={20}/> {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-white/20 px-12 flex justify-between items-center sticky top-0 z-40">
          <div className="relative w-96">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18}/>
            <input className="w-full bg-slate-100/50 p-3.5 pl-12 rounded-2xl text-sm border border-slate-200 focus:ring-4 focus:ring-emerald-500/20 transition" placeholder="Search system resources..." />
          </div>
          <div className="flex items-center gap-6">
            <button onClick={syncData} className="text-slate-400 hover:text-emerald-500 transition">
              <RefreshCw size={22} className={isRefreshing ? "animate-spin" : ""} />
            </button>
            <Bell size={22} className="text-slate-400 hover:text-emerald-500 transition cursor-pointer"/>
            <button onClick={() => signOut()} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition">
              <LogOut size={16}/> Logout
            </button>
          </div>
        </header>

        <div className="p-12 space-y-10">
          {activeTab === "home" && (
  <div className="animate-in fade-in zoom-in duration-500 space-y-8">
    {/* Hero Banner with Welcome Message */}
    <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-10 rounded-3xl text-white shadow-2xl relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-4xl font-black mb-2">Salam, Shahbaz!</h2>
        <p className="text-emerald-100 opacity-90 text-lg">Sirat.ai ecosystem is performing at optimal efficiency.</p>
      </div>
      <Zap size={120} className="absolute -right-10 -bottom-10 text-white/10" />
    </div>

    {/* Dynamic Grid for Overview */}
    <div className="grid grid-cols-12 gap-6">
      {/* Recent Activity Feed */}
      <div className="col-span-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-slate-800 text-lg">Recent System Activity</h3>
          <button className="text-emerald-600 font-bold text-xs hover:underline">View All Logs</button>
        </div>
        <div className="space-y-3">
          {initialUsers.slice(0, 5).map((user: any) => (
            <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-emerald-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-bold text-slate-700">{user.name || "Anonymous"}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">New User Registration</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full uppercase">Just Now</span>
            </div>
          ))}
        </div>
      </div>

      {/* Side Alerts & Integrations */}
      <div className="col-span-4 space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-800 mb-6">Service Alerts</h3>
          <div className="space-y-4">
            {systemAlerts.map(alert => (
              <div key={alert.id} className={`flex items-start gap-3 p-4 rounded-2xl border ${alert.type === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
                {alert.type === 'warning' ? <ShieldAlert size={20} className="text-amber-600 shrink-0"/> : <CheckCircle size={20} className="text-emerald-600 shrink-0"/>}
                <p className="text-sm font-semibold text-slate-700">{alert.msg}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick System Stats */}
        <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl">
          <h3 className="font-black mb-6">System Integrity</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Uptime</span>
              <span className="font-bold text-emerald-400">99.98%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Database</span>
              <span className="font-bold text-emerald-400">Synced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

{activeTab === "dashboard" && (
  <AnalyticsDashboard 
    stats={{
      totalQueries: "12,402", // Isay API se fetch kar sakte hain
      avgLatency: "42ms",
      activeUsers: liveUsers.toString(), // Dynamic live counter
      uptime: "99.98%"
    }}
    trends={[
      { time: "10am", queries: 120, accuracy: 98 },
      { time: "12pm", queries: 240, accuracy: 99 },
      { time: "2pm", queries: 180, accuracy: 97 },
    ]}
    trafficSources={[
      { name: "Organic", val: 450 },
      { name: "Direct", val: 300 },
      { name: "Referral", val: 150 }
    ]}
    engagement={[
      { topic: "Salah", duration: 45, accuracy: 99 },
      { topic: "Zakat", duration: 30, accuracy: 95 },
      { topic: "Quran", duration: 60, accuracy: 98 }
    ]}
  />
)}

          {activeTab === "users" && <UserManagementTable users={initialUsers} />}
          {activeTab === "live" && <LiveTrafficPanel />}
        </div>
      </main>
    </div>
  );
}