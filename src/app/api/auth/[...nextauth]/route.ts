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
    signIn: '/login', // Agar aapka login page /login hai
  },
  callbacks: {
    async session({ session, token }) {
      return session;
    },
    async jwt({ token, user, account }) {
      return token;
    }
  }
});

export { handler as GET, handler as POST };


export const authOptions = {
  // ... baki providers aur config
  pages: {
    signIn: '/login', // Jahan user login karega
  },
  // src/app/api/auth/[...nextauth]/route.ts
callbacks: {
  async redirect({ url, baseUrl }) {
    // Agar relative URL ho ya same domain ho toh wahan redirect karein, warna /chat par
    if (url.startsWith("/")) return `${baseUrl}${url}`;
    else if (new URL(url).origin === baseUrl) return url;
    return `${baseUrl}/chat`;
  },
},
};