"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Package, Calendar, DollarSign, Loader2, LogIn } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useGetUserOrdersQuery } from "@/redux/features/orders/orderApi";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/LoginModal";

export default function PurchasesPage() {
  const { user } = useSelector((state: any) => state.auth);
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { data: ordersData, isLoading, error, refetch } = useGetUserOrdersQuery(undefined, {
    skip: !user?._id, // Skip if user is not logged in
    refetchOnMountOrArgChange: true,
  });

  // Flatten order items from user orders
  const userPurchases = useMemo(() => {
    if (!ordersData?.orders || ordersData.orders.length === 0) {
      console.log("🔍 Purchases Debug - No orders data:", {
        hasOrders: !!ordersData?.orders,
        ordersCount: ordersData?.orders?.length || 0,
        hasUser: !!user,
        userId: user?._id
      });
      return [];
    }

    console.log("🔍 Purchases Debug - Processing orders:", ordersData.orders.length);
    // Orders are already filtered by user in the backend, so we can use them directly
    const userOrders = ordersData.orders;

    // Flatten order items with order information
    const purchases: any[] = [];
    userOrders.forEach((order: any) => {
      if (order.orderItems && Array.isArray(order.orderItems)) {
        order.orderItems.forEach((item: any) => {
          // Get product image from productInfo (populated) or item data
          let productImage = "/api/placeholder/80/80";
          if (item.productInfo) {
            // Product info is populated from backend
            productImage = item.productInfo.coverImage || 
                          item.productInfo.images?.[0]?.url || 
                          item.productInfo.images?.[0] || 
                          productImage;
          } else if (item.productId && typeof item.productId === 'object') {
            // Product is populated directly
            productImage = item.productId.coverImage || 
                          item.productId.images?.[0]?.url || 
                          item.productId.images?.[0] || 
                          productImage;
          } else if (item.image) {
            productImage = item.image;
          } else if (item.images?.[0]?.url) {
            productImage = item.images[0].url;
          } else if (item.images?.[0]) {
            productImage = item.images[0];
          }

          purchases.push({
            id: `${order._id}_${item.productId?._id || item.productId || item._id || Math.random()}`,
            orderId: order._id,
            orderNumber: order.orderNumber,
            name: item.name || item.productInfo?.name || item.productId?.name || "Unknown Product",
            price: item.price || 0,
            quantity: item.quantity || 1,
            size: item.size || "One Size",
            date: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            orderStatus: order.orderStatus || "Pending",
            image: productImage,
            productId: item.productId?._id || item.productId
          });
        });
      }
    });

    console.log("🔍 Purchases Debug - Total purchases items:", purchases.length);

    // Sort by date (newest first)
    return purchases.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [ordersData, user]);

  // Calculate statistics
  const totalItems = useMemo(() => {
    return userPurchases.reduce((sum, item) => sum + item.quantity, 0);
  }, [userPurchases]);

  const totalSpent = useMemo(() => {
    return userPurchases.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [userPurchases]);

  const avgPerOrder = useMemo(() => {
    if (userPurchases.length === 0) return 0;
    const uniqueOrders = new Set(userPurchases.map(p => p.orderId));
    return Math.ceil(totalItems / uniqueOrders.size);
  }, [userPurchases, totalItems]);

  useEffect(() => {
    if (user?._id) {
      refetch();
    }
  }, [user?._id, refetch]);

  // Show login prompt if user is not logged in
  if (!user?._id && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center space-x-3 mb-8">
            <Package size={32} className="text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">My Purchases</h1>
          </div>

          <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-12 text-center">
            <LogIn size={64} className="text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to view your purchase history.
            </p>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <LogIn size={20} />
              <span>Log In</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading your purchases...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("❌ Purchases Error:", error);
    console.error("❌ Error type:", typeof error);
    console.error("❌ Error keys:", Object.keys(error || {}));
    console.error("❌ Full error:", JSON.stringify(error, null, 2));
    
    // Try multiple ways to extract error message
    let errorMessage = "Unknown error occurred";
    const err = error as any;
    
    if (err?.data?.message) {
      errorMessage = err.data.message;
    } else if (err?.data?.error) {
      errorMessage = err.data.error;
    } else if (err?.error?.data?.message) {
      errorMessage = err.error.data.message;
    } else if (err?.error?.message) {
      errorMessage = err.error.message;
    } else if (err?.message) {
      errorMessage = err.message;
    } else if (err?.status === 'FETCH_ERROR' || err?.error === 'FETCH_ERROR') {
      errorMessage = "Cannot connect to server. Please check your connection and make sure the server is running.";
    } else if (err?.status === 401 || err?.error?.status === 401 || err?.originalStatus === 401) {
      errorMessage = "Please log in to view your purchases.";
    } else if (err?.status === 500 || err?.error?.status === 500) {
      errorMessage = "Server error. Please try again later.";
    } else if (err?.status) {
      errorMessage = `Error ${err.status}: ${err.statusText || 'Request failed'}`;
    }
    
    // If 401 error, show login prompt
    if (err?.status === 401 || err?.error?.status === 401 || err?.originalStatus === 401) {
      return (
        <div className="min-h-screen bg-gray-100 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center space-x-3 mb-8">
              <Package size={32} className="text-blue-500" />
              <h1 className="text-3xl font-bold text-gray-900">My Purchases</h1>
            </div>

            <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-12 text-center">
              <LogIn size={64} className="text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
              <p className="text-gray-600 mb-6">
                You need to be logged in to view your purchase history.
              </p>
              <Link
                href="/login?callbackUrl=/profile/purchases"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <LogIn size={20} />
                <span>Log In</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Purchases</h2>
            <p className="text-gray-600 mb-4">Failed to load your purchase history. Please try again.</p>
            <div className="mb-4 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg text-left max-w-md mx-auto">
              <p><strong>Error:</strong> {errorMessage}</p>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4 text-xs">
                  <summary className="cursor-pointer text-gray-600">Debug Info</summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto text-xs">
                    {JSON.stringify(error, null, 2)}
                  </pre>
                </details>
              )}
            </div>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => refetch()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
              {!user?._id && (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <LogIn size={20} />
                  <span>Log In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              {userPurchases.length} {userPurchases.length === 1 ? 'item' : 'items'} purchased
            </div>
          </div>

          {userPurchases.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No purchases yet
              </h3>
              <p className="text-gray-500 mb-4">
                Your purchased products will appear here once you make your first order.
              </p>
              {/* Debug info - remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left text-xs text-gray-600 max-w-md mx-auto">
                  <p><strong>Debug Info:</strong></p>
                  <p>User ID: {user?._id || 'Not logged in'}</p>
                  <p>Total Orders: {ordersData?.orders?.length || 0}</p>
                  <p>User Email: {user?.email || 'N/A'}</p>
                  {ordersData?.orders && ordersData.orders.length > 0 && (
                    <div className="mt-2">
                      <p><strong>Sample Order UserIds:</strong></p>
                      {ordersData.orders.slice(0, 3).map((order: any, idx: number) => (
                        <p key={idx}>
                          Order {idx + 1}: {order.userInfo?.userId?.toString() || order.userInfo?.userId?._id?.toString() || 'No userId'} - Email: {order.userInfo?.email || 'N/A'}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {userPurchases.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center relative overflow-hidden">
                        {product.image && product.image !== "/api/placeholder/80/80" ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <Package size={24} className="text-gray-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                        {product.size && (
                          <p className="text-sm text-gray-500">Size: {product.size}</p>
                        )}
                        {product.orderNumber && (
                          <p className="text-xs text-gray-400">Order #: {product.orderNumber}</p>
                        )}
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
                      {product.orderStatus && (
                        <div className="text-xs mt-1">
                          <span className={`px-2 py-1 rounded ${
                            product.orderStatus === 'Complete' || product.orderStatus === 'Delivered' 
                              ? 'bg-green-100 text-green-700' 
                              : product.orderStatus === 'Canceled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {product.orderStatus}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {totalItems}
                    </div>
                    <p className="text-sm text-gray-600">Total Items</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatPrice(totalSpent)}
                    </div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {avgPerOrder}
                    </div>
                    <p className="text-sm text-gray-600">Avg. per Order</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
}
