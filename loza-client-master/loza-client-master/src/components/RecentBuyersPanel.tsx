"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Users } from "lucide-react";

interface RecentPurchase {
  nickname: string;
  size: string;
  quantity: number;
  purchaseDate: string;
  orderId: string;
  orderNumber?: number;
  address?: string;
}

interface RecentBuyersPanelProps {
  recentPurchases: RecentPurchase[];
  productName: string;
}

export default function RecentBuyersPanel({ recentPurchases, productName }: RecentBuyersPanelProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !recentPurchases || recentPurchases.length === 0) {
    return null;
  }

  // Sort by purchase date (oldest first) to show chronological order of purchases
  const sortedPurchases = [...recentPurchases]
    .sort((a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime())
    .slice(0, 5);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatAddress = (address: string) => {
    if (!address || address === 'Address not provided') {
      return 'Address not provided';
    }
    // Truncate long addresses for better display
    return address.length > 30 ? address.substring(0, 30) + '...' : address;
  };

  const formatOrderNumber = (orderNumber?: number) => {
    return orderNumber ? `#${orderNumber}` : 'Order #N/A';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header with Gradient Background */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <div>
            <h3 className="text-white font-semibold text-lg">LeaderBoard</h3>
          </div>
        </div>
      </div>

      {/* Buyers List */}
      <div className="p-6">
        <div className="space-y-4">
          {sortedPurchases.map((purchase, index) => (
            <div key={`${purchase.orderId}-${index}`} className="flex items-center space-x-4">
              {/* Avatar with Purchase Order Number */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
                  {getInitials(purchase.nickname)}
                </div>
                {/* Purchase Order Badge */}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                  {index + 1}
                </div>
              </div>

              {/* Buyer Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{purchase.nickname}</span>
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-sm text-gray-600" title={purchase.address || 'Address not available'}>
                  {formatAddress(purchase.address || 'Address not available')}
                </p>
                <p className="text-xs text-gray-500">
                  {formatOrderNumber(purchase.orderNumber)}
                </p>
              </div>

              {/* Time */}
              <div className="text-right">
                <p className="text-sm text-gray-600">{formatTimeAgo(purchase.purchaseDate)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-6 text-center">
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium">
            View All Buyers
          </button>
        </div>
      </div>
    </div>
  );
}
