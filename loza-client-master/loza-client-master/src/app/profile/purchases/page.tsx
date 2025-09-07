"use client";

import React from "react";
import { useSelector } from "react-redux";
import { Package, Calendar, DollarSign } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function PurchasesPage() {
  const { user } = useSelector((state: any) => state.auth);

  // Mock purchased products data - in a real app, this would come from an API
  const mockPurchasedProducts = [
    {
      id: 1,
      name: "Premium T-Shirt",
      price: 29.99,
      quantity: 2,
      date: "2024-01-15",
      image: "/api/placeholder/80/80"
    },
    {
      id: 2,
      name: "Classic Jeans",
      price: 49.99,
      quantity: 1,
      date: "2024-01-10",
      image: "/api/placeholder/80/80"
    },
    {
      id: 3,
      name: "Sports Shoes",
      price: 79.99,
      quantity: 1,
      date: "2024-01-05",
      image: "/api/placeholder/80/80"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center space-x-3 mb-8">
          <Package size={32} className="text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-900">My Purchases</h1>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Purchase History
            </h2>
            <div className="text-sm text-gray-600">
              {mockPurchasedProducts.length} items purchased
            </div>
          </div>

          <div className="space-y-4">
            {mockPurchasedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <Package size={24} className="text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-2 text-green-600 font-semibold">
                    <DollarSign size={16} />
                    <span>{formatPrice(product.price * product.quantity)}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                    <Calendar size={14} />
                    <span>{product.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {mockPurchasedProducts.length === 0 && (
            <div className="text-center py-12">
              <Package size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No purchases yet
              </h3>
              <p className="text-gray-500">
                Your purchased products will appear here once you make your first order.
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {mockPurchasedProducts.length}
                </div>
                <p className="text-sm text-gray-600">Total Items</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(mockPurchasedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0))}
                </div>
                <p className="text-sm text-gray-600">Total Spent</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.ceil(mockPurchasedProducts.reduce((sum, p) => sum + p.quantity, 0) / mockPurchasedProducts.length) || 0}
                </div>
                <p className="text-sm text-gray-600">Avg. per Order</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
