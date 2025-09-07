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
      
      // Sign out from NextAuth
      await signOut({ callbackUrl: '/' });
      
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
      router.push("/");
    }
  }, [LogoutSuccess, router]);

  // Additional security check - redirect if not admin
  useEffect(() => {
    if (mounted && (!user || user.role !== 'admin')) {
      router.push('/');
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
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0">
          <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <button
              className="lg:hidden text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          <nav className="mt-5 px-2">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    pathname === item.href
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      pathname === item.href ? "text-white" : "text-gray-400"
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
              <div
                className="group cursor-pointer text-gray-300 hover:bg-gray-700 hover:text-white flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 "
                onClick={handleLogout}
              >
                <LogOut className="text-white mr-3 h-5 w-5" />
                Logout
              </div>
            </div>
          </nav>
        </div>

        <div className="lg:ml-64">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </AdminProtected>
  );
}
