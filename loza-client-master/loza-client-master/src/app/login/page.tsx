"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from "lucide-react";
import { useLoginMutation } from "@/redux/features/auth/authApi";

type FormData = {
  email: string;
  password: string;
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [login] = useLoginMutation();
  
  // Get redirect URL from query params (from checkout)
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Use the login API directly instead of NextAuth credentials
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      if (result && result.user) {
        toast.success("Login successful!");
        // Redirect to callback URL (checkout) or home
        router.push(callbackUrl);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error?.data?.message || error?.message || 'Invalid email or password';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn("google", { callbackUrl: "/" });
      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.url) {
        window.location.href = result.url;
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error(error instanceof Error ? error.message : 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Log in</h1>
          <p className="text-gray-600">Welcome back! Please enter your details.</p>
        </div>

        <div className="space-y-6">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 py-3 px-4 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your email"
              />
              {errors?.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm font-medium text-purple-600 hover:text-purple-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Password is required" })}
                  className="w-full px-4 py-3 pr-10 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors?.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ color: '#FFFFFF' }}
            >
              <span 
                className="font-bold text-base" 
                style={{ 
                  color: '#FFFFFF',
                  fontWeight: 600,
                  textShadow: 'none'
                }}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </span>
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-gray-800"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}