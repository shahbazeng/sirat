import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma"; // Aapka prisma client
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    // --- YEH WALA HISSA ADD KAREIN YA UPDATE KAREIN ---
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // ------------------------------------------------
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Aapki existing logic yahan rahegi
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password");
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) {
          throw new Error("No user found with this email");
        }
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login", // Aapka custom login page
  },
  callbacks: {
    // Yeh callback zaroori hai agar aap chahte hain ki 
    // Google se signin karne walay users ka data DB mein jaye
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        const email = user.email;
        if (!email) return false;

        let dbUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!dbUser) {
          // User pehle exist nahi karta, naya banayein
          // Note: Google users ki password field null hogi
          dbUser = await prisma.user.create({
            data: {
              email: email,
              name: user.name || "Sirat User",
              image: user.image,
              // Default role 'user' set kar dein
              role: "user", 
            },
          });
        } else if (!dbUser.image && user.image) {
            // Agar pehle credential se tha ab google image hai to update kr dein
            await prisma.user.update({
                where: { email },
                data: { image: user.image }
            })
        }
        return true; // Sign in allowed
      }
      return true; // Credentials sign in allowed
    },
    
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Role token mein daalein
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role; // Session mein role bhejein
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };