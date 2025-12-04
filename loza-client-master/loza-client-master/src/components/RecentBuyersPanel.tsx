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

  const formatPurchaseDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mt-8">
      {/* Header with Black Background */}
      <div className="bg-black px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
          <div>
            <h3 className="text-white font-medium text-base sm:text-lg">LEADERBOARD</h3>
          </div>
        </div>
      </div>

      {/* Buyers List */}
      <div className="p-4 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {sortedPurchases.map((purchase, index) => (
            <div key={`${purchase.orderId}-${index}`} className="flex items-center space-x-2 sm:space-x-4">
              {/* Avatar with Purchase Order Number */}
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm">
                  {getInitials(purchase.nickname)}
                </div>
                {/* Purchase Order Badge */}
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-black rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">
                  {index + 1}
                </div>
              </div>

              {/* Buyer Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <span className="font-medium text-gray-900 text-sm sm:text-base truncate">{purchase.nickname}</span>
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                </div>
              </div>

              {/* Purchase Date */}
              <div className="text-right flex-shrink-0">
                <p className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">{formatPurchaseDate(purchase.purchaseDate)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-4 sm:mt-6 text-center">
          <button className="bg-black text-white px-4 sm:px-6 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 text-xs sm:text-sm font-medium w-full sm:w-auto">
            VIEW ALL BUYERS
          </button>
        </div>
      </div>
    </div>
  );
}
