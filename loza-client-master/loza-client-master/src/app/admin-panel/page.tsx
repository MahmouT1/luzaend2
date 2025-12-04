'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { 
  PackageIcon, 
  ShoppingCartIcon, 
  TagIcon, 
  ChartBarIcon,
  ArrowRightIcon,
  TrendingUpIcon,
  DollarSignIcon,
  UsersIcon,
  CheckCircleIcon
} from 'lucide-react';
import { useGetAllOrdersQuery } from '@/redux/features/orders/orderApi';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const { data: ordersData } = useGetAllOrdersQuery({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics from orders
  const totalOrders = ordersData?.orders?.length || 0;
  const totalRevenue = ordersData?.orders?.reduce((sum: number, order: any) => 
    sum + (order.finalAmount || order.totalPrice || 0), 0) || 0;
  const completedOrders = ordersData?.orders?.filter((order: any) => 
    order.orderStatus === 'Complete' || order.orderStatus === 'Delivered').length || 0;

  // Main navigation cards
  const mainCards = [
    {
      title: "Orders",
      description: "Manage and track all customer orders",
      href: "/admin-panel/orders",
      icon: ShoppingCartIcon,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-500",
      stats: totalOrders,
      statsLabel: "Total Orders",
      secondaryStats: completedOrders,
      secondaryLabel: "Completed"
    },
    {
      title: "Products",
      description: "Add, edit, and manage your product catalog",
      href: "/admin-panel/products",
      icon: PackageIcon,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      iconBg: "bg-purple-500",
      stats: "Manage",
      statsLabel: "Product Catalog"
    },
    {
      title: "Categories",
      description: "Organize products into categories",
      href: "/admin-panel/categories",
      icon: TagIcon,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
      iconBg: "bg-green-500",
      stats: "Organize",
      statsLabel: "Product Categories"
    },
    {
      title: "Analytics",
      description: "View detailed reports and insights",
      href: "/admin-panel/analytics",
      icon: ChartBarIcon,
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
      iconBg: "bg-orange-500",
      stats: "Reports",
      statsLabel: "Business Insights"
    },
  ];

  // Quick stats cards
  const quickStats = [
    {
      title: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSignIcon,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingCartIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Completed Orders",
      value: completedOrders.toString(),
      icon: CheckCircleIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Completion Rate",
      value: totalOrders > 0 ? `${Math.round((completedOrders / totalOrders) * 100)}%` : "0%",
      icon: TrendingUpIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'Admin'} 👋
          </h1>
          <p className="text-lg text-gray-600">
            Manage your store and track performance from one place
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {quickStats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-4 rounded-xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {mainCards.map((card, index) => (
            <Link
              key={index}
              href={card.href}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="relative p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className={`${card.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <card.icon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-white transition-colors duration-300">
                      {card.title}
                    </h2>
                    <p className="text-gray-600 text-lg group-hover:text-gray-100 transition-colors duration-300">
                      {card.description}
                    </p>
                  </div>
                  <div className={`bg-gradient-to-br ${card.gradient} w-12 h-12 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:rotate-12`}>
                    <ArrowRightIcon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Stats Section */}
                <div className="mt-6 pt-6 border-t border-gray-200 group-hover:border-gray-300 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 group-hover:text-gray-300 transition-colors duration-300">
                        {card.statsLabel}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1 group-hover:text-white transition-colors duration-300">
                        {card.stats}
                      </p>
                    </div>
                    {card.secondaryStats !== undefined && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500 group-hover:text-gray-300 transition-colors duration-300">
                          {card.secondaryLabel}
                        </p>
                        <p className="text-xl font-bold text-gray-900 mt-1 group-hover:text-white transition-colors duration-300">
                          {card.secondaryStats}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className={`absolute inset-0 border-2 border-transparent group-hover:border-${card.gradient.split(' ')[1]} rounded-3xl transition-all duration-500`}></div>
            </Link>
          ))}
        </div>

        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Ready to manage your store?</h3>
              <p className="text-purple-100 text-lg">
                Use the navigation cards above to access different sections of your admin panel
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <CheckCircleIcon className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
