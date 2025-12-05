"use client";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

export default function DebugPage() {
  const { user } = useSelector((state: any) => state.auth);
  const cartState = useSelector((state: any) => state.cart);
  const [localStorageData, setLocalStorageData] = useState<string>('Loading...');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLocalStorageData(localStorage.getItem('userData') || 'No user data in localStorage');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Debug Information</h1>
        
        {/* Auth State */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">🔐 Authentication State</h2>
          <div className="space-y-2">
            <p><strong>User logged in:</strong> {user ? "Yes" : "No"}</p>
            {user && (
              <>
                <p><strong>User ID:</strong> {user._id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Role:</strong> {user.role || "undefined"}</p>
                <p><strong>Points:</strong> {user.points}</p>
              </>
            )}
            <div className="mt-4">
              <strong>Full User Object:</strong>
              <pre className="bg-gray-100 p-4 rounded mt-2 text-sm overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Cart State */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">🛒 Cart State</h2>
          <div className="space-y-2">
            <p><strong>Cart Items:</strong> {cartState.cartItems?.length || 0}</p>
            <p><strong>Total Quantity:</strong> {cartState.cartTotalQty || 0}</p>
            <p><strong>Total Amount:</strong> ${cartState.cartTotalAmount || 0}</p>
          </div>
        </div>

        {/* Local Storage Check */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">💾 Local Storage</h2>
          <div className="space-y-2">
            <p><strong>User Data:</strong></p>
            <pre className="bg-gray-100 p-4 rounded mt-2 text-sm overflow-auto">
              {localStorageData}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">⚡ Actions</h2>
          <div className="space-y-4">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('userData');
                  window.location.reload();
                }
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Clear localStorage & Reload
            </button>
            
            <button
              onClick={() => window.location.href = '/admin-panel/login'}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-4"
            >
              Go to Admin Login
            </button>
            
            <button
              onClick={() => window.location.href = '/admin-panel'}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4"
            >
              Try Admin Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
