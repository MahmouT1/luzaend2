import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy-client-secret",
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret",
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("🔐 NextAuth signIn callback:", { user, account, profile });
      
      // Sync with backend when using Google
      if (account?.provider === "google") {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
          const response = await fetch(`${apiUrl}/users/social-auth`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              name: user.name,
              email: user.email,
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log("✅ Backend sync successful:", data);
            return true;
          } else {
            console.error("❌ Backend sync failed:", response.status);
            return false;
          }
        } catch (error) {
          console.error("❌ Backend sync error:", error);
          return false;
        }
      }
      
      return true;
    },
    async session({ session, token }) {
      console.log("🔐 NextAuth session callback:", { session, token });
      return session;
    },
  },
  debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
