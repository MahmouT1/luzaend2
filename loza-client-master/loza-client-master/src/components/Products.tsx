"use client";
import { formatPrice } from "@/lib/utils";
import { useGetProductsByCategoryQuery } from "@/redux/features/products/productApi";
import { PackageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import StarRating from "./StarRating";
import { mediaUrls } from "@/config/mediaUrls";

// Product Card Component with Hover Effect
const ProductCard = ({ 
  product, 
  index, 
  productInStock, 
  isScheduled, 
  releaseDate,
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
        href={`/products/${product._id}`} 
        className="group"
        prefetch={index < 8}
      >
        <div className="aspect-[3/4] sm:aspect-[4/5] rounded-lg overflow-hidden bg-gray-100 relative">
          {/* Cover Image - Hidden for scheduled products */}
          {!isScheduled && (
            <>
              <Image
                src={coverImageUrl}
                alt={product.name}
                width={400}
                height={500}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className={`w-full h-full object-cover transition-opacity duration-300 absolute inset-0 ${
                  isHovered && hasSecondImage ? 'opacity-0' : 'opacity-100'
                }`}
                loading={index < 8 ? "eager" : "lazy"}
                priority={index < 4}
                quality={85}
                onError={(e) => {
                  console.log('Image failed to load:', e.currentTarget.src);
                  e.currentTarget.src = '/placeholder-image.svg';
                }}
              />
              
              {/* Second Image - Shows on hover */}
              {hasSecondImage && (
                <Image
                  src={secondImageUrl}
                  alt={product.name}
                  width={400}
                  height={500}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className={`w-full h-full object-cover transition-opacity duration-300 absolute inset-0 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                  quality={85}
                  onError={(e) => {
                    console.log('Second image failed to load:', e.currentTarget.src);
                    e.currentTarget.src = '/placeholder-image.svg';
                  }}
                />
              )}
            </>
          )}
          
          {/* Placeholder for scheduled products - solid gray background */}
          {isScheduled && (
            <div className="w-full h-full bg-gray-200 absolute inset-0" />
          )}
                      
          {/* Sold Out Badge - Show if product is out of stock */}
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
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-10">
              {/* Lock Icon */}
              <div className="w-16 h-16 bg-white bg-opacity-95 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
                          
              {/* Coming Soon Text - No release date shown */}
              <div className="text-center">
                <p className="text-white text-sm font-light tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Coming Soon</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 sm:mt-4">
          <h3 className={`text-xs sm:text-sm font-product-name leading-tight ${isScheduled ? 'text-gray-500' : 'text-gray-900'}`}>
            {product.name}
          </h3>
          <div className={`mt-1 flex flex-col ${isScheduled ? 'text-gray-400' : ''}`}>
            {product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price ? (
              <>
                <span className={`text-xs font-price line-through ${isScheduled ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatPrice(product.price)}
                </span>
                <span className={`text-xs sm:text-sm font-price-bold ${isScheduled ? 'text-gray-400' : 'text-gray-900'}`}>
                  {formatPrice(product.discountPrice)}
                </span>
              </>
            ) : (
              <span className={`text-xs sm:text-sm font-price-bold ${isScheduled ? 'text-gray-400' : 'text-gray-900'}`}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {/* Star Rating */}
          <div className="mt-2">
            <StarRating
              rating={product.averageRating || 0}
              totalRatings={product.totalRatings || 0}
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

const Products = ({ name }: any) => {
  const { data: products = [], isLoading } =
    useGetProductsByCategoryQuery(name, {
      refetchOnMountOrArgChange: true, // Refetch when component mounts or name changes
      refetchOnFocus: true, // Refetch when window regains focus
    });

  if (name === "new-arrival") {
    name = "new arrivals";
  }
  return (
    <>
      {/* Header Video Background */}
      <section className="relative h-[40vh] sm:h-[50vh] bg-black mt-14 sm:mt-16 md:mt-20">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute w-full h-full object-cover opacity-70"
          src={mediaUrls.headerVideo}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="text-center text-white">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-light tracking-tight mb-2 sm:mb-4 capitalize">
              {name}
            </h1>
            <p className="text-sm sm:text-xl md:text-2xl font-light tracking-wide">
              Discover our collection of {name.toLowerCase()}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] sm:aspect-[4/5] rounded-lg bg-gray-200" />
                <div className="mt-3 sm:mt-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-5 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products?.length !== 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {products?.map((product, index) => {
              // Recalculate inStock based on info array to ensure accuracy
              const hasStock = product.info && Array.isArray(product.info) && product.info.some((item: any) => (item.quantity || 0) > 0);
              const productInStock = product.inStock !== undefined ? product.inStock : hasStock;
              
              // Check if product is scheduled and not yet released
              const isScheduled = product.isScheduled && !product.isReleased;
              const releaseDate = product.releaseDate ? new Date(product.releaseDate) : null;
              
              // Get images
              const getImageUrl = (img: any) => {
                if (typeof img === 'string') return img;
                return img?.url || img;
              };
              
              const coverImageUrl = product.coverImage 
                ? getImageUrl(product.coverImage)
                : (product.images?.[0] ? getImageUrl(product.images[0]) : '/placeholder-image.svg');
              
              const secondImageUrl = product.images?.[1] 
                ? getImageUrl(product.images[1])
                : (product.images?.[0] && product.images[0] !== product.coverImage 
                    ? getImageUrl(product.images[0])
                    : null);
              
              const hasSecondImage = secondImageUrl && secondImageUrl !== coverImageUrl;
              
              return (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={index}
                  productInStock={productInStock}
                  isScheduled={isScheduled}
                  releaseDate={releaseDate}
                  coverImageUrl={coverImageUrl}
                  secondImageUrl={secondImageUrl}
                  hasSecondImage={hasSecondImage}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <PackageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
          </div>
        )}
      </div>

    </>
  );
};

export default Products;
