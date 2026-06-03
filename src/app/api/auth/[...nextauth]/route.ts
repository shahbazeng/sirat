import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-static';

// --- FIXED: Next.js static engine ko fake routes de kar bypass karne ke liye ---
export function generateStaticParams() {
  return [{ nextauth: ['session'] }];
}

const handler = (req: any, res: any) => {
  if (!req || req.method === 'HEAD') {
    return new Response(JSON.stringify({ status: "static_bypass" }), { status: 200 });
  }
  return NextAuth(authOptions)(req, res);
};

export { handler as GET, handler as POST };