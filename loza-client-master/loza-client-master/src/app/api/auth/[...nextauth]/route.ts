import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Debug: Log environment variables
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
const nextAuthUrl = process.env.NEXTAUTH_URL;

console.log("🔐 NextAuth Environment Variables Check:");
console.log("GOOGLE_CLIENT_ID:", googleClientId ? `${googleClientId.substring(0, 20)}...` : "NOT FOUND");
console.log("GOOGLE_CLIENT_SECRET:", googleClientSecret ? `${googleClientSecret.substring(0, 10)}...` : "NOT FOUND");
console.log("NEXTAUTH_SECRET:", nextAuthSecret ? "FOUND" : "NOT FOUND");
console.log("NEXTAUTH_URL:", nextAuthUrl || "NOT FOUND");

if (!googleClientId || !googleClientSecret) {
  console.error("❌ CRITICAL: Google OAuth credentials are missing!");
}

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId || "dummy-client-id",
      clientSecret: googleClientSecret || "dummy-client-secret",
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  secret: nextAuthSecret || "fallback-secret",
  // Ensure proper URL and cookies for mobile
  useSecureCookies: process.env.NEXTAUTH_URL?.startsWith('https://') ?? true,
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
