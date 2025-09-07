"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { simpleLogin } from "../../utils/simpleLogin";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { userLoggedIn } from "../../redux/features/auth/authSlice";

export default function AdminLoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const fieldErrors = errors as any;
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (mounted && user && user.role === 'admin') {
      router.push('/admin');
    }
  }, [user, mounted, router]);

  const onSubmit = async ({ email, password }) => {
    setIsLoading(true);
    try {
      console.log("🔐 Attempting admin login with:", { email, password });
      
      const loginResult = await simpleLogin(email, password);
      
      if (loginResult.success) {
        toast.success("Admin login successful!");
        reset();
        
        // Update Redux store
        dispatch(userLoggedIn({
          user: loginResult.user,
        }));
        
        // Redirect to admin page
        router.push("/admin");
      } else {
        toast.error(`Admin login failed: ${loginResult.error}`);
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error(`Admin login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Debug section to show current user state
  const debugUserState = () => {
    if (!mounted) return null;
    
    if (!user) {
      return (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
          <strong>ℹ️ No user currently logged in</strong>
          <p>Use admin credentials to log in:</p>
          <p><strong>Email:</strong> admin@example.com</p>
          <p><strong>Password:</strong> adminpassword</p>
        </div>
      );
    }

    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
        <strong>✅ User logged in!</strong>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role || 'undefined'}</p>
        <p><strong>Name:</strong> {user.name || 'N/A'}</p>
        <p><strong>Full user object:</strong></p>
        <pre className="text-xs bg-white p-2 rounded mt-2 overflow-auto">
          {JSON.stringify(user, null,2)}
        </pre>
      </div>
    );
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <Link
          href="/"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Admin Login
            </h1>
            <p className="text-gray-600">
              Sign in to access admin panel
            </p>
          </div>

          {/* Debug Section */}
          {debugUserState()}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-slate-700"
                placeholder="Enter admin email"
                defaultValue="admin@example.com"
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-slate-700"
                  placeholder="Enter admin password"
                  defaultValue="adminpassword"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In as Admin"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Need help?{" "}
              <Link
                href="/"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
