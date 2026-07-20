import { NextAuthOptions, User, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/google"; // Wait, change to google import
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

        const dbUser = await prisma.user.findUnique({ where: { email } });
        if (!dbUser) {
          await prisma.user.create({
            data: { 
              email, 
              name: user.name || "Sirat User", 
              role: "user" 
            }
          });
        }
        return true;
      }
      return true;
    },

    async jwt({ token, user }) {
      // Jab user pehli baar login karega to 'user' object milay ga
      if (user) {
        token.role = (user as any).role || "user";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        // Ab TypeScript ise pehchan lega kyunke humne declare kar diya hai
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};