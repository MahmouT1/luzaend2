"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBagIcon, MenuIcon, SearchIcon, XIcon } from "./icons/SimpleIcons";
import User from "./User";
import SearchDropdown from "./SearchDropdown";
import { useGetCategoriesQuery } from "@/redux/features/categories/categoryApi";
import { useDispatch, useSelector } from "react-redux";
import { getTotals } from "@/redux/features/cart/cartSlice";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  // Check if we're on home page (only transparent on home page)
  const isHomePage = pathname === "/";
  // Check if we're on categories page
  const isCategoriesPage = pathname?.startsWith("/categories");
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarItems, setSidbarItems] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // Initialize based on page to prevent hydration mismatch
  const [isHeaderHovered, setIsHeaderHovered] = useState(!isHomePage);
  const { data, isSuccess } = useGetCategoriesQuery({});
  const { cartItems, cartTotalQty } = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();
  
  // Determine initial header state based on page (prevents hydration mismatch)
  const shouldShowWhiteBackground = !isHomePage || isHeaderHovered;

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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHomePage 
          ? 'bg-transparent text-white' 
          : 'bg-white text-black'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between ${isCategoriesPage ? 'h-12 sm:h-14' : 'h-14 sm:h-16'}`}>
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
  
  // Use the computed value for background
  const navClassName = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    shouldShowWhiteBackground
      ? 'bg-white text-black' 
      : 'bg-transparent text-white'
  }`;

  return (
    <>
      {/* Main Navbar - Like Louis Vuitton */}
      <nav
        onMouseEnter={() => isHomePage && setIsHeaderHovered(true)}
        onMouseLeave={() => isHomePage && setIsHeaderHovered(false)}
        className={navClassName}
        style={{ position: 'fixed', top: 0 }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            {/* Left Side - Menu and Search */}
            <div className="flex items-center space-x-3 sm:space-x-6 md:space-x-8">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center space-x-1.5 sm:space-x-2 hover:opacity-70 transition-opacity"
              >
                <MenuIcon size={16} className="sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm md:text-base font-light tracking-wide hidden sm:inline">Menu</span>
              </button>

              <div className="relative">
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="flex items-center space-x-1.5 sm:space-x-2 hover:opacity-70 transition-opacity"
                >
                  <SearchIcon size={16} className="sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm md:text-base font-light tracking-wide hidden sm:inline">Search</span>
                </button>
                <SearchDropdown 
                  isOpen={isSearchOpen} 
                  onClose={() => setIsSearchOpen(false)} 
                />
              </div>
            </div>

            {/* Center - Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link href="/">
                <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-light tracking-wider uppercase whitespace-nowrap">
                  LUZA'S CULTURE
                </span>
              </Link>
            </div>

            {/* Right Side - Contact, User, Cart */}
            <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
              <Link 
                href="/contact"
                className="text-xs sm:text-sm md:text-base font-light tracking-wide hover:opacity-70 transition-opacity hidden sm:inline"
              >
                Contact Us
              </Link>
              
              <div className={shouldShowWhiteBackground ? '[&_*]:text-black' : '[&_*]:text-white'}>
              <User />
              </div>
              
              <Link
                href="/cart"
                className="relative hover:opacity-70 transition-opacity"
              >
                <ShoppingBagIcon size={16} className="sm:w-5 sm:h-5" />
                {cartTotalQty > 0 && (
                  <span className={`absolute -top-1 -right-2 rounded-full h-4 w-4 flex items-center justify-center text-[10px] sm:text-xs ${
                    shouldShowWhiteBackground
                      ? 'bg-black text-white' 
                      : 'bg-white text-black'
                  }`}>
                    {cartTotalQty}
                  </span>
                )}
              </Link>
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
          <div className="fixed right-0 top-0 h-full w-full sm:w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">Services</h3>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XIcon size={20} />
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
