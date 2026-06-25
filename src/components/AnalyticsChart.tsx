"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', active: 120 }, { name: 'Tue', active: 250 },
  { name: 'Wed', active: 180 }, { name: 'Thu', active: 400 },
  { name: 'Fri', active: 300 }, { name: 'Sat', active: 550 },
  { name: 'Sun', active: 450 },
];

export default function AnalyticsChart() {
  return (
    <div className="h-[400px] w-full bg-white p-8 rounded-3xl border shadow-sm">
      <h3 className="text-xl font-black mb-6">Weekly User Activity (Analytics)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <Tooltip contentStyle={{ borderRadius: '15px' }} />
          <Area type="monotone" dataKey="active" stroke="#D4AF37" fillOpacity={1} fill="url(#colorActive)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}