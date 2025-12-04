"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { userLoggedOut } from "@/redux/features/auth/authSlice";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: ProtectedProps) {
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // If user exists but is not admin, clear their session
    // This ensures customer login doesn't interfere with admin access
    if (user && user.role !== 'admin') {
      console.log("🔐 User logged in but not admin - clearing customer session");
      dispatch(userLoggedOut());
      localStorage.removeItem("googleUserSynced");
      localStorage.removeItem("userData");
    }

    // Security check - redirect to admin login if not admin
    if (!user || user.role !== "admin") {
      console.log("🔐 Access denied - user is not admin or not logged in");
      router.replace('/admin-panel/login');
      return;
    }
  }, [user, router, mounted, dispatch]);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <button
            onClick={() => router.push('/admin-panel/login')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  // User is admin, render children
  return <>{children}</>;
}
