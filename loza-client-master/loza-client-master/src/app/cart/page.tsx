"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseProductQty,
  increaseProductQty,
  removeFromCart,
} from "@/redux/features/cart/cartSlice";
import { formatPrice } from "@/lib/utils";
import PointsReminderModal from "@/components/PointsReminderModal";

export default function CartPage() {
  const { cartItems } = useSelector((state: any) => state.cart);
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const [mounted, setMounted] = React.useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Don't calculate totals until mounted
  const total = mounted ? cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ) : 0;
  const shipping = mounted ? (total > 100 ? 0 : 10) : 0;
  
  // Calculate total points from cart items
  const totalPoints = mounted ? cartItems.reduce(
    (sum, item) => sum + ((item.points || 0) * item.quantity),
    0
  ) : 0;

  const handleIncreaseQty = (item: any) => {
    dispatch(
      increaseProductQty({ product: item, size: item.size, quantity: 1 })
    );
  };
  const handleDecreaseQty = (item: any) => {
    if (item.quantity > 1) {
      dispatch(
        decreaseProductQty({ product: item, size: item.size, quantity: 1 })
      );
    }
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-800 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your shopping cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-900 rounded-full">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
                  Shopping Cart
                </h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>
            
            {cartItems.length > 0 && (
              <Link
                href="/categories/new-arrival"
                className="hidden md:flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-all duration-200 hover:border-gray-400"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-light text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to discover our latest collection.
            </p>
            <Link
              href="/categories/new-arrival"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-xl font-medium text-gray-900">
                    Cart Items ({cartItems.length})
                  </h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item: any, index: any) => (
                    <div key={index} className="p-8">
                      <div className="flex flex-col lg:flex-row gap-8">
                        {/* Product Image */}
                        <div className="w-full lg:w-40 h-40 relative flex-shrink-0">
                          <Image
                            src={item.images?.[0]?.url || item.coverImage || '/placeholder-image.jpg'}
                            alt={item.name}
                            fill
                            className="object-cover rounded-xl shadow-sm"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-image.jpg';
                            }}
                          />
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-900">{item.quantity}</span>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-product-name text-gray-900 mb-2 truncate">
                                {item.name}
                              </h3>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-500">
                                  Size: <span className="font-medium text-gray-700">{item.size || "One Size"}</span>
                                </p>
                                <p className="text-sm text-blue-600 font-medium">
                                  Points: {item.points || 0} ({(item.points || 0) * 10} EGP)
                                </p>
                              </div>
                            </div>
                            
                            <button
                              onClick={() =>
                                dispatch(
                                  removeFromCart({
                                    productId: item._id,
                                    size: item.size,
                                  })
                                )
                              }
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 ml-4"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                                <button
                                  onClick={() => handleDecreaseQty(item)}
                                  disabled={item.quantity <= 1}
                                  className="p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="px-4 py-3 min-w-[3rem] text-center font-medium text-gray-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleIncreaseQty(item)}
                                  className="p-3 hover:bg-gray-50 transition-colors"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-2xl font-price-bold text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                              <p className="text-sm font-price text-gray-500">
                                {formatPrice(item.price)} each
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <h2 className="text-2xl font-light text-gray-900 mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-lg font-price-bold text-gray-900">{formatPrice(total)}</span>
                    </div>

                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-lg font-price-bold text-gray-900">
                        {shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          formatPrice(shipping)
                        )}
                      </span>
                    </div>

                    {totalPoints > 0 && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-blue-800 font-medium">Points Available</span>
                          <span className="text-blue-800 font-bold">{totalPoints}</span>
                        </div>
                        <div className="text-sm text-blue-600">
                          Earn {totalPoints} points with this order
                        </div>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-medium text-gray-900">Total</span>
                        <span className="text-2xl font-price-bold text-gray-900">{formatPrice(total + shipping)}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {shipping === 0 ? 'Free shipping included' : 'Shipping included'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!user) {
                        // Show points reminder modal if user is not logged in
                        setShowPointsModal(true);
                      } else {
                        // Direct to checkout if user is logged in
                        window.location.href = "/checkout";
                      }
                    }}
                    className="w-full bg-gray-900 text-white py-4 rounded-full text-center font-medium hover:bg-gray-800 transition-all duration-200 hover:scale-105 shadow-lg mb-4"
                  >
                    Proceed to Checkout
                  </button>

                  <Link
                    href="/categories/new-arrival"
                    className="w-full text-center text-gray-600 hover:text-gray-900 transition-colors text-sm block"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Points Reminder Modal */}
      {!user && (
        <PointsReminderModal
          isOpen={showPointsModal}
          onClose={() => setShowPointsModal(false)}
          totalPoints={totalPoints}
        />
      )}
    </div>
  );
}
