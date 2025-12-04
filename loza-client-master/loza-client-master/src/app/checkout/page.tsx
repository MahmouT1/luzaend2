"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useCreateOrderMutation } from "@/redux/features/orders/orderApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { clearAll, updateProductInCart } from "@/redux/features/cart/cartSlice";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useGetSingleProductQuery } from "@/redux/features/products/productApi";
import { CreditCard, Truck, Gift, ShoppingBag, Lock, Shield, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const [createOrder, { isLoading, isSuccess, error }] =
    useCreateOrderMutation();
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  
  // Load user data to ensure authentication
  const { data: userData, isLoading: userLoading } = useLoadUserQuery(undefined);

  const { cartItems, cartTotalPrice, cartTotalQty } = useSelector(
    (state: any) => state.cart
  );

  const { user } = useSelector((state: any) => state.auth);
  
  // Use loaded user data if available, fallback to Redux state
  const currentUser = userData?.user || user;
  

  // Calculate shipping and total
  const shipping = 150; // Fixed delivery fee of 150 EGP
  const total = cartTotalPrice + shipping;

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Refresh product data from API to ensure we have latest points values
  // This runs once when component mounts and whenever cart items change
  useEffect(() => {
    if (!mounted || !cartItems || cartItems.length === 0) return;
    
    let isMounted = true;
    const refreshProductData = async () => {
      for (const item of cartItems) {
        if (!item._id || !isMounted) continue;
        
        try {
          const apiUrl = `http://localhost:8000/api/products/get-single-product/${item._id}`;
          const response = await fetch(apiUrl, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });
          
          if (!response.ok || !isMounted) continue;
          
          const productData = await response.json();
          const newPoints = Number(productData.points) || 0;
          const newPointsCash = Number(productData.pointsCash) || 0;
          const currentPoints = Number(item.points) || 0;
          const currentPointsCash = Number(item.pointsCash) || 0;
          
          // Update if values changed
          if (currentPoints !== newPoints || currentPointsCash !== newPointsCash) {
            if (isMounted) {
              dispatch(updateProductInCart({
                productId: item._id,
                size: item.size,
                productData: {
                  points: newPoints,
                  pointsCash: newPointsCash,
                }
              }));
              
              console.log(`✅ Updated ${item.name}: points ${currentPoints}→${newPoints}, pointsCash ${currentPointsCash}→${newPointsCash}`);
            }
          }
        } catch (error) {
          console.error(`Error refreshing ${item.name}:`, error);
        }
      }
    };
    
    // Refresh immediately on mount, then again after a short delay
    refreshProductData();
    const timer = setTimeout(refreshProductData, 500);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [mounted, cartItems.length, dispatch]); // Refresh when cart items count changes

  // Allow checkout without login - no redirect needed
  // Users can complete purchase as guests

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    building: "",
    unitNumber: "",
    paymentMethod: "",
    nickname: "",
    instapayAccountName: ""
  });

  // Points system state - only for logged-in users
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [pointsDiscount, setPointsDiscount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);

  // Calculate total points available from products based on payment method
  const calculatePointsByPaymentMethod = (paymentType: string) => {
    if (!paymentType) {
      // Default to Instapay/Credit points if no payment method selected
      return cartItems.reduce((sum: number, item: any) => {
        return sum + (item.points || 0) * item.quantity;
      }, 0);
    }
    
    const isCashOnDelivery = paymentType === "Cash On Delivery" || paymentType === "cash_on_delivery";
    
    return cartItems.reduce((sum: number, item: any) => {
      if (isCashOnDelivery) {
        // Use pointsCash for cash on delivery
        const pointsCashValue = (item.pointsCash !== undefined && item.pointsCash !== null) ? item.pointsCash : 0;
        const calculatedPoints = pointsCashValue * (item.quantity || 1);
        // Debug log in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`Item: ${item.name}, pointsCash: ${pointsCashValue}, quantity: ${item.quantity}, calculated: ${calculatedPoints}`);
        }
        return sum + calculatedPoints;
      } else {
        // Instapay, Credit/Debit Card - use points
        const pointsValue = (item.points !== undefined && item.points !== null) ? item.points : 0;
        const calculatedPoints = pointsValue * (item.quantity || 1);
        return sum + calculatedPoints;
      }
    }, 0);
  };

  // Calculate points based on selected payment method - use useMemo for reactivity
  const totalProductPoints = useMemo(() => {
    return calculatePointsByPaymentMethod(form.paymentMethod);
  }, [form.paymentMethod, cartItems]);
  
  // Disable points usage if user is not logged in
  useEffect(() => {
    if (!currentUser?._id && usePoints) {
      setUsePoints(false);
      setPointsToUse(0);
      setPointsDiscount(0);
    }
  }, [currentUser, usePoints]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (userLoading) {
      toast.error("Please wait while we verify your account...");
      return;
    }
    
    // Allow checkout without login - guest checkout is allowed
    // User data will be taken from form if not logged in
    
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items before checkout.");
      return;
    }
    
    // Validate cart items structure
    const invalidItems = cartItems.filter(item => !item._id || !item.name || !item.price || !item.quantity);
    if (invalidItems.length > 0) {
      console.error("Invalid cart items:", invalidItems);
      toast.error("Some cart items are invalid. Please refresh and try again.");
      return;
    }

    // Validate stock availability for all cart items
    for (const item of cartItems) {
      if (item.info && item.size) {
        const sizeInfo = item.info.find((info: any) => info.size === item.size);
        if (!sizeInfo) {
          toast.error(`Size ${item.size} is no longer available for ${item.name}. Please remove from cart.`);
          return;
        }
        if (sizeInfo.quantity < item.quantity) {
          toast.error(`Only ${sizeInfo.quantity} pieces available for ${item.name} (Size: ${item.size}). Please update quantity.`);
          return;
        }
        if (sizeInfo.quantity <= 0) {
          toast.error(`${item.name} (Size: ${item.size}) is out of stock. Please remove from cart.`);
          return;
        }
      }
    }
    
    // Validate that all cart items have required fields
    for (const item of cartItems) {
      if (!item._id || !item.name || !item.price || !item.quantity) {
        console.error("Invalid cart item:", item);
        toast.error(`Invalid item: ${item.name || 'Unknown item'}. Please remove and re-add to cart.`);
        return;
      }
    }
    
    if (
      !form.fullName ||
      !form.email ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.postalCode ||
      !form.country ||
      !form.building ||
      !form.unitNumber ||
      !form.paymentMethod
    ) {
      toast.error("Please fill in all fields before proceeding.");
      return;
    }

    // Validate Instapay account name if Instapay is selected
    if (form.paymentMethod === "Instapay" && !form.instapayAccountName) {
      toast.error("Please enter your Instapay Account Name to complete the order.");
      return;
    }

    // Calculate final amounts based on points usage
    const finalPointsDiscount = usePoints ? (pointsToUse * 10) : 0;
    const finalRemainingAmount = usePoints ? Math.max(0, total - finalPointsDiscount) : total;
    
    // Build userInfo object - only include userId if user is logged in
    const userInfoData: any = {
      firstName: form.fullName.split(" ")[0] || "",
      lastName: form.fullName.split(" ").slice(1).join(" ") || "N/A",
      phone: form.phone || "",
      email: form.email,
      nickname: form.nickname || (currentUser?.name || form.fullName || "")
    };
    
    // Only include userId if user is logged in
    if (currentUser?._id) {
      userInfoData.userId = currentUser._id;
    }
    
    const orderData = {
      userInfo: userInfoData,
      shippingAddress: {
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        country: form.country,
        building: form.building,
        unitNumber: form.unitNumber
      },
      orderItems: cartItems.map((item: any) => {
        // Determine which points to use based on payment method
        const pointsToUse = (form.paymentMethod === "Cash On Delivery" || form.paymentMethod === "cash_on_delivery")
          ? (item.pointsCash || 0)
          : (item.points || 0);
        
        return {
        productId: item._id,
        id: item._id,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
          points: pointsToUse,
          pointsCash: item.pointsCash || 0,
        // Include the current product info for stock validation
        info: item.info || []
        };
      }),
      paymentMethod: {
        status: "unpaid",
        type: usePoints ? "points_cash_on_delivery" : (form.paymentMethod === "Cash On Delivery" ? "cash_on_delivery" : form.paymentMethod === "Instapay" ? "instapay" : "credit_debit_card"),
        instapayAccountName: form.paymentMethod === "Instapay" ? form.instapayAccountName : undefined
      },
      totalPrice: (currentUser?._id && usePoints) ? finalRemainingAmount : total,
      subtotal: cartTotalPrice,
      deliveryFee: shipping,
      // Points system fields - only for logged-in users
      // Calculate points based on payment method - use the same calculation function
      pointsEarned: (currentUser?._id && !usePoints) 
        ? calculatePointsByPaymentMethod(form.paymentMethod)
        : 0, // No points for guest checkout
      pointsUsed: (currentUser?._id && usePoints) ? pointsToUse : 0, // Can't use points if not logged in
      pointsDiscount: (currentUser?._id && usePoints) ? finalPointsDiscount : 0,
      finalAmount: (currentUser?._id && usePoints) ? finalRemainingAmount : total
    };

    // Final validation of order data - userId is optional for guest checkout
    
    if (!orderData.orderItems || orderData.orderItems.length === 0) {
      toast.error("No items in order. Please add items to cart.");
      return;
    }
    
    if (!orderData.paymentMethod || !orderData.paymentMethod.type) {
      toast.error("Payment method is not selected.");
      return;
    }

    try {
      console.log("Submitting order with data:", orderData);
      console.log("Points calculation:", {
        paymentMethod: form.paymentMethod,
        pointsEarned: orderData.pointsEarned,
        pointsUsed: orderData.pointsUsed,
        isLoggedIn: !!currentUser?._id,
        usePoints: usePoints
      });
      console.log("User ID being sent:", currentUser?._id);
      console.log("Cart items:", cartItems);
      console.log("Form data:", form);
      console.log("Order data validation:", {
        hasUserInfo: !!orderData.userInfo,
        hasOrderItems: !!orderData.orderItems,
        hasPaymentMethod: !!orderData.paymentMethod,
        userId: orderData.userInfo.userId
      });
      
      console.log("Submitting order with data:", orderData);
      console.log("User nickname:", form.nickname);
      console.log("Order items:", orderData.orderItems);
      
      const result = await createOrder(orderData).unwrap();
      toast.success("Order created successfully!");
      
      if (result.invoiceId) {
        // Store invoice ID for later retrieval
        localStorage.setItem(`invoice_${result.orderId}`, result.invoiceId);
      }
      
      dispatch(clearAll());
      // Redirect to products page after successful order
      router.push("/categories/new-arrival");
    } catch (error: any) {
      console.error("Order creation error:", error);
      console.error("Error type:", typeof error);
      console.error("Error keys:", Object.keys(error || {}));
      console.error("Error data:", error?.data);
      console.error("Error message:", error?.message);
      console.error("Error status:", error?.status);
      console.error("Error response:", error?.response);
      console.error("Full error object:", JSON.stringify(error, null, 2));
      
      let errorMessage = "Failed to create order";
      
      // Handle different error structures
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.error) {
        errorMessage = error.data.error;
      } else if (error?.error?.data?.message) {
        errorMessage = error.error.data.message;
      } else if (error?.error?.message) {
        errorMessage = error.error.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.status === 'FETCH_ERROR' || error?.error === 'FETCH_ERROR') {
        errorMessage = "Cannot connect to server. Please check your connection.";
      } else if (error?.status === 400 || error?.error?.status === 400) {
        errorMessage = "Invalid order data. Please check your information.";
      } else if (error?.status === 401 || error?.error?.status === 401) {
        errorMessage = "Please log in to create an order.";
      } else if (error?.status === 500 || error?.error?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error?.status === undefined && error?.error === undefined) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      toast.error(errorMessage);
    }
  };

  // Calculate points discount and remaining amount - only for logged-in users
  useEffect(() => {
    if (currentUser?._id && usePoints && pointsToUse > 0) {
      const discount = pointsToUse * 10; // 1 point = 10 EGP
      setPointsDiscount(discount);
      setRemainingAmount(Math.max(0, total - discount));
    } else {
      setPointsDiscount(0);
      setRemainingAmount(total);
    }
  }, [usePoints, pointsToUse, total, currentUser]);
  
  // Disable points usage if user is not logged in
  useEffect(() => {
    if (!currentUser?._id && usePoints) {
      setUsePoints(false);
      setPointsToUse(0);
      setPointsDiscount(0);
    }
  }, [currentUser, usePoints]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to create order");
    }
  }, [error]);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-800 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">
            {userLoading ? "Verifying your account..." : "Preparing your checkout..."}
          </p>
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
                  Secure Checkout
                </h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">
                  Complete your order with confidence
                </p>
              </div>
            </div>
            
            <Link
              href="/cart"
              className="hidden md:flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-all duration-200 hover:border-gray-400"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Cart</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 mb-8">
              <div className="flex items-center space-x-3 mb-6 sm:mb-8">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-light text-gray-900">
                  Personal Information
                </h2>
              </div>
              
                            <form className="space-y-6" onSubmit={handleSubmit}>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nickname (Optional)
                  </label>
                  <input
                    type="text"
                    name="nickname"
                    value={form.nickname}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter a nickname to display on product page"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will be shown on the product page as "Recently purchased by [nickname]"
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Truck className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">
                      Shipping Address
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your street address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your city"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={form.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter postal code"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your country"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Building
                      </label>
                      <input
                        type="text"
                        name="building"
                        value={form.building}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Building name/number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Number
                      </label>
                      <input
                        type="text"
                        name="unitNumber"
                        value={form.unitNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Apartment, suite, etc."
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">
                      Payment Method
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all duration-200">
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Credit/Debit Card"
                          onChange={handleChange}
                          className="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="ml-3">
                          <label className="font-medium text-gray-900">Credit/Debit Card</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all duration-200">
                                          <div className="flex items-start">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash On Delivery"
                        onChange={handleChange}
                        className="mt-1 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <label className="font-medium text-gray-900">Cash On Delivery</label>
                        </div>
                      </div>
                    </div>

                    {/* Instapay Button */}
                    <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all duration-200">
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Instapay"
                          onChange={handleChange}
                          className="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="ml-3 flex-1">
                          <label className="font-medium text-gray-900">Instapay</label>
                          <p className="text-sm text-gray-600 mt-1 mb-3">
                            Pay securely with Instapay. After completing the transfer, please fill in your Instapay account name below.
                          </p>
                          {form.paymentMethod === "Instapay" && (
                            <>
                              <a
                                href="https://ipn.eg/S/alysherif771/instapay/6ryJFv"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium mb-4"
                              >
                                Proceed to Instapay Payment
                              </a>
                              <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Instapay Account Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="instapayAccountName"
                                  value={form.instapayAccountName}
                                  onChange={handleChange}
                                  required={form.paymentMethod === "Instapay"}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Enter the account name used for Instapay transfer"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  This field is required to complete your order with Instapay payment
                                </p>
                              </div>
                            </>
                          )}
                      </div>
                    </div>
                    </div>
                  </div>
                </div>

                {/* Points Purchase Option */}
                {/* Loyalty Points Section - Only for logged-in users */}
                {currentUser?._id && (
                  <div className="border-t border-gray-100 pt-8">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Gift className="w-6 h-6 text-yellow-600" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-900">
                        Loyalty Points
                      </h3>
                    </div>
                    
                    <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-yellow-50 to-orange-50">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          checked={usePoints}
                          onChange={(e) => setUsePoints(e.target.checked)}
                          className="mt-1 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <div className="ml-3">
                          <label className="font-medium text-gray-900">Purchase with Points</label>
                          <p className="text-sm text-gray-600 mt-1">
                            Use your points to get a discount on this order
                          </p>
                        </div>
                      </div>
                      
                      {usePoints && (
                        <div className="ml-6 mt-6 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Points to Use (Max: {Math.min(currentUser?.points || 0, total * 10)})
                            </label>
                            <input
                              type="number"
                              value={pointsToUse}
                              onChange={(e) => setPointsToUse(Math.min(Number(e.target.value), currentUser?.points || 0))}
                              min="0"
                              max={Math.min(currentUser?.points || 0, total * 10)}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder="Enter points to use"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              Available points: {currentUser?.points || 0} (Value: {(currentUser?.points || 0) * 10} EGP)
                            </p>
                          </div>
                          
                          {pointsToUse > 0 && (
                            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                              <div className="text-sm text-green-800">
                                <div className="flex justify-between items-center mb-2">
                                  <span>Points Discount:</span>
                                  <span className="font-medium text-lg">-{pointsDiscount.toFixed(2)} EGP</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                  <span>Remaining Amount:</span>
                                  <span className="font-medium text-lg">{remainingAmount.toFixed(2)} EGP</span>
                                </div>
                                <div className="text-xs bg-green-100 p-2 rounded-lg">
                                  Remaining amount will be paid in cash on delivery
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Processing Order...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Complete Order Securely</span>
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-light text-gray-900">
                    Order Summary
                  </h2>
                </div>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item: any, index: any) => {
                    // Get image source safely
                    const imageSrc = 
                      (item.images && item.images[0] && (typeof item.images[0] === 'string' ? item.images[0] : item.images[0].url)) ||
                      item.coverImage ||
                      '/placeholder-image.jpg';
                    
                    return (
                    <div
                      key={index}
                      className="flex items-center py-4 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="w-16 h-16 relative mr-4 flex-shrink-0">
                        {imageSrc && imageSrc !== '' ? (
                          <Image
                            src={imageSrc}
                            alt={item.name || 'Product'}
                            fill
                            className="object-cover rounded-lg shadow-sm"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-image.jpg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          Size: {item.size || "One Size"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                        {item.info && item.size && (() => {
                          const sizeInfo = item.info.find((info: any) => info.size === item.size);
                          if (sizeInfo) {
                            const stock = sizeInfo.quantity;
                            if (stock <= 0) {
                              return (
                                <p className="text-sm text-red-600 font-medium">
                                  ❌ Out of Stock
                                </p>
                              );
                            } else if (stock <= 2) {
                              return (
                                <p className="text-sm text-orange-600 font-medium">
                                  ⚠️ Only {stock} left in stock
                                </p>
                              );
                            } else {
                              return (
                                <p className="text-sm text-green-600">
                                  ✅ {stock} in stock
                                </p>
                              );
                            }
                          }
                          return null;
                        })()}
                      </div>
                      <p className="font-semibold text-gray-900 text-right">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    );
                  })}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-lg font-medium text-gray-900">{cartTotalPrice.toFixed(2)} EGP</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-lg font-medium text-gray-900">
                      {shipping.toFixed(2)} EGP
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t pt-2">
                    <span className="text-gray-600">Delivery Time</span>
                    <span className="text-sm font-medium text-gray-700">
                      5 to 6 days
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Standard delivery fee applies to all orders
                  </p>
                  
                  {/* Points Information - Only for logged-in users */}
                  {currentUser?._id && totalProductPoints > 0 && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-blue-800 font-medium">Points Available</span>
                        <span className="text-blue-800 font-bold">{totalProductPoints}</span>
                      </div>
                      <div className="text-xs text-blue-600">
                        Earn {totalProductPoints} points with this order
                        {form.paymentMethod === "Cash On Delivery" && (
                          <span className="block mt-1 text-blue-700 font-medium">
                            (Cash on Delivery points)
                          </span>
                        )}
                        {(form.paymentMethod === "Instapay" || form.paymentMethod === "Credit/Debit Card") && (
                          <span className="block mt-1 text-blue-700 font-medium">
                            (Instapay/Credit/Debit points)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  
                  {/* Guest Checkout Notice */}
                  {!currentUser?._id && totalProductPoints > 0 && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                      <div className="flex items-start space-x-2">
                        <Gift className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-yellow-800">
                          <p className="font-medium mb-1">Sign in to earn {totalProductPoints} points!</p>
                          <p className="text-xs text-yellow-700">
                            Create an account to earn points and get discounts on future orders.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {usePoints && pointsDiscount > 0 && (
                    <>
                      <div className="flex justify-between items-center py-2 text-green-600">
                        <span>Points Discount</span>
                        <span className="font-medium">-{pointsDiscount.toFixed(2)} EGP</span>
                      </div>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-medium text-gray-900">Remaining Amount</span>
                          <span className="text-xl font-light text-gray-900">{remainingAmount.toFixed(2)} EGP</span>
                        </div>
                      </div>
                    </>
                  )}

                  {!usePoints && (
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg sm:text-xl font-medium text-gray-900">Total</span>
                        <span className="text-xl sm:text-2xl font-light text-gray-900">{total.toFixed(2)} EGP</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
