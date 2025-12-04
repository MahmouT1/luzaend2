"use client";

import React from "react";
import { useGetBestsellingProductsQuery } from "@/redux/features/products/productApi";
import Products from "@/components/Products";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import StarRating from "@/components/StarRating";

export default function BestsellersPage() {
  const { data: bestsellers = [], isLoading, error } = useGetBestsellingProductsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Product Card Component with Hover Effect (same as Products.tsx)
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
            {/* Cover Image - Always visible */}
            <Image
              src={coverImageUrl}
              alt={product.name}
              width={400}
              height={500}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className={`w-full h-full object-cover transition-opacity duration-300 absolute inset-0 ${
                isHovered && hasSecondImage ? 'opacity-0' : 'opacity-100'
              } ${isScheduled ? 'opacity-50' : ''}`}
              loading={index < 8 ? "eager" : "lazy"}
              priority={index < 4}
              quality={85}
              onError={(e) => {
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
                } ${isScheduled ? 'opacity-50' : ''}`}
                loading="lazy"
                quality={85}
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.svg';
                }}
              />
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
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center z-10">
                <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                          
                {releaseDate && (
                  <div className="text-center">
                    <p className="text-white text-sm font-medium mb-1">Coming Soon</p>
                    <p className="text-white text-xs">
                      {new Date(releaseDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-white text-xs">
                      {new Date(releaseDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="mt-3 sm:mt-4">
            <h3 className={`text-xs sm:text-sm font-medium leading-tight ${isScheduled ? 'text-gray-500' : 'text-gray-900'}`}>
              {product.name}
            </h3>
            <p className={`mt-1 text-sm sm:text-lg font-semibold ${isScheduled ? 'text-gray-400' : 'text-gray-900'}`}>
              {formatPrice(product.price)}
            </p>
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading bestsellers...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">Error loading bestsellers. Please try again later.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-gray-900 mb-4">
            Bestsellers
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl">
            Discover our most loved pieces, handpicked by our customers. Each piece is crafted with 
            exceptional attention to detail and quality materials.
          </p>
        </div>

        {/* Products Grid */}
        {bestsellers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {bestsellers.map((product: any, index: number) => {
              // Calculate stock status
              const hasStock = product.info && product.info.some((item: any) => item.quantity > 0);
              const productInStock = product.inStock !== undefined ? product.inStock : hasStock;
              const isScheduled = product.isScheduled && !product.isReleased;
              const releaseDate = product.releaseDate;
              
              // Get images for hover effect
              const getImageUrl = (img: any) => {
                if (typeof img === 'string') return img;
                return img?.url || img;
              };
              
              const coverImageUrl = product.coverImage 
                ? getImageUrl(product.coverImage)
                : (product.images?.[0] ? getImageUrl(product.images[0]) : '/placeholder-image.jpg');
              
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
            <p className="text-gray-500">No bestsellers found at the moment.</p>
          </div>
        )}

        {/* Why Our Customers Love These Section */}
        <div className="mt-16 sm:mt-20 bg-gray-50 p-6 sm:p-8 lg:p-12 rounded-lg">
          <h2 className="text-xl sm:text-2xl font-light text-gray-900 mb-6 sm:mb-8">
            Why Our Customers Love These
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { title: 'Superior Craftsmanship', description: 'Each piece is meticulously crafted by skilled artisans' },
              { title: 'High-Quality Materials', description: 'We use only the finest materials for lasting beauty' },
              { title: 'Timeless Designs', description: 'Classic styles that never go out of fashion' }
            ].map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <svg className="h-5 w-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{feature.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
