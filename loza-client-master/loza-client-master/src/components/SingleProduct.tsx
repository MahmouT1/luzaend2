"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Buttonn";
import { formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useGetSingleProductQuery, useAddProductRatingMutation } from "@/redux/features/products/productApi";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/features/cart/cartSlice";
import RecentBuyersPanel from "./RecentBuyersPanel";
import LoadingLogo from "./LoadingLogo";
import { useGetProductsByCategoryQuery } from "@/redux/features/products/productApi";
import Link from "next/link";
import StarRating from "./StarRating";

export default function SingleProduct({ productId }: any) {
  const { data: product, isLoading, refetch } = useGetSingleProductQuery(productId, {
    refetchOnMountOrArgChange: true, // Refetch when product ID changes
    refetchOnFocus: true, // Refetch when window regains focus
  });
  const [addProductRating, { isLoading: isRatingLoading }] = useAddProductRatingMutation();
  const { user } = useSelector((state: any) => state.auth);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [userName, setUserName] = useState(user?.name || "");
  const [showRatingForm, setShowRatingForm] = useState(false);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: any) => state.cart);

  // Update userName when user changes
  useEffect(() => {
    if (user?.name) {
      setUserName(user.name);
    }
  }, [user]);

  // Fetch related products from the same category
  const categoryName = product?.category?.name || product?.category || '';
  const categorySlug = categoryName 
    ? categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    : 'new-arrival';
  const { data: relatedProducts = [] } = useGetProductsByCategoryQuery(
    categorySlug,
    {
      skip: !product || !categoryName, // Skip if product or category is not loaded
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
    }
  );

  // Filter out current product and limit to 8 products
  const filteredRelatedProducts = relatedProducts
    ?.filter((p: any) => p._id !== productId && p._id !== product?._id)
    ?.slice(0, 8) || [];

  const handleAddToCart = () => {
    if (!product) {
      toast.error("Product not loaded");
      return;
    }
    
    if (selectedSize === "") {
      toast.error("Please select a size");
      return;
    }
    
    // Check if product has available sizes with stock
    const sizeInfo = product.info?.find((info: any) => info.size === selectedSize);
    if (!sizeInfo) {
      toast.error("Selected size not available");
      return;
    }
    
    if (sizeInfo.quantity <= 0) {
      toast.error("Selected size is out of stock");
      return;
    }
    
    // Check if total quantity exceeds stock
    const existingCartItem = cartItems?.find(
      (item: any) => item._id === product._id && item.size === selectedSize
    );
    const totalQuantity = existingCartItem 
      ? existingCartItem.quantity + quantity 
      : quantity;
    
    if (totalQuantity > sizeInfo.quantity) {
      const available = sizeInfo.quantity - (existingCartItem?.quantity || 0);
      if (available <= 0) {
        toast.error("This size is out of stock");
        return;
      } else {
        toast.error(`Only ${available} pieces available in this size`);
        return;
      }
    }
    
    // Add to cart - the reducer will show success/error messages
    try {
      dispatch(addToCart({ product, size: selectedSize, quantity }));
      // Don't show success message here - the reducer handles it
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingLogo />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Product not found</p>
        </div>
      </div>
    );
  }



  // Handle swipe gestures for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && product.images && currentImageIndex < product.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          {product && (
            <>
              {/* Image Gallery */}
              <div className="lg:col-span-1">
                {product.images && product.images.length > 0 ? (
                  <div className="flex flex-row-reverse lg:flex-row gap-4">
                    {/* Thumbnail Column (Right Side on Desktop, Left on Mobile) */}
                    {product.images.length > 1 && (
                      <div className="hidden lg:flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {/* Cover Image Thumbnail */}
                        <button
                          onClick={() => setCurrentImageIndex(0)}
                          className={`w-20 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border-2 transition-all duration-200 relative ${
                            currentImageIndex === 0 
                              ? 'border-blue-500 ring-2 ring-blue-200' 
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <Image
                            src={
                              typeof (product.coverImage || product.images[0]) === 'string' 
                                ? (product.coverImage || product.images[0]) 
                                : (product.coverImage?.url || product.images[0]?.url || product.images[0])
                            }
                            alt={`${product.name} cover`}
                            width={80}
                            height={96}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Thumbnail image load error:', e);
                              e.currentTarget.src = '/placeholder-image.jpg';
                            }}
                          />
                        </button>
                        
                        {/* Additional Images Thumbnails */}
                        {product.images.slice(1).map((image, index: number) => {
                          const imageUrl = typeof image === 'string' ? image : (image?.url || image);
                          return (
                            <button
                              key={index + 1}
                              onClick={() => setCurrentImageIndex(index + 1)}
                              className={`w-20 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border-2 transition-all duration-200 relative ${
                                currentImageIndex === index + 1 
                                  ? 'border-blue-500 ring-2 ring-blue-200' 
                                  : 'border-gray-200 hover:border-gray-400'
                              }`}
                            >
                              <Image
                                src={imageUrl}
                                alt={`${product.name} ${index + 2}`}
                                width={80}
                                height={96}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  console.error('Thumbnail image load error:', e);
                                  e.currentTarget.src = '/placeholder-image.jpg';
                                }}
                              />
                            </button>
                          );
                        })}
                        
                        {/* Scroll Indicator */}
                        {product.images.length > 6 && (
                          <div className="w-20 h-6 flex items-center justify-center text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Main Image Display (Left Side on Desktop, Right on Mobile) */}
                    <div className="flex-1">
                      <div 
                        className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 relative group touch-pan-y"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                      >
                      {/* Hide images for scheduled products */}
                      {!(product.isScheduled && !product.isReleased) && (
                      <Image
                        src={
                          currentImageIndex === 0 
                              ? (typeof (product.coverImage || product.images[0]) === 'string' 
                                  ? (product.coverImage || product.images[0]) 
                                  : (product.coverImage?.url || product.images[0]?.url || product.images[0]))
                              : (typeof product.images[currentImageIndex] === 'string'
                                  ? product.images[currentImageIndex]
                                  : product.images[currentImageIndex]?.url || product.images[currentImageIndex])
                        }
                        alt={product.name}
                        width={800}
                        height={1000}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
                        priority
                          quality={90}
                          draggable={false}
                        onError={(e) => {
                          console.error('Image load error:', e);
                          e.currentTarget.src = '/placeholder-image.jpg';
                        }}
                      />
                      )}
                      
                      {/* Placeholder for scheduled products */}
                      {product.isScheduled && !product.isReleased && (
                        <div className="w-full h-full bg-gray-200 absolute inset-0" />
                        )}
                      
                        
                        {/* Sold Out Badge - Show if product is out of stock */}
                        {(() => {
                          // Recalculate inStock based on info array to ensure accuracy
                          const hasStock = product.info && Array.isArray(product.info) && product.info.some((item: any) => (item.quantity || 0) > 0);
                          const productInStock = product.inStock !== undefined ? product.inStock : hasStock;
                          return !productInStock;
                        })() && (
                          <button
                            disabled
                            className="absolute top-3 left-3 bg-gray-800 text-white px-3 py-1.5 text-xs font-bold rounded uppercase tracking-wide z-10 cursor-default"
                            style={{ pointerEvents: 'none' }}
                          >
                            Sold Out
                          </button>
                      )}
                      
                        {/* Mobile Swipe Indicators - Hidden for scheduled products */}
                      {product.images.length > 1 && !(product.isScheduled && !product.isReleased) && (
                          <div className="lg:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                            {product.images.map((_, index: number) => (
                              <div
                                key={index}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                  currentImageIndex === index 
                                    ? 'w-6 bg-white' 
                                    : 'w-1.5 bg-white/50'
                                }`}
                              />
                            ))}
                        </div>
                      )}
                      
                      {/* Lock Overlay for Scheduled Products */}
                      {product.isScheduled && !product.isReleased && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-20">
                          <div className="w-16 h-16 bg-white bg-opacity-95 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <p className="text-white text-sm font-light tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Coming Soon</p>
                        </div>
                      )}
                    </div>
                    
                      {/* Mobile Thumbnail Navigation - Hidden for scheduled products */}
                    {product.images.length > 1 && !(product.isScheduled && !product.isReleased) && (
                        <div className="lg:hidden mt-4 grid grid-cols-4 gap-2">
                        {/* Cover Image Thumbnail */}
                        <button
                          onClick={() => setCurrentImageIndex(0)}
                            className={`aspect-[3/4] rounded-md overflow-hidden bg-gray-100 border-2 transition-all duration-200 ${
                            currentImageIndex === 0 
                              ? 'border-blue-500 ring-2 ring-blue-200' 
                                : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <Image
                            src={
                              typeof (product.coverImage || product.images[0]) === 'string' 
                                ? (product.coverImage || product.images[0]) 
                                : (product.coverImage?.url || product.images[0]?.url || product.images[0])
                            }
                            alt={`${product.name} cover`}
                            width={200}
                            height={250}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              console.error('Thumbnail image load error:', e);
                              e.currentTarget.src = '/placeholder-image.jpg';
                            }}
                          />
                        </button>
                        
                        {/* Additional Images Thumbnails */}
                          {product.images.slice(1, 5).map((image, index: number) => {
                            const imageUrl = typeof image === 'string' ? image : (image?.url || image);
                            return (
                          <button
                            key={index + 1}
                            onClick={() => setCurrentImageIndex(index + 1)}
                                className={`aspect-[3/4] rounded-md overflow-hidden bg-gray-100 border-2 transition-all duration-200 ${
                              currentImageIndex === index + 1 
                                ? 'border-blue-500 ring-2 ring-blue-200' 
                                    : 'border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            <Image
                                  src={imageUrl}
                              alt={`${product.name} ${index + 2}`}
                              width={200}
                              height={250}
                              className="w-full h-full object-cover"
                                  loading="lazy"
                              onError={(e) => {
                                console.error('Thumbnail image load error:', e);
                                e.currentTarget.src = '/placeholder-image.jpg';
                              }}
                            />
                          </button>
                            );
                          })}
                      </div>
                    )}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                {/* Title and Price */}
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight text-gray-900">
                    {product.name}
                  </h1>
                  <div className="mt-3 sm:mt-4 flex flex-col space-y-1">
                    {product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price ? (
                      <>
                        <span className="text-lg sm:text-xl font-light text-gray-400 line-through">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-2xl sm:text-3xl font-light text-gray-900">
                          {formatPrice(product.discountPrice)}
                        </span>
                      </>
                    ) : (
                    <span className="text-2xl sm:text-3xl font-light text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    )}
                  </div>
                  {/* Star Rating */}
                  <div className="mt-3 sm:mt-4">
                    <StarRating
                      rating={product.averageRating || 0}
                      totalRatings={product.totalRatings || 0}
                      size="md"
                      showRating={true}
                      interactive={false}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Description
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {product.description}
                  </p>
                </div>

                {/* Color Selection */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Color
                  </h3>
                  {/* <div className="flex flex-wrap gap-2">
                    {product.colors.map((color: string) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                          selectedColor === color
                            ? "border-black bg-black text-white"
                            : "border-gray-300 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div> */}
                </div>

                {/* Size Selection */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Size
                  </h3>
                  {product.info && product.info.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {product.info.map((info: any, index: any) => {
                        const isOutOfStock = info.quantity <= 0;
                        const isLowStock = info.quantity <= 2 && info.quantity > 0;
                        const isSelected = selectedSize === info.size;
                        
                        return (
                          <button
                            key={index}
                            onClick={() => !isOutOfStock && setSelectedSize(info.size)}
                            disabled={isOutOfStock}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm font-medium transition-colors relative ${
                              isOutOfStock
                                ? "border-black bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                                : isSelected
                                ? "border-black bg-black text-white"
                                : "border-gray-300 text-gray-700 hover:border-gray-400"
                            }`}
                          >
                            {info.size}
                            {isLowStock && !isOutOfStock && (
                              <span className="absolute -top-1 -right-1 text-xs bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                                !
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">No sizes available</p>
                  )}
                </div>

                {/* Quantity Selection */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Quantity
                  </h3>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 text-base sm:text-lg font-medium"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 sm:px-4 py-1.5 sm:py-2 min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm sm:text-base font-medium">{quantity}</span>
                    <button
                      onClick={() => {
                        const selectedSizeInfo = product.info?.find((info: any) => info.size === selectedSize);
                        const maxQuantity = selectedSizeInfo?.quantity || 0;
                        if (quantity < maxQuantity) {
                          setQuantity(quantity + 1);
                        }
                      }}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 text-base sm:text-lg font-medium"
                      disabled={(() => {
                        const selectedSizeInfo = product.info?.find((info: any) => info.size === selectedSize);
                        return !selectedSizeInfo || quantity >= selectedSizeInfo.quantity;
                      })()}
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Quantity Limit Warning */}
                  {selectedSize && product.info && (() => {
                    const selectedSizeInfo = product.info.find((info: any) => info.size === selectedSize);
                    if (!selectedSizeInfo) return null;
                    
                    const maxQuantity = selectedSizeInfo.quantity;
                    if (quantity >= maxQuantity && maxQuantity > 0) {
                      return (
                        <p className="text-orange-600 text-sm mt-2">
                          ⚠️ Maximum quantity available: {maxQuantity}
                        </p>
                      );
                    }
                    return null;
                  })()}
                </div>



                {/* Action Buttons */}
                <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-0">
                  {/* Check if product is scheduled and not yet released */}
                  {product.isScheduled && !product.isReleased ? (
                    <div className="space-y-3 sm:space-y-4">
                      {/* Lock Icon and Release Info */}
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 sm:p-6 rounded-xl border border-purple-200 text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">This product will be available on:</p>
                        {product.releaseDate && (
                          <div className="bg-white p-3 sm:p-4 rounded-lg border">
                            <p className="text-lg sm:text-2xl font-bold text-purple-600">
                              {new Date(product.releaseDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-sm sm:text-lg text-gray-600 mt-1">
                              at {new Date(product.releaseDate).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        )}
                        <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
                          🔒 This product is currently locked and cannot be purchased until the release date.
                        </p>
                      </div>
                      
                      {/* Disabled Buttons */}
                      <Button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 cursor-not-allowed text-sm sm:text-base py-2.5 sm:py-3"
                      >
                        🔒 Product Locked
                      </Button>
                      <Button
                        disabled
                        className="w-full bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed text-sm sm:text-base py-2.5 sm:py-3"
                      >
                        🔒 Not Available Yet
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Button
                        onClick={handleAddToCart}
                        className="w-full bg-black text-white hover:bg-gray-800 disabled:opacity-50 text-sm sm:text-base py-2 sm:py-2.5 font-medium"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  )}
                </div>
              </div>

            </>
          )}
        </div>

        {/* Recent Buyers Panel - Moved below the product details */}
        {product?.recentPurchases?.length > 0 && (
          <div className="mt-12">
            <RecentBuyersPanel 
              recentPurchases={product.recentPurchases} 
              productName={product.name}
            />
          </div>
        )}

        {/* Ratings and Reviews Section */}
        <div className="mt-16 sm:mt-20 border-t border-gray-200 pt-12 sm:pt-16">
          <div className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900 mb-2">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-4">
              <StarRating
                rating={product?.averageRating || 0}
                totalRatings={product?.totalRatings || 0}
                size="lg"
                showRating={true}
                interactive={false}
              />
            </div>
          </div>

          {/* Add Rating Form */}
          <div className="mb-12 bg-gray-50 p-6 sm:p-8 rounded-lg border border-gray-200">
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-4">
              Share Your Experience
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <StarRating
                  rating={userRating}
                  size="lg"
                  showRating={false}
                  interactive={true}
                  onRatingChange={setUserRating}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review (Optional)
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>
              <button
                onClick={async () => {
                  if (userRating === 0) {
                    toast.error("Please select a rating");
                    return;
                  }
                  if (!userName.trim()) {
                    toast.error("Please enter your name");
                    return;
                  }
                  try {
                    console.log("Submitting rating:", {
                      id: productId,
                      rating: userRating,
                      review: reviewText,
                      userName: userName.trim(),
                      userId: user?._id || null,
                    });
                    const result = await addProductRating({
                      id: productId,
                      rating: userRating,
                      review: reviewText,
                      userName: userName.trim(),
                      userId: user?._id || null,
                    }).unwrap();
                    console.log("Rating submitted successfully:", result);
                    toast.success("Thank you for your review!");
                    setUserRating(0);
                    setReviewText("");
                    setShowRatingForm(false);
                    // Refetch product data to get updated ratings
                    setTimeout(() => {
                      refetch();
                    }, 500);
                  } catch (error: any) {
                    console.error("Rating submission error - Full error object:", error);
                    console.error("Error type:", typeof error);
                    console.error("Error keys:", error ? Object.keys(error) : "error is null/undefined");
                    console.error("Error.data:", error?.data);
                    console.error("Error.status:", error?.status);
                    console.error("Error.message:", error?.message);
                    
                    let errorMessage = "Failed to submit review. Please try again.";
                    
                    // RTK Query error structure
                    if (error?.data) {
                      if (typeof error.data === 'string') {
                        errorMessage = error.data;
                      } else if (error.data?.message) {
                        errorMessage = error.data.message;
                      } else if (error.data?.error) {
                        errorMessage = error.data.error;
                      }
                    } else if (error?.message) {
                      errorMessage = error.message;
                    } else if (typeof error === 'string') {
                      errorMessage = error;
                    } else if (error?.error) {
                      errorMessage = error.error;
                    }
                    
                    console.error("Final error message:", errorMessage);
                    toast.error(errorMessage);
                  }
                }}
                disabled={isRatingLoading || userRating === 0 || !userName.trim()}
                className="w-full sm:w-auto px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isRatingLoading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>

          {/* Existing Reviews */}
          {product?.ratings && product.ratings.length > 0 ? (
            <div className="space-y-6">
              <h3 className="text-lg sm:text-xl font-medium text-gray-900">
                All Reviews ({product.ratings.length})
              </h3>
              {product.ratings
                .slice()
                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((rating: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white p-5 sm:p-6 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {rating.userName || "Anonymous"}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {new Date(rating.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <StarRating
                        rating={rating.rating}
                        size="sm"
                        showRating={false}
                        interactive={false}
                      />
                    </div>
                    {rating.review && (
                      <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                        {rating.review}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>

        {/* Related Products Section */}
        {filteredRelatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-20 border-t border-gray-200 pt-12 sm:pt-16">
            <div className="mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900 mb-2">
                More from this collection
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Discover other products in the same category
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredRelatedProducts.map((relatedProduct: any, relIndex: number) => {
                // Recalculate inStock for related products
                const hasStock = relatedProduct.info && Array.isArray(relatedProduct.info) && relatedProduct.info.some((item: any) => (item.quantity || 0) > 0);
                const productInStock = relatedProduct.inStock !== undefined ? relatedProduct.inStock : hasStock;
                const isScheduled = relatedProduct.isScheduled && !relatedProduct.isReleased;
                
                // Get images for hover effect
                const getImageUrl = (img: any) => {
                  if (typeof img === 'string') return img;
                  return img?.url || img;
                };
                
                const coverImageUrl = relatedProduct.coverImage 
                  ? getImageUrl(relatedProduct.coverImage)
                  : (relatedProduct.images?.[0] ? getImageUrl(relatedProduct.images[0]) : '/placeholder-image.jpg');
                
                const secondImageUrl = relatedProduct.images?.[1] 
                  ? getImageUrl(relatedProduct.images[1])
                  : (relatedProduct.images?.[0] && relatedProduct.images[0] !== relatedProduct.coverImage 
                      ? getImageUrl(relatedProduct.images[0])
                      : null);
                
                const hasSecondImage = secondImageUrl && secondImageUrl !== coverImageUrl;

                return (
                  <RelatedProductCard
                    key={relatedProduct._id}
                    relatedProduct={relatedProduct}
                    productInStock={productInStock}
                    isScheduled={isScheduled}
                    coverImageUrl={coverImageUrl}
                    secondImageUrl={secondImageUrl}
                    hasSecondImage={hasSecondImage}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Related Product Card Component with Hover Effect
const RelatedProductCard = ({ 
  relatedProduct, 
  productInStock, 
  isScheduled,
  coverImageUrl,
  secondImageUrl,
  hasSecondImage
}: any) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className="group"
      onMouseEnter={() => hasSecondImage && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link 
        href={`/products/${relatedProduct._id}`}
        className="group"
      >
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 mb-3 sm:mb-4">
          {/* Cover Image - Hidden for scheduled products */}
          {!isScheduled && (
            <>
          <Image
            src={coverImageUrl}
            alt={relatedProduct.name}
            fill
            className={`object-cover transition-opacity duration-300 absolute inset-0 ${
              isHovered && hasSecondImage ? 'opacity-0' : 'opacity-100'
            }`}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-image.jpg';
            }}
          />
          
          {/* Second Image - Shows on hover */}
          {hasSecondImage && (
            <Image
              src={secondImageUrl}
              alt={relatedProduct.name}
              fill
              className={`object-cover transition-opacity duration-300 absolute inset-0 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-image.jpg';
              }}
            />
          )}
            </>
          )}
                      
          {/* Placeholder for scheduled products */}
          {isScheduled && (
            <div className="w-full h-full bg-gray-200 absolute inset-0" />
          )}
                      
                      
          {/* Sold Out Badge */}
          {!isScheduled && !productInStock && (
            <button
              disabled
              className="absolute top-2 left-2 bg-gray-800 text-white px-2.5 py-1 text-xs font-bold rounded uppercase tracking-wide z-10 cursor-default"
              style={{ pointerEvents: 'none' }}
            >
              Sold Out
            </button>
          )}
                      
          {/* Lock Overlay for Scheduled Products */}
          {isScheduled && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
              <div className="text-center text-white">
                <p className="text-xs sm:text-sm font-medium mb-1">🔒 Coming Soon</p>
                <p className="text-xs text-white/80">
                  {relatedProduct.releaseDate 
                    ? new Date(relatedProduct.releaseDate).toLocaleDateString()
                    : 'Scheduled Release'}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-3 sm:mt-4">
          <h3 className={`text-xs sm:text-sm font-medium leading-tight ${isScheduled ? 'text-gray-500' : 'text-gray-900'} group-hover:text-gray-700 transition-colors`}>
            {relatedProduct.name}
          </h3>
          <p className={`mt-1 text-sm sm:text-lg font-semibold ${isScheduled ? 'text-gray-400' : 'text-gray-900'}`}>
            {formatPrice(relatedProduct.price)}
          </p>
          {/* Star Rating for Related Products */}
          <div className="mt-2">
            <StarRating
              rating={relatedProduct.averageRating || 0}
              totalRatings={relatedProduct.totalRatings || 0}
              size="sm"
              showRating={true}
              interactive={false}
            />
          </div>
          {isScheduled && (
            <p className="mt-1 text-xs text-purple-600 font-medium">
              🔒 Scheduled Release
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};
