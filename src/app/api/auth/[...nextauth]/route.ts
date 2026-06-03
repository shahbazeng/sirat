


import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// FIXED: Static engine override ko hata kar server routing ko strict dynamic standard par shift kiya hai
export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };