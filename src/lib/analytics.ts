import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  // 1. Raw Data Fetching from Database
  const [queryCount, userCount, latestQueries] = await Promise.all([
    prisma.query.count().catch(() => 0),
    prisma.user.count(),
    prisma.query.findMany({ take: 5, orderBy: { createdAt: 'desc' } })
  ]);

  // 2. Formatting for Charts (Dynamic Arrays)
  const trendsData = [
    { time: "08:00", queries: queryCount / 4, accuracy: 99 },
    { time: "12:00", queries: queryCount / 2, accuracy: 98 },
    { time: "16:00", queries: queryCount, accuracy: 97 }
  ];

  return {
    stats: {
      totalQueries: queryCount.toLocaleString(),
      avgLatency: "120ms",
      activeUsers: userCount.toLocaleString(),
      uptime: "99.9"
    },
    trends: trendsData,
    engagement: [
      { topic: "Quran", duration: 85, accuracy: 98 },
      { topic: "Hadith", duration: 65, accuracy: 95 }
    ],
    trafficSources: [{ name: "Web", val: 60 }, { name: "App", val: 40 }]
  };
}