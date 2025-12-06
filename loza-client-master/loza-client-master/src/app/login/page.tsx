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
import { useLoginMutation, useRegisterMutation } from "@/redux/features/auth/authApi";

type LoginFormData = {
  email: string;
  password: string;
};

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  
  // Get redirect URL from query params (from checkout)
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  // Login Form
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin },
    reset: resetLogin,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // Register Form
  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: errorsRegister },
    reset: resetRegister,
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      if (result && result.user) {
        toast.success("Login successful!");
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

  const onRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const result = await register({
        name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();

      if (result && result.user) {
        resetRegister();
        setIsRegisterMode(false);
        // Auto login after registration - toast is shown in authApi
        router.push(callbackUrl);
      }
    } catch (error: any) {
      console.error("Register error:", error);
      const errorMessage = error?.data?.message || error?.message || 'Registration failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const switchToRegister = () => {
    resetLogin();
    setIsRegisterMode(true);
  };

  const switchToLogin = () => {
    resetRegister();
    setIsRegisterMode(false);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRegisterMode ? 'Sign up' : 'Log in'}
          </h1>
          <p className="text-gray-600">
            {isRegisterMode 
              ? 'Create your account to get started' 
              : 'Welcome back! Please enter your details.'}
          </p>
        </div>

        <div className="space-y-6">
          {!isRegisterMode && (
            <>
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
            </>
          )}

          {/* Login Form */}
          {!isRegisterMode ? (
            <form onSubmit={handleSubmitLogin(onLoginSubmit)} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...registerLogin("email", { required: "Email is required" })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
                {errorsLogin?.email && (
                  <p className="mt-1 text-sm text-red-500">{errorsLogin.email.message}</p>
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
                    {...registerLogin("password", { required: "Password is required" })}
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
                {errorsLogin?.password && (
                  <p className="mt-1 text-sm text-red-500">{errorsLogin.password.message}</p>
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
          ) : (
            /* Register Form */
            <form onSubmit={handleSubmitRegister(onRegisterSubmit)} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...registerRegister("name", { required: "Name is required" })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
                {errorsRegister?.name && (
                  <p className="mt-1 text-sm text-red-500">{errorsRegister.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  {...registerRegister("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
                {errorsRegister?.email && (
                  <p className="mt-1 text-sm text-red-500">{errorsRegister.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    {...registerRegister("password", { 
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
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
                {errorsRegister?.password && (
                  <p className="mt-1 text-sm text-red-500">{errorsRegister.password.message}</p>
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
                  {isLoading ? 'Creating account...' : 'Register'}
                </span>
              </button>
            </form>
          )}

          <div className="text-center text-sm text-gray-600">
            {isRegisterMode ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={switchToLogin}
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  onClick={switchToRegister}
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
                >
                  Sign up
                </button>
              </>
            )}
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