"use client";

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
    <div 
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-[90vw] sm:w-96 max-w-[500px] bg-white border border-gray-200 rounded-lg shadow-lg z-50"
    >
      {/* Search Input */}
      <div className="flex items-center border-b border-gray-200 px-4 py-3">
        <Search className="h-4 w-4 text-gray-400 mr-3" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm border-none outline-none placeholder-gray-400"
        />
      </div>

      {/* Search Results */}
      <div className="max-h-80 overflow-y-auto">
        {!debouncedQuery || debouncedQuery.length < 2 ? (
          <div className="px-4 py-6 text-center text-gray-500">
            <Search className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm">Type at least 2 characters to search</p>
          </div>
        ) : isLoading ? (
          <div className="px-4 py-6 text-center text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p className="text-sm">Searching...</p>
          </div>
        ) : error ? (
          <div className="px-4 py-6 text-center text-red-500">
            <p className="text-sm">Error searching products. Please try again.</p>
          </div>
        ) : searchResults?.products?.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-500">
            <Package className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm">No products found for "{debouncedQuery}"</p>
          </div>
        ) : (
          <div className="px-4 py-3">
            <div className="mb-2 text-xs text-gray-600">
              Found {searchResults?.count || 0} product(s)
            </div>
            <div className="space-y-2">
              {searchResults?.products?.slice(0, 5).map((product: any) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  onClick={handleClose}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={product.coverImage || product.images?.[0]?.url || "/placeholder.jpg"}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700 truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-medium text-gray-900">
                        {product.price} EGP
                      </span>
                      {product.category && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          {product.category.name}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
              {searchResults?.products?.length > 5 && (
                <div className="text-center py-2">
                  <p className="text-xs text-gray-500">
                    Showing 5 of {searchResults?.count} results
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
