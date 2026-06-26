import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth"; // NextAuth ka use karein
import { redirect } from "next/navigation";
import AdminDashboardClient from "./admin-client";

export default async function AdminPage() {
  const session = await getServerSession();

  // 1. Check if user is logged in
  if (!session) redirect("/login");

  // 2. Check if user is Admin (Assume role is stored in DB)
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user?.email as string }
  });

  if (dbUser?.role !== "ADMIN") {
    redirect("/dashboard"); // Admin nahi hai toh wapis bhej do
  }

  // Ab data fetch karein
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  const safeUsers = JSON.parse(JSON.stringify(users));
  const userCount = await prisma.user.count();

  return <AdminDashboardClient initialUsers={safeUsers} userCount={userCount} />;
}