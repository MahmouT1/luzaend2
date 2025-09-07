"use client";
import { formatPrice } from "@/lib/utils";
import { useGetProductsByCategoryQuery } from "@/redux/features/products/productApi";
import { PackageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Products = ({ name }: any) => {
  const [products, setProducts] = useState([]);
  const { data, isLoading, isSuccess, error } =
    useGetProductsByCategoryQuery(name);

  useEffect(() => {
    if (isSuccess && data) {
      setProducts(data);
    }
  }, [isSuccess]);

  if (name === "new-arrival") {
    name = "new arrivals";
  }
  return (
    <>
      {/* Header Video Background */}
      <section className="relative h-[40vh] sm:h-[50vh] bg-black">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover opacity-70"
          src="/header.mp4"
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
        {products?.length !== 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {" "}
            {products?.map((product, index) => {
              // Check if product is scheduled and not yet released
              const isScheduled = product.isScheduled && !product.isReleased;
              const releaseDate = product.releaseDate ? new Date(product.releaseDate) : null;
              
              return (
                <div key={product._id} className="group">
                  <Link href={`/products/${product._id}`} className="group">
                    <div className="aspect-[3/4] sm:aspect-[4/5] rounded-lg overflow-hidden bg-gray-100 relative">
                      <Image
                        src={
                          typeof product.images[0] === 'string' 
                            ? product.images[0] 
                            : product.images[0]?.url || product.coverImage
                        }
                        alt={product.name}
                        width={400}
                        height={500}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                          isScheduled ? 'opacity-50' : ''
                        }`}
                        onError={(e) => {
                          console.log('Image failed to load:', e.currentTarget.src);
                          e.currentTarget.src = '/placeholder-image.svg';
                        }}
                      />
                      
                      {/* Lock Overlay for Scheduled Products */}
                      {isScheduled && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center">
                          {/* Lock Icon */}
                          <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          
                          {/* Release Date */}
                          {releaseDate && (
                            <div className="text-center">
                              <p className="text-white text-sm font-medium mb-1">Coming Soon</p>
                              <p className="text-white text-xs">
                                {releaseDate.toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                              <p className="text-white text-xs">
                                {releaseDate.toLocaleTimeString('en-US', {
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
                      {isScheduled && (
                        <p className="mt-1 text-xs text-purple-600 font-medium">
                          🔒 Scheduled Release
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`text-center py-12 ${isLoading && "hidden"}`}>
            <PackageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
          </div>
        )}
      </div>

      {/* Advertisement Banner - Only for new-arrival category */}
      {name === "new arrivals" && (
        <div className="w-full mt-6 sm:mt-12 px-3 sm:px-0">
          <div className="relative overflow-hidden rounded-lg sm:rounded-none">
            <Image
              src="/bann category.jpg"
              alt="Advertisement Banner"
              width={1920}
              height={450}
              className="w-full h-[12rem] sm:h-[28rem] object-cover animate-[gentle-float_4s_ease-in-out_infinite] hover:scale-105 transition-transform duration-700 ease-in-out"
              priority={false}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Products;
