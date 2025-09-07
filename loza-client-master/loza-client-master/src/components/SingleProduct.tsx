"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Buttonn";
import { formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useGetSingleProductQuery } from "@/redux/features/products/productApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cart/cartSlice";
import RecentBuyersPanel from "./RecentBuyersPanel";

export default function SingleProduct({ productId }: any) {
  const { data, isLoading, isSuccess } = useGetSingleProductQuery(productId);
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const dispatch = useDispatch();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setProduct(data);
      console.log("Product data:", data);
      console.log("Product images:", data?.images);
      console.log("Product cover image:", data?.coverImage);
      console.log("Images length:", data?.images?.length);
      console.log("Recent purchases:", data?.recentPurchases);
      console.log("Recent purchases length:", data?.recentPurchases?.length);
    }
  }, [data, isSuccess]);

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
    
    // Add to cart
    try {
      dispatch(addToCart({ product, size: selectedSize, quantity }));
      toast.success("Added to cart successfully!");
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };



  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
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



  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {product && (
            <>
              {/* Image Gallery */}
              <div className="lg:col-span-1 space-y-4">
                {product.images && product.images.length > 0 ? (
                  <>
                    {/* Main Image Display */}
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 relative group cursor-pointer">
                      <Image
                        src={
                          currentImageIndex === 0 
                            ? (product.coverImage || product.images[0]?.url) 
                            : product.images[currentImageIndex]?.url
                        }
                        alt={product.name}
                        width={800}
                        height={1000}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        priority
                        onClick={() => {
                          if (product.images.length > 1) {
                            setCurrentImageIndex(prev => 
                              prev === product.images.length - 1 ? 0 : prev + 1
                            );
                          }
                        }}
                        onError={(e) => {
                          console.error('Image load error:', e);
                          e.currentTarget.src = '/placeholder-image.jpg';
                        }}
                      />
                      
                      {/* Navigation Arrows */}
                      {product.images.length > 1 && (
                        <>
                          <button
                            onClick={() => setCurrentImageIndex(prev => 
                              prev === 0 ? product.images.length - 1 : prev - 1
                            )}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setCurrentImageIndex(prev => 
                              prev === product.images.length - 1 ? 0 : prev + 1
                            )}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}
                      
                      {/* Image Counter */}
                      {product.images.length > 1 && (
                        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {product.images.length}
                        </div>
                      )}
                    </div>
                    
                    {/* Thumbnail Navigation */}
                    {product.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {/* Cover Image Thumbnail */}
                        <button
                          onClick={() => setCurrentImageIndex(0)}
                          className={`aspect-[3/4] rounded-md overflow-hidden bg-gray-100 border-2 transition-all duration-200 relative ${
                            currentImageIndex === 0 
                              ? 'border-blue-500 ring-2 ring-blue-200' 
                              : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <Image
                            src={product.coverImage || product.images[0]?.url}
                            alt={`${product.name} cover`}
                            width={200}
                            height={250}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Thumbnail image load error:', e);
                              e.currentTarget.src = '/placeholder-image.jpg';
                            }}
                          />
                        </button>
                        
                        {/* Additional Images Thumbnails */}
                        {product.images.slice(1).map((image, index: number) => (
                          <button
                            key={index + 1}
                            onClick={() => setCurrentImageIndex(index + 1)}
                            className={`aspect-[3/4] rounded-md overflow-hidden bg-gray-100 border-2 transition-all duration-200 relative ${
                              currentImageIndex === index + 1 
                                ? 'border-blue-500 ring-2 ring-blue-200' 
                                : 'border-transparent hover:border-gray-300'
                            }`}
                          >
                            <Image
                              src={image.url}
                              alt={`${product.name} ${index + 2}`}
                              width={200}
                              height={250}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error('Thumbnail image load error:', e);
                                e.currentTarget.src = '/placeholder-image.jpg';
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Title and Price */}
                <div>
                  <h1 className="text-3xl font-light tracking-tight text-gray-900">
                    {product.name}
                  </h1>
                  <div className="mt-4 flex items-baseline space-x-2">
                    <span className="text-3xl font-light text-gray-900">
                      {formatPrice(product.price)}
                    </span>
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
                            className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors relative ${
                              isOutOfStock
                                ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                                : isSelected
                                ? "border-black bg-black text-white"
                                : "border-gray-300 text-gray-700 hover:border-gray-400"
                            }`}
                          >
                            {info.size}
                            {isOutOfStock && (
                              <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                                ✕
                              </span>
                            )}
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
                  
                  {/* Stock Information */}
                  {selectedSize && product.info && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      {(() => {
                        const selectedSizeInfo = product.info.find((info: any) => info.size === selectedSize);
                        if (!selectedSizeInfo) return null;
                        
                        const stock = selectedSizeInfo.quantity;
                        if (stock <= 0) {
                          return (
                            <p className="text-red-600 text-sm font-medium">
                              ❌ Out of Stock - This size is currently unavailable
                            </p>
                          );
                        } else if (stock <= 2) {
                          return (
                            <p className="text-orange-600 text-sm font-medium">
                              ⚠️ Hurry! Only {stock} {stock === 1 ? 'piece' : 'pieces'} left in stock
                            </p>
                          );
                        } else {
                          return (
                            <p className="text-green-600 text-sm font-medium">
                              ✅ {stock} pieces available in stock
                            </p>
                          );
                        }
                      })()}
                    </div>
                  )}
                </div>

                {/* Quantity Selection */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Quantity
                  </h3>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 min-w-[2rem] text-center">{quantity}</span>
                    <button
                      onClick={() => {
                        const selectedSizeInfo = product.info?.find((info: any) => info.size === selectedSize);
                        const maxQuantity = selectedSizeInfo?.quantity || 0;
                        if (quantity < maxQuantity) {
                          setQuantity(quantity + 1);
                        }
                      }}
                      className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50"
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
                <div className="space-y-4">
                  {/* Check if product is scheduled and not yet released */}
                  {product.isScheduled && !product.isReleased ? (
                    <div className="space-y-4">
                      {/* Lock Icon and Release Info */}
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200 text-center">
                        <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
                        <p className="text-gray-600 mb-4">This product will be available on:</p>
                        {product.releaseDate && (
                          <div className="bg-white p-4 rounded-lg border">
                            <p className="text-2xl font-bold text-purple-600">
                              {new Date(product.releaseDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-lg text-gray-600 mt-1">
                              at {new Date(product.releaseDate).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        )}
                        <p className="text-sm text-gray-500 mt-4">
                          🔒 This product is currently locked and cannot be purchased until the release date.
                        </p>
                      </div>
                      
                      {/* Disabled Buttons */}
                      <Button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
                      >
                        🔒 Product Locked
                      </Button>
                      <Button
                        disabled
                        className="w-full bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed"
                      >
                        🔒 Not Available Yet
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Button
                        onClick={handleAddToCart}
                        className="w-full bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                      >
                        Add to Cart
                      </Button>
                      <Button
                        // onClick={handleBuyNow}
                        // disabled={!selectedSize}
                        className="w-full bg-white text-black border border-black hover:bg-gray-100 disabled:opacity-50"
                      >
                        Buy Now
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Buyers Panel */}
              <div className="lg:col-span-1">
                {product.recentPurchases && product.recentPurchases.length > 0 && (
                  <RecentBuyersPanel 
                    recentPurchases={product.recentPurchases} 
                    productName={product.name}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
