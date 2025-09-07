"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../redux/features/auth/authSlice";
import { useSocialAuthMutation } from "../redux/features/auth/authApi";

export default function GoogleAuthHandler() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const [socialAuth] = useSocialAuthMutation();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      console.log("🔐 Google session detected:", session.user);
      
      // Sync with backend
      const syncWithBackend = async () => {
        try {
          const result = await socialAuth({
            name: session.user.name || "",
            email: session.user.email || "",
          }).unwrap();
          
          console.log("✅ Google auth sync successful:", result);
          
          // Update Redux store
          dispatch(userLoggedIn({
            user: result.user,
          }));
          
        } catch (error) {
          console.error("❌ Google auth sync failed:", error);
          // If sync fails, sign out from NextAuth
          signOut();
        }
      };
      
      syncWithBackend();
    }
  }, [session, status, socialAuth, dispatch]);

  return null; // This component doesn't render anything
}
