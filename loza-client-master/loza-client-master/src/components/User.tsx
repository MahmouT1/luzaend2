"use client";
import { UserIcon, ChevronDownIcon, PackageIcon, CoinsIcon, LogOutIcon } from "./icons/SimpleIcons";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSession, signOut } from "next-auth/react";
import { 
  useSocialAuthMutation, 
  useGetUserProfileQuery,
  useLogOutMutation
} from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import LoginModal from "./LoginModal";

const User = () => {
  const { user } = useSelector((state: any) => state.auth);
  const { data } = useSession();
  const [socialAuth, {}] = useSocialAuthMutation();
  const [Logout, {}] = useLogOutMutation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Fetch user profile data when dropdown is opened
  const { data: profileData, refetch: refetchProfile, isLoading } = useGetUserProfileQuery(undefined, {
    skip: !isDropdownOpen || !user,
  });

  useEffect(() => {
    if (data?.user && !localStorage.getItem("googleUserSynced")) {
      // call mutation once if user exists and not synced
      socialAuth({ name: data.user.name, email: data.user.email });
    }
  }, [data, socialAuth]);

  useEffect(() => {
    if (isDropdownOpen && user) {
      refetchProfile();
    }
  }, [isDropdownOpen, user, refetchProfile]);

  const handleLogout = async () => {
    try {
      // Close dropdown first
      setIsDropdownOpen(false);
      
      // Call server logout endpoint
      await Logout({});
      
      // Sign out from NextAuth
      await signOut({ callbackUrl: '/' });
      
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, try to sign out from NextAuth
      try {
        await signOut({ callbackUrl: '/' });
      } catch (signOutError) {
        console.error("SignOut error:", signOutError);
      }
    }
  };

  // Use profile data if available, otherwise fall back to basic user data
  const displayUser = profileData?.user || user;

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="relative">
        <div className="w-20 h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {!user && (
        <>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center text-gray-700 hover:text-black transition-colors"
            aria-label="Login"
          >
            <UserIcon size={20} />
          </button>
          <LoginModal 
            isOpen={isLoginModalOpen} 
            onClose={() => setIsLoginModalOpen(false)} 
          />
        </>
      )}
      
      {user?.role === "admin" && (
        <Link href={"/admin-panel"} className="text-slate-700">
          Admin
        </Link>
      )}
      
      {user?.role === "user" && (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center text-gray-700 hover:text-black transition-colors"
          >
            <UserIcon size={20} />
            <ChevronDownIcon size={16} className="ml-1" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {/* User Profile Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <UserIcon size={20} className="text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {displayUser?.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {displayUser?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Points and Purchases */}
              <div className="p-4 border-b border-gray-100">
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 size={20} className="animate-spin text-gray-400" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <CoinsIcon size={16} className="text-yellow-500 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          {displayUser?.points || 0}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Points</p>
                      <p className="text-xs text-green-600 font-medium">
                        {(displayUser?.points || 0) * 10} EGP
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <PackageIcon size={16} className="text-blue-500 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          {displayUser?.purchasedProductsCount || 0}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Purchases</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-2">
                <Link
                  href="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors w-full"
                >
                  <UserIcon size={16} className="mr-2" />
                  View Profile
                </Link>
                
                <Link
                  href="/profile/purchases"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors w-full"
                >
                  <PackageIcon size={16} className="mr-2" />
                  My Purchases
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors w-full"
                >
                  <LogOutIcon size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default User;
