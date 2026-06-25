"use client";
import { Card, Metric, Text, Grid, BarChart, DonutChart, LineChart, Title, Callout } from "@tremor/react";
import { ShieldCheck, Zap, Activity, Users, Globe } from "lucide-react";

export default function AnalyticsDashboard({ stats, trends = [], engagement = [], trafficSources = [] }: any) {
  const s = stats || { totalQueries: "0", avgLatency: "0ms", activeUsers: "0", uptime: "0%" };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* KPI Cards */}
      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
        {[
          { title: "Total Queries", val: s.totalQueries, icon: Zap, bg: "bg-slate-900" },
          { title: "Avg. Latency", val: s.avgLatency, icon: Activity, bg: "bg-amber-600" },
          { title: "Active Users", val: s.activeUsers, icon: Users, bg: "bg-emerald-600" },
          { title: "System Uptime", val: s.uptime, icon: Globe, bg: "bg-blue-600" },
        ].map((item) => (
          <Card key={item.title} className="p-6 border-none shadow-lg shadow-slate-200/50 rounded-2xl">
            <div className={`p-3 w-10 h-10 rounded-xl ${item.bg} text-white mb-4 flex items-center justify-center`}>
              <item.icon size={20} />
            </div>
            <Text className="text-gray-500 font-bold text-[11px] uppercase">{item.title}</Text>
            <Metric className="text-2xl font-black">{item.val}</Metric>
          </Card>
        ))}
      </Grid>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-8 border-none shadow-lg shadow-slate-200/50 rounded-3xl">
          <Title className="font-black text-slate-800 mb-6">Real-time Traffic Volume</Title>
          <LineChart 
            data={trends} index="time" categories={["queries", "accuracy"]} 
            colors={["emerald", "amber"]} className="h-72" 
          />
        </Card>
        <Card className="p-8 border-none shadow-lg shadow-slate-200/50 rounded-3xl">
          <Title className="font-black text-slate-800 mb-6">Traffic Sources</Title>
          <DonutChart data={trafficSources} category="val" index="name" colors={["emerald", "amber", "blue"]} className="h-72" />
        </Card>
      </div>
    </div>
  );
}