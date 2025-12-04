"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  PackageIcon,
  ShoppingCartIcon,
  TagIcon,
  ChartBarIcon,
  MenuIcon,
  XIcon,
  LogOut,
} from "lucide-react";
import { useLogOutMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import AdminProtected from "@/hooks/AdminProtected";
import { signOut, useSession } from "next-auth/react";
import { useSelector } from "react-redux";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [Logout, { isSuccess: LogoutSuccess }] = useLogOutMutation();
  const { data } = useSession();
  const { user } = useSelector((state: any) => state.auth);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: HomeIcon },
    { name: "Products", href: "/admin/products", icon: PackageIcon },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCartIcon },
    { name: "Categories", href: "/admin/categories", icon: TagIcon },
    { name: "Analytics", href: "/admin/analytics", icon: ChartBarIcon },
  ];

  const handleLogout = async () => {
    try {
      // Call server logout endpoint first
      await Logout({});
      
      // Clear any stored data
      localStorage.removeItem("googleUserSynced");
      localStorage.removeItem("userData");
      
      // Sign out from NextAuth - redirect to admin login
      await signOut({ callbackUrl: '/admin-panel/login' });
      
    } catch (error) {
      console.error("Admin logout error:", error);
      // Even if there's an error, try to sign out from NextAuth
      try {
        await signOut({ callbackUrl: '/' });
      } catch (signOutError) {
        console.error("Admin SignOut error:", signOutError);
      }
    }
  };

  useEffect(() => {
    if (LogoutSuccess) {
      toast.success("logged out");
      router.push("/admin-panel/login");
    }
  }, [LogoutSuccess, router]);

  // Additional security check - redirect to new admin panel login
  useEffect(() => {
    if (mounted && (!user || user.role !== 'admin')) {
      router.push('/admin-panel/login');
    }
  }, [mounted, user, router]);

  // Don't render until mounted or if not admin
  if (!mounted || (mounted && (!user || user.role !== 'admin'))) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar - Full Height */}
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 to-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-2xl">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-20 px-6 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-white" />
              </div>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            </div>
            <button
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                <Link
                  key={item.name}
                  href={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <item.icon
                      className={`mr-3 h-5 w-5 transition-transform duration-200 ${
                        isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                      } ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                  />
                    <span className="flex-1">{item.name}</span>
                    {isActive && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="px-4 py-4 border-t border-gray-700">
              <div
              className="group cursor-pointer text-gray-300 hover:bg-red-600 hover:text-white flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
                onClick={handleLogout}
              >
              <LogOut className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
              <span>Logout</span>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="px-4 py-4 border-t border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="min-h-screen">{children}</div>
        </div>
      </div>
    </AdminProtected>
  );
}
