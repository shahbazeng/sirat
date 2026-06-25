import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "./admin-client";

export default async function AdminPage() {
  // DB se data fetch karein
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Prisma ke Date objects ko stringify karna zaroori hai taake client side error na aaye
  const safeUsers = JSON.parse(JSON.stringify(users));
  const userCount = await prisma.user.count();

  return (
    <AdminDashboardClient 
      initialUsers={safeUsers} 
      userCount={userCount} 
    />
  );
}