import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
      // Google sign in ko allow karne ke liye true return karna lazmi hai
      if (account?.provider === "google") {
        return true;
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