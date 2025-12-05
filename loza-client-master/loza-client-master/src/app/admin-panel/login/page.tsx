"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Shield, Lock } from "lucide-react";
import { simpleLogin } from "@/utils/simpleLogin";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { userLoggedIn, userLoggedOut } from "@/redux/features/auth/authSlice";

/**
 * SECURE ADMIN LOGIN PAGE
 * 
 * This is a dedicated admin login page separate from customer login.
 * For production deployment, this should be served on a subdomain (e.g., admin.yourdomain.com)
 * 
 * Security Features:
 * - Separate login endpoint (not shared with customers)
 * - Admin role verification
 * - Secure session management
 * - Rate limiting (should be implemented on backend)
 */
export default function AdminPanelLoginPage() {
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
  // This ensures admin doesn't see login page if already authenticated
  useEffect(() => {
    if (!mounted) return;
    
    // Only redirect if user is confirmed admin
    if (user && user.role === 'admin') {
      console.log("✅ Admin already logged in, redirecting to dashboard");
      router.replace('/admin-panel');
    } else if (user && user.role !== 'admin') {
      // If user is logged in but not admin, clear their session
      // This ensures customer login doesn't interfere with admin login
      console.log("⚠️ User logged in but not admin, clearing session for admin login");
      dispatch(userLoggedOut());
      // Clear any stored customer session data
      localStorage.removeItem("googleUserSynced");
      localStorage.removeItem("userData");
    }
  }, [user, mounted, router, dispatch]);

  const onSubmit = async ({ email, password }: any) => {
    setIsLoading(true);
    try {
      console.log("🔐 Attempting admin login with:", { email });
      
      const loginResult = await simpleLogin(email, password);
      
      if (loginResult.success) {
        // Verify admin role
        if (loginResult.user?.role !== 'admin') {
          toast.error("Access denied. Admin privileges required.");
          setIsLoading(false);
          return;
        }

        toast.success("Admin login successful!");
        reset();
        
        // Update Redux store
        dispatch(userLoggedIn({
          user: loginResult.user,
        }));
        
        // Redirect to admin panel
        router.push("/admin-panel");
      } else {
        toast.error(`Admin login failed: ${loginResult.error}`);
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      toast.error(`Admin login failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading admin login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Security Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-400">
            Secure administrator access
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 p-8 md:p-10">
          <div className="flex items-center justify-center mb-6">
            <Lock className="w-6 h-6 text-purple-400 mr-2" />
            <span className="text-sm text-gray-400 font-medium">Protected Area</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-400"
                placeholder="admin@example.com"
                autoComplete="username"
              />
              {fieldErrors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {fieldErrors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
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
                  className="w-full px-4 py-3 pr-12 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-400"
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {fieldErrors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              style={{ color: '#FFFFFF' }}
            >
              {isLoading || isSubmitting ? (
                <span 
                  className="flex items-center justify-center font-bold text-base" 
                  style={{ 
                    color: '#FFFFFF',
                    fontWeight: 600,
                    textShadow: 'none'
                  }}
                >
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </span>
              ) : (
                <span 
                  className="font-bold text-base" 
                  style={{ 
                    color: '#FFFFFF',
                    fontWeight: 600,
                    textShadow: 'none'
                  }}
                >
                  Sign In to Admin Panel
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              ⚠️ This is a secure admin area. Unauthorized access is prohibited.
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            For production: Configure subdomain (e.g., admin.yourdomain.com)
          </p>
        </div>
      </div>
    </div>
  );
}

