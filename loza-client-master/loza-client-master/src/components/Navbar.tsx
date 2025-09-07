"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Home, ShoppingCart, Menu, Search, X } from "lucide-react";
import User from "./User";
import SearchDropdown from "./SearchDropdown";
import { useGetCategoriesQuery } from "@/redux/features/categories/categoryApi";
import { useDispatch, useSelector } from "react-redux";
import { getTotals } from "@/redux/features/cart/cartSlice";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarItems, setSidbarItems] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data, isSuccess } = useGetCategoriesQuery({});
  const { cartItems, cartTotalQty } = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      setSidbarItems(data.categories);
    }
  }, [isSuccess]);

  useEffect(() => {
    dispatch(getTotals({}));
  }, [cartItems, dispatch]);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Main Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Text Only */}
            <div className="flex items-center">
              <span
                className="text-2xl font-bold text-black uppercase tracking-wider"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Loza's Culture
              </span>
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-black transition-colors"
              >
                <Home size={20} />
              </Link>

              <Link
                href="/cart"
                className="relative text-gray-700 hover:text-black transition-colors"
              >
                <ShoppingCart size={25} />

                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartTotalQty}
                </span>
              </Link>

              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-gray-700 hover:text-black transition-colors"
              >
                <Menu size={20} />
              </button>

              <div className="relative">
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="text-gray-700 hover:text-black transition-colors"
                >
                  <Search size={20} />
                </button>
                <SearchDropdown 
                  isOpen={isSearchOpen} 
                  onClose={() => setIsSearchOpen(false)} 
                />
              </div>

              <User />
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">Services</h3>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <ul className="space-y-2">
                {sidebarItems?.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={`/categories/${item.name}`}
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
              

            </div>
          </div>
        </div>
      )}

    </>
  );
}
