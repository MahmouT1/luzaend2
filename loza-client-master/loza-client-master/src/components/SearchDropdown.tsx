"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import { Search, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearchProductsQuery } from "@/redux/features/products/productApi";

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchDropdown({ isOpen, onClose }: SearchDropdownProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Search products
  const { data: searchResults, isLoading, error } = useSearchProductsQuery(
    debouncedQuery,
    {
      skip: !debouncedQuery || debouncedQuery.length < 2,
    }
  );

  const handleClose = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile: Full-screen overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[60] sm:hidden transition-opacity"
        onClick={handleClose}
      />
      
      {/* Search Panel: Sidebar on mobile, dropdown on desktop */}
      <div 
        ref={dropdownRef}
        className="fixed sm:absolute top-0 sm:top-full left-0 sm:left-auto sm:right-0 h-screen sm:h-auto w-[90vw] sm:w-96 sm:max-w-[500px] sm:mt-2 bg-white shadow-2xl sm:shadow-lg z-[70] flex flex-col sm:rounded-lg overflow-hidden"
      >
        {/* Header with Search Input */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 sm:py-3 bg-white sticky top-0 z-10">
          <div className="flex items-center flex-1">
            <Search className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 text-base sm:text-sm border-none outline-none placeholder-gray-400 bg-transparent"
            />
          </div>
          <button
            onClick={handleClose}
            className="ml-3 text-gray-500 hover:text-gray-700 sm:hidden flex-shrink-0"
            aria-label="Close search"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto sm:max-h-80">
        {!debouncedQuery || debouncedQuery.length < 2 ? (
          <div className="px-4 py-8 sm:py-6 text-center text-gray-500">
            <Search className="h-10 w-10 sm:h-8 sm:w-8 text-gray-300 mx-auto mb-3 sm:mb-2" />
            <p className="text-base sm:text-sm">Type at least 2 characters to search</p>
          </div>
        ) : isLoading ? (
          <div className="px-4 py-8 sm:py-6 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-6 sm:w-6 border-b-2 border-gray-900 mx-auto mb-3 sm:mb-2"></div>
            <p className="text-base sm:text-sm">Searching...</p>
          </div>
        ) : error ? (
          <div className="px-4 py-8 sm:py-6 text-center text-red-500">
            <p className="text-base sm:text-sm">Error searching products. Please try again.</p>
          </div>
        ) : searchResults?.products?.length === 0 ? (
          <div className="px-4 py-8 sm:py-6 text-center text-gray-500">
            <Package className="h-10 w-10 sm:h-8 sm:w-8 text-gray-300 mx-auto mb-3 sm:mb-2" />
            <p className="text-base sm:text-sm">No products found for "{debouncedQuery}"</p>
          </div>
        ) : (
          <div className="px-4 py-4 sm:py-3">
            <div className="mb-3 sm:mb-2 text-sm sm:text-xs text-gray-600 font-medium">
              Found {searchResults?.count || 0} product{searchResults?.count !== 1 ? 's' : ''}
            </div>
            <div className="space-y-2 sm:space-y-1.5">
              {searchResults?.products?.slice(0, 5).map((product: any) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  onClick={handleClose}
                  className="flex items-center space-x-3 sm:space-x-2 p-3 sm:p-2 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors group border border-transparent hover:border-gray-200"
                >
                  <div className="w-16 h-16 sm:w-12 sm:h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                    <Image
                      src={product.coverImage || product.images?.[0]?.url || "/placeholder.jpg"}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-sm font-semibold text-gray-900 group-hover:text-gray-700 truncate mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm sm:text-xs text-gray-500 truncate mb-2 sm:mb-1">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-base sm:text-sm font-bold text-gray-900">
                        {product.price} EGP
                      </span>
                      {product.category && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {product.category.name}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              {searchResults?.products?.length > 5 && (
                <div className="text-center py-3 sm:py-2 border-t border-gray-100 mt-3 sm:mt-2">
                  <p className="text-sm sm:text-xs text-gray-500">
                    Showing 5 of {searchResults?.count} results
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
