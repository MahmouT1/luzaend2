"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, X } from "lucide-react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useLoginMutation, useRegisterMutation } from "@/redux/features/auth/authApi";
import { UserIcon } from "./icons/SimpleIcons";

type LoginFormData = {
  email: string;
  password: string;
};

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  
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
        resetLogin();
        onClose();
        router.refresh();
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
        onClose();
        // Auto login after registration - toast is shown in authApi
        router.refresh();
      }
    } catch (error: any) {
      console.error("Register error:", error);
      const errorMessage = error?.data?.message || error?.message || 'Registration failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const switchToRegister = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Use nativeEvent for stopImmediatePropagation
    if (e.nativeEvent && typeof e.nativeEvent.stopImmediatePropagation === 'function') {
      e.nativeEvent.stopImmediatePropagation();
    }
    console.log("🔄 Switching to Register mode");
    resetLogin();
    setIsRegisterMode(true);
    return false;
  };

  const switchToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🔄 Switching to Login mode");
    resetRegister();
    setIsRegisterMode(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn("google", { callbackUrl: "/" });
      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.url) {
        window.location.href = result.url;
      } else {
        onClose();
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetLogin();
    resetRegister();
    setIsRegisterMode(false);
    onClose();
  };

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <UserIcon size={20} className="text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isRegisterMode ? 'Sign up' : 'Login'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">
            {isRegisterMode 
              ? 'Create your account to get started' 
              : 'Enter your email and password to access your account'}
          </p>

          {/* Google Sign In Button - Only show in Login mode */}
          {!isRegisterMode && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 py-3 px-4 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-5"
              >
                <FcGoogle className="w-5 h-5" />
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative mb-5">
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
                {...registerLogin("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="Enter your email"
                disabled={isLoading}
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...registerLogin("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                  className="w-full px-4 py-3 pr-10 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errorsLogin?.password && (
                <p className="mt-1 text-sm text-red-500">{errorsLogin.password.message}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Keep me logged in
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black py-3 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="Enter your name"
                  disabled={isLoading}
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
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  disabled={isLoading}
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
                    className="w-full px-4 py-3 pr-10 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
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
                className="w-full bg-black py-3 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

          <div className="mt-6 text-center">
            {isRegisterMode ? (
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="font-medium text-black hover:underline"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.nativeEvent?.stopImmediatePropagation?.();
                    console.log("🔄 Button clicked - Switching to Register mode");
                    switchToRegister(e);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                  className="font-medium text-black hover:underline"
                  style={{ cursor: 'pointer' }}
                >
                  Sign up
                </button>
              </p>
            )}
          </div>

          {!isRegisterMode && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  handleClose();
                  router.push('/forgot-password');
                }}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

