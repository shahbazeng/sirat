import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        
        try {
          // Check karein ke user pehle se database mein hai ya nahi
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            // Agar nahi hai, toh Google user ko database mein save karein
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || "Google User",
                image: user.image,
                role: "USER",
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Database Error during Google Sign-In:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user, account }) {
      return token;
    },
    async redirect({ url, baseUrl }) {
      const productionBase = 'https://www.siratai.com';
      const targetBase = baseUrl.includes('localhost') ? baseUrl : productionBase;

      if (url.startsWith("/")) return `${targetBase}${url}`;
      try {
        if (new URL(url).origin === targetBase) return url;
      } catch (e) {}
      
      return `${targetBase}/chat`;
    },
  },
});

export { handler as GET, handler as POST };