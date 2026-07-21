import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProviderActual from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProviderActual({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid Credentials");
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() }
        });
        if (!user || !user.password) {
          throw new Error("User not found");
        }
        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) {
          throw new Error("Incorrect Password");
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: (user as any).role,
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const email = user.email;
        if (!email) return false;

        try {
          const dbUser = await prisma.user.findUnique({ where: { email } });
          if (!dbUser) {
            await prisma.user.create({
              data: { 
                email, 
                name: user.name || "Sirat User", 
                role: "USER" 
              }
            });
          }
          return true;
        } catch (error) {
          console.error("Google Sign-In DB Error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "USER";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      const productionBase = 'https://www.siratai.com';
      const targetBase = baseUrl.includes('localhost') ? baseUrl : productionBase;

      // Agar explicit callbackUrl `/chat` diya hai toh wahan redirect karein
      if (url.startsWith("/")) return `${targetBase}${url}`;
      try {
        if (new URL(url).origin === targetBase) return url;
      } catch (e) {}
      
      return `${targetBase}/chat`;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };