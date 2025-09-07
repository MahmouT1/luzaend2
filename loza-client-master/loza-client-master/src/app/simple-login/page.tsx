"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../../redux/features/auth/authSlice";
import { simpleLogin } from "../../utils/simpleLogin";
import toast from "react-hot-toast";

export default function SimpleLoginPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult("");

    try {
      const loginResult = await simpleLogin(email, password);
      
      if (loginResult.success) {
        setResult("✅ Login successful!");
        toast.success("Login successful!");
        
        // Update Redux store
        dispatch(userLoggedIn({
          user: loginResult.user,
        }));
        
        // Redirect to home page
        router.push("/");
      } else {
        setResult(`❌ Login failed: ${loginResult.error}`);
        toast.error(`Login failed: ${loginResult.error}`);
      }
    } catch (error) {
      setResult(`❌ Unexpected error: ${error.message}`);
      toast.error(`Unexpected error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Simple Login</h1>
          <p className="text-white/70">Direct login without RTK Query</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-white/10 rounded-lg">
            <pre className="text-white text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        )}

        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-white/70 hover:text-white text-sm underline"
          >
            Back to original login page
          </a>
        </div>
      </div>
    </div>
  );
}
