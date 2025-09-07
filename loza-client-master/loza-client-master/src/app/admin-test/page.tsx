"use client";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

export default function AdminTestPage() {
  const { user } = useSelector((state: any) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Admin Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Current User State</h2>
          <div className="space-y-2">
            <p><strong>User logged in:</strong> {user ? "Yes" : "No"}</p>
            {user && (
              <>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role || "undefined"}</p>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>ID:</strong> {user._id}</p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Admin Access Test</h2>
          <div className="space-y-2">
            <p><strong>Can access admin:</strong> {user?.role === "admin" ? "✅ Yes" : "❌ No"}</p>
            <p><strong>Role check:</strong> {user?.role === "admin" ? "Passed" : "Failed"}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-4">
            <button
              onClick={() => window.location.href = '/admin-login'}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Admin Login
            </button>
            
            <button
              onClick={() => window.location.href = '/admin'}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4"
            >
              Try Admin Dashboard
            </button>
            
            <button
              onClick={() => window.location.href = '/debug'}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 ml-4"
            >
              Debug Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
