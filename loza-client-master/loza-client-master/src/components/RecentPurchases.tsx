"use client";

import { useState, useEffect } from "react";
import { Users, Clock, ShoppingBag, Star } from "lucide-react";

interface RecentPurchase {
  nickname: string;
  size: string;
  quantity: number;
  purchaseDate: string;
  orderId: string;
}

interface RecentPurchasesProps {
  recentPurchases: RecentPurchase[];
  productName: string;
}

export default function RecentPurchases({ recentPurchases, productName }: RecentPurchasesProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("RecentPurchases component - recentPurchases:", recentPurchases);
    console.log("RecentPurchases component - productName:", productName);
    console.log("RecentPurchases component - recentPurchases type:", typeof recentPurchases);
    console.log("RecentPurchases component - recentPurchases length:", recentPurchases?.length);
    
    if (recentPurchases && recentPurchases.length > 0) {
      console.log("✅ RecentPurchases: Data received, should display panel");
      recentPurchases.forEach((purchase, index) => {
        console.log(`  ${index + 1}. ${purchase.nickname} - ${purchase.size} - ${purchase.quantity}`);
      });
    } else {
      console.log("❌ RecentPurchases: No data received, showing empty state");
    }
  }, [recentPurchases, productName]);

  if (!mounted) {
    return null;
  }

  // Use real data only
  const displayData = recentPurchases || [];

  // If no recent purchases, show empty state
  if (!recentPurchases || recentPurchases.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200 shadow-lg">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Recent Purchases</h3>
            <p className="text-sm text-gray-600">Be the first to buy this product!</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">No Recent Purchases Yet</h4>
          <p className="text-gray-600 mb-4">
            This product is waiting for its first customer. Be the first to purchase and your nickname will appear here!
          </p>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">💡 Tip:</span> Add a nickname during checkout to be featured here when you purchase!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Sort by most recent first
  const sortedPurchases = [...displayData].sort(
    (a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
  );

  // Take only the most recent 10 purchases
  const displayPurchases = sortedPurchases.slice(0, 10);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getRandomEmoji = () => {
    const emojis = ["😊", "🌟", "💫", "✨", "🎉", "🔥", "💎", "⭐", "🎯", "🚀"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200 shadow-lg">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
          <Users className="w-6 h-6 text-white" />
        </div>
                  <div>
            <h3 className="text-xl font-bold text-gray-900">Recent Purchases</h3>
            <p className="text-sm text-gray-600">
              {recentPurchases && recentPurchases.length > 0 
                ? "See who else bought this product" 
                : "Be the first to purchase!"
              }
            </p>
          </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Total Sold</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {displayData.reduce((sum, purchase) => sum + purchase.quantity, 0)}
          </p>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Happy Customers</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {displayData.length}
          </p>
        </div>
      </div>

      {/* Recent Purchases List */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          Latest Buyers
        </h4>
        
        <div className="max-h-64 overflow-y-auto space-y-2">
          {displayPurchases.map((purchase, index) => (
            <div
              key={`${purchase.orderId}-${index}`}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/60 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {purchase.nickname.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 flex items-center">
                      {purchase.nickname}
                      <span className="ml-2 text-lg">{getRandomEmoji()}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Size: <span className="font-medium text-blue-600">{purchase.size}</span>
                      {purchase.quantity > 1 && (
                        <span className="ml-2">
                          • Qty: <span className="font-medium text-green-600">{purchase.quantity}</span>
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimeAgo(purchase.purchaseDate)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-blue-200">
        <p className="text-center text-sm text-gray-600">
          Join <span className="font-semibold text-blue-600">{displayData.length}</span> happy customers who love this product! 
          <span className="block mt-1 text-xs text-gray-500">
            Your purchase will be featured here too
          </span>
        </p>
      </div>
    </div>
  );
}
