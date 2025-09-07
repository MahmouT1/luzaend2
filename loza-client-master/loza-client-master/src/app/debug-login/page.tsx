"use client";
import { useState } from "react";
import { useLoginMutation } from "../../redux/features/auth/authApi";

export default function DebugLoginPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [result, setResult] = useState("");
  const [Login, { error, isSuccess, isLoading }] = useLoginMutation();

  const handleTestLogin = async () => {
    setResult("Testing login...");
    try {
      console.log("🔐 Testing login with:", { email, password });
      const response = await Login({ email, password }).unwrap();
      setResult(`✅ Success: ${JSON.stringify(response, null, 2)}`);
    } catch (err) {
      console.error("🔐 Login error:", err);
      setResult(`❌ Error: ${JSON.stringify(err, null, 2)}`);
    }
  };

  const handleDirectFetch = async () => {
    setResult("Testing direct fetch...");
    try {
      const response = await fetch("http://localhost:8000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.text();
      setResult(`📊 Direct fetch - Status: ${response.status}, Data: ${data}`);
    } catch (err) {
      setResult(`❌ Direct fetch error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Login Debug Page</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="space-x-4">
            <button
              onClick={handleTestLogin}
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? "Testing..." : "Test RTK Query Login"}
            </button>
            
            <button
              onClick={handleDirectFetch}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Test Direct Fetch
            </button>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {result || "No result yet"}
            </pre>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold mb-2">RTK Query State:</h3>
            <div className="text-sm space-y-1">
              <div>isSuccess: {isSuccess ? "✅" : "❌"}</div>
              <div>isLoading: {isLoading ? "⏳" : "✅"}</div>
              <div>Error: {error ? JSON.stringify(error, null, 2) : "None"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
