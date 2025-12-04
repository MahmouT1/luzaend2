"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User2, Coins, Loader2 } from "lucide-react";
import { useGetUserProfileQuery } from "@/redux/features/auth/authApi";
import { userLoggedIn } from "@/redux/features/auth/authSlice";

export default function ProfilePage() {
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  
  // Fetch updated profile data when page loads
  const { data: profileData, isLoading, error, refetch } = useGetUserProfileQuery(undefined, {
    skip: !user,
  });

  // Remove the useEffect that was causing infinite loop
  // The profile data is already being handled by the authApi onQueryStarted

  // Use profile data if available, otherwise fall back to basic user data
  const displayUser = profileData?.user || user;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
            <p className="text-gray-600">Failed to load your profile data. Please try again.</p>
            <button
              onClick={() => refetch()}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info Card */}
          <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User2 size={32} className="text-gray-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{displayUser?.name}</h2>
                <p className="text-gray-600">{displayUser?.email}</p>
                <p className="text-sm text-gray-500 capitalize">{displayUser?.role}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Member since</span>
                <span className="text-gray-900">2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
            </div>
          </div>

          {/* Points Card */}
          <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Coins size={24} className="text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900">Loyalty Points</h2>
            </div>
            
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-yellow-600 mb-2">
                {displayUser?.points || 0}
              </div>
              <p className="text-gray-600">Available Points</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                Earn 10 points for every order! Points can be redeemed for discounts on future purchases.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
