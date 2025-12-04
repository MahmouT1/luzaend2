"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * REDIRECT OLD ADMIN ROUTE TO NEW SECURE ADMIN PANEL
 * 
 * This page redirects /admin to /admin-panel/login for security.
 * The old /admin routes are deprecated in favor of /admin-panel.
 * 
 * For production: This redirect ensures old admin URLs don't expose admin panel.
 */
export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to secure admin panel login
    router.replace('/admin-panel/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to admin panel...</p>
      </div>
    </div>
  );
}
