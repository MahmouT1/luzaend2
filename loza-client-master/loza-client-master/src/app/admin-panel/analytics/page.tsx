'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  ChartBarIcon, 
  TrendingUpIcon, 
  TrendingDownIcon,
  ShoppingCartIcon, 
  DollarSignIcon,
  CheckCircleIcon,
  ClockIcon,
  PackageIcon,
  UsersIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { 
  useGetAnalyticsOverviewQuery, 
  useGetSalesTrendQuery, 
  useGetTopProductsQuery 
} from '@/redux/features/analytics/analyticsApi';
import { useGetAllOrdersQuery } from '@/redux/features/orders/orderApi';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');
  const [mounted, setMounted] = useState(false);

  // Fetch analytics data
  const { data: overviewResponse, isLoading: overviewLoading, refetch: refetchOverview } = useGetAnalyticsOverviewQuery({});
  const { data: salesResponse, isLoading: salesLoading, refetch: refetchSales } = useGetSalesTrendQuery(dateRange);
  const { data: productsResponse, isLoading: productsLoading, refetch: refetchProducts } = useGetTopProductsQuery(10);
  const { data: ordersResponse } = useGetAllOrdersQuery({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate real statistics from orders
  const realStats = useMemo(() => {
    if (!ordersResponse?.orders) return null;

    const orders = ordersResponse.orders;
    const totalOrders = orders.length;
    
    // Calculate revenue from all orders (using finalAmount or totalPrice)
    const totalRevenue = orders.reduce((sum: number, order: any) => 
      sum + (order.finalAmount || order.totalPrice || 0), 0);
    
    // Calculate by status
    const completedOrders = orders.filter((order: any) => 
      order.orderStatus === 'Complete' || order.orderStatus === 'Delivered'
    ).length;
    
    const pendingOrders = orders.filter((order: any) => 
      order.orderStatus === 'Pending'
    ).length;
    
    const confirmedOrders = orders.filter((order: any) => 
      order.orderStatus === 'Confirmed'
    ).length;
    
    const shippedOrders = orders.filter((order: any) => 
      order.orderStatus === 'Shipped'
    ).length;
    
    const canceledOrders = orders.filter((order: any) => 
      order.orderStatus === 'Canceled'
    ).length;

    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate completion rate
    const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

    // Calculate total items sold
    const totalItemsSold = orders.reduce((sum: number, order: any) => {
      if (order.orderItems && Array.isArray(order.orderItems)) {
        return sum + order.orderItems.reduce((itemSum: number, item: any) => 
          itemSum + (item.quantity || 0), 0);
      }
      return sum;
    }, 0);

    // Calculate points statistics
    const totalPointsEarned = orders.reduce((sum: number, order: any) => 
      sum + (order.pointsEarned || 0), 0);
    const totalPointsUsed = orders.reduce((sum: number, order: any) => 
      sum + (order.pointsUsed || 0), 0);
    const totalPointsDiscount = orders.reduce((sum: number, order: any) => 
      sum + (order.pointsDiscount || 0), 0);

    return {
      totalOrders,
      totalRevenue,
      completedOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      canceledOrders,
      averageOrderValue,
      completionRate,
      totalItemsSold,
      totalPointsEarned,
      totalPointsUsed,
      totalPointsDiscount
    };
  }, [ordersResponse]);

  // Get overview data from API
  const overviewData = overviewResponse?.overview;
  const salesData = salesResponse?.salesData || [];
  const topProducts = productsResponse?.topProducts || [];

  // Calculate period comparison for trends
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  // Generate sales data from orders if API data is empty
  const generatedSalesData = useMemo(() => {
    if (salesData.length > 0) return null; // Use API data if available
    
    if (!ordersResponse?.orders || ordersResponse.orders.length === 0) return [];
    
    // Calculate date range
    let daysBack = 7;
    switch (dateRange) {
      case '7d': daysBack = 7; break;
      case '30d': daysBack = 30; break;
      case '90d': daysBack = 90; break;
      case '1y': daysBack = 365; break;
    }
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);
    
    // Filter orders by date range
    const filteredOrders = ordersResponse.orders.filter((order: any) => {
      const orderDate = new Date(order.createdAt || order.orderDate || Date.now());
      return orderDate >= startDate;
    });
    
    // Group by date
    const salesByDate: { [key: string]: number } = {};
    filteredOrders.forEach((order: any) => {
      const date = new Date(order.createdAt || order.orderDate || Date.now()).toISOString().split('T')[0];
      if (!salesByDate[date]) {
        salesByDate[date] = 0;
      }
      salesByDate[date] += (order.finalAmount || order.totalPrice || 0);
    });
    
    // Format for chart
    return Object.entries(salesByDate)
      .map(([date, sales]) => ({
        date,
        sales: Math.round(sales)
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [ordersResponse, dateRange, salesData]);

  // Generate top products from orders if API data is empty
  const generatedTopProducts = useMemo(() => {
    if (topProducts.length > 0) return null; // Use API data if available
    
    if (!ordersResponse?.orders || ordersResponse.orders.length === 0) return [];
    
    const productSales: { [key: string]: { name: string; totalSales: number; totalQuantity: number; id: string } } = {};
    
    ordersResponse.orders.forEach((order: any) => {
      if (order.orderItems && Array.isArray(order.orderItems)) {
        order.orderItems.forEach((item: any) => {
          const productId = item.productId?._id || item.productId || item.id || 'unknown';
          const productName = item.name || item.productName || item.productInfo?.name || 'Unknown Product';
          const itemPrice = item.price || item.unitPrice || 0;
          const quantity = item.quantity || 0;
          
          if (!productSales[productId]) {
            productSales[productId] = {
              id: productId,
              name: productName,
              totalSales: 0,
              totalQuantity: 0
            };
          }
          
          productSales[productId].totalSales += itemPrice * quantity;
          productSales[productId].totalQuantity += quantity;
        });
      }
    });
    
    return Object.values(productSales)
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, 10);
  }, [ordersResponse, topProducts]);

  // Use generated data if API data is empty
  const finalSalesData = salesData.length > 0 ? salesData : (generatedSalesData || []);
  const finalTopProducts = topProducts.length > 0 ? topProducts : (generatedTopProducts || []);

  // Format sales data for charts
  const formatSalesData = (data: any[]) => {
    if (!data || data.length === 0) return [];
    return data.map(item => ({
      name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: item.sales || 0,
      date: item.date
    }));
  };

  useEffect(() => {
    if (dateRange) {
      refetchSales();
    }
  }, [dateRange, refetchSales]);

  // Prepare stats with real data
  const stats = useMemo(() => {
    if (!realStats) {
      // Fallback to API data if realStats not available
      return [
    { 
      title: "Total Revenue", 
          value: overviewData ? formatPrice(overviewData.totalRevenue || 0) : formatPrice(0), 
          change: null,
      icon: DollarSignIcon, 
          gradient: "from-green-500 to-emerald-600",
          bgGradient: "from-green-50 to-emerald-50",
          iconBg: "bg-green-500"
    },
    { 
      title: "Total Orders", 
      value: overviewData ? (overviewData.totalOrders || 0).toString() : "0", 
          change: null,
      icon: ShoppingCartIcon, 
          gradient: "from-blue-500 to-cyan-600",
          bgGradient: "from-blue-50 to-cyan-50",
          iconBg: "bg-blue-500"
    },
    { 
      title: "Completed Orders", 
      value: overviewData ? (overviewData.completedOrders || 0).toString() : "0", 
          change: null,
      icon: CheckCircleIcon, 
          gradient: "from-purple-500 to-indigo-600",
          bgGradient: "from-purple-50 to-indigo-50",
          iconBg: "bg-purple-500"
    },
    { 
      title: "Pending Orders", 
      value: overviewData ? (overviewData.pendingOrders || 0).toString() : "0", 
          change: null,
      icon: ClockIcon, 
          gradient: "from-orange-500 to-amber-600",
          bgGradient: "from-orange-50 to-amber-50",
          iconBg: "bg-orange-500"
    },
    { 
      title: "Average Order Value", 
      value: overviewData ? formatPrice(overviewData.averageOrderValue || 0) : formatPrice(0), 
          change: null,
          icon: TrendingUpIcon, 
          gradient: "from-pink-500 to-rose-600",
          bgGradient: "from-pink-50 to-rose-50",
          iconBg: "bg-pink-500"
        },
        { 
          title: "Completion Rate", 
          value: overviewData && overviewData.totalOrders > 0 
            ? `${((overviewData.completedOrders / overviewData.totalOrders) * 100).toFixed(1)}%` 
            : "0%", 
          change: null,
          icon: ChartBarIcon, 
          gradient: "from-violet-500 to-purple-600",
          bgGradient: "from-violet-50 to-purple-50",
          iconBg: "bg-violet-500"
        },
      ];
    }

    const completionRate = realStats.completionRate;
    const avgOrderValue = realStats.averageOrderValue;

    return [
      { 
        title: "Total Revenue", 
        value: formatPrice(realStats.totalRevenue), 
        change: null,
        icon: DollarSignIcon, 
        gradient: "from-green-500 to-emerald-600",
        bgGradient: "from-green-50 to-emerald-50",
        iconBg: "bg-green-500"
      },
      { 
        title: "Total Orders", 
        value: realStats.totalOrders.toString(), 
        change: null,
        icon: ShoppingCartIcon, 
        gradient: "from-blue-500 to-cyan-600",
        bgGradient: "from-blue-50 to-cyan-50",
        iconBg: "bg-blue-500"
      },
      { 
        title: "Completed Orders", 
        value: realStats.completedOrders.toString(), 
        change: `${completionRate.toFixed(1)}%`,
        icon: CheckCircleIcon, 
        gradient: "from-purple-500 to-indigo-600",
        bgGradient: "from-purple-50 to-indigo-50",
        iconBg: "bg-purple-500"
      },
      { 
        title: "Pending Orders", 
        value: realStats.pendingOrders.toString(), 
        change: null,
        icon: ClockIcon, 
        gradient: "from-orange-500 to-amber-600",
        bgGradient: "from-orange-50 to-amber-50",
        iconBg: "bg-orange-500"
      },
      { 
        title: "Average Order Value", 
        value: formatPrice(avgOrderValue), 
        change: null,
      icon: TrendingUpIcon, 
        gradient: "from-pink-500 to-rose-600",
        bgGradient: "from-pink-50 to-rose-50",
        iconBg: "bg-pink-500"
    },
    { 
        title: "Completion Rate", 
        value: `${completionRate.toFixed(1)}%`, 
        change: null,
      icon: ChartBarIcon, 
        gradient: "from-violet-500 to-purple-600",
        bgGradient: "from-violet-50 to-purple-50",
        iconBg: "bg-violet-500"
    },
  ];
  }, [realStats, overviewData]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (overviewLoading || salesLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  const formattedSalesData = formatSalesData(finalSalesData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-lg text-gray-600">Track your store performance and insights in real-time</p>
        </div>
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300 transition-colors"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
            </div>
          </div>
        </div>

        {/* Stats Grid - Modern Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  {stat.change && (
                    <div className="flex items-center space-x-1 mt-2">
                      {stat.change.startsWith('+') || parseFloat(stat.change) >= 0 ? (
                        <>
                          <ArrowUpIcon className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                        </>
                      ) : (
                        <>
                          <ArrowDownIcon className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-semibold text-red-600">{stat.change}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className={`${stat.iconBg} p-4 rounded-xl shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Sales Trend Chart */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Sales Trend</h3>
                <p className="text-sm text-gray-500">Revenue over time</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUpIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            {formattedSalesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={formattedSalesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    fontSize={12}
                    tickFormatter={(value) => formatPrice(value)}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(value: any) => [formatPrice(value), 'Sales']}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '12px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-gray-400">
                <p>No sales data available for this period</p>
              </div>
            )}
          </div>

          {/* Top Products Chart */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Top Products</h3>
                <p className="text-sm text-gray-500">By revenue</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <PackageIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            {finalTopProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={finalTopProducts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => {
                      return `${name}: ${(percent * 100).toFixed(1)}%`;
                    }}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="totalSales"
                  >
                    {finalTopProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [formatPrice(value), 'Revenue']}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '12px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry: any) => `${value}: ${formatPrice(entry.payload.totalSales)}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-gray-400">
                <p>No product data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products Bar Chart */}
        {finalTopProducts.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-10 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Top Products Performance</h3>
                <p className="text-sm text-gray-500">Revenue comparison</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={finalTopProducts.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6B7280"
                  fontSize={11}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={(value) => formatPrice(value)}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value: any) => [formatPrice(value), 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="totalSales" 
                  fill="#8b5cf6"
                  radius={[8, 8, 0, 0]}
                >
                  {finalTopProducts.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products List */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-1">Top Products</h4>
                <p className="text-sm text-gray-500">By revenue and quantity</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              {finalTopProducts.length > 0 ? (
                finalTopProducts.slice(0, 8).map((product: any, index) => {
                  const totalRevenue = finalTopProducts.reduce((sum: number, p: any) => sum + (p.totalSales || 0), 0);
                  const percentage = totalRevenue > 0 ? ((product.totalSales / totalRevenue) * 100) : 0;
                  
                  return (
                    <div 
                      key={product.id || index} 
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center flex-1 min-w-0">
                    <div 
                          className="w-4 h-4 rounded-full mr-4 flex-shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {product.name || 'Unknown Product'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {product.totalQuantity || 0} units sold
                          </p>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm font-bold text-gray-900">
                          {formatPrice(product.totalSales || 0)}
                        </p>
                        <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                  </div>
                  </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <PackageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No product data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-1">Order Status</h4>
                <p className="text-sm text-gray-500">Distribution overview</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                <ShoppingCartIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            {realStats && realStats.totalOrders > 0 ? (
              <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium text-gray-700">Completed</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-bold text-gray-900">
                        {realStats.completedOrders}
                    </span>
                      <div className="w-32 bg-gray-200 rounded-full h-3">
                      <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500" 
                        style={{ 
                            width: `${(realStats.completedOrders / realStats.totalOrders) * 100}%` 
                        }}
                      ></div>
                      </div>
                      <span className="text-xs font-semibold text-gray-600 w-12 text-right">
                        {((realStats.completedOrders / realStats.totalOrders) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                      <span className="text-sm font-medium text-gray-700">Pending</span>
                </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-bold text-gray-900">
                        {realStats.pendingOrders}
                    </span>
                      <div className="w-32 bg-gray-200 rounded-full h-3">
                      <div 
                          className="bg-gradient-to-r from-orange-500 to-amber-600 h-3 rounded-full transition-all duration-500" 
                        style={{ 
                            width: `${(realStats.pendingOrders / realStats.totalOrders) * 100}%` 
                        }}
                      ></div>
                      </div>
                      <span className="text-xs font-semibold text-gray-600 w-12 text-right">
                        {((realStats.pendingOrders / realStats.totalOrders) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {realStats.confirmedOrders > 0 && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium text-gray-700">Confirmed</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-bold text-gray-900">
                          {realStats.confirmedOrders}
                        </span>
                        <div className="w-32 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-cyan-600 h-3 rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${(realStats.confirmedOrders / realStats.totalOrders) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-gray-600 w-12 text-right">
                          {((realStats.confirmedOrders / realStats.totalOrders) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}

                  {realStats.shippedOrders > 0 && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm font-medium text-gray-700">Shipped</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-bold text-gray-900">
                          {realStats.shippedOrders}
                        </span>
                        <div className="w-32 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${(realStats.shippedOrders / realStats.totalOrders) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-gray-600 w-12 text-right">
                          {((realStats.shippedOrders / realStats.totalOrders) * 100).toFixed(1)}%
                        </span>
                  </div>
                </div>
                  )}

                  {realStats.canceledOrders > 0 && (
                <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm font-medium text-gray-700">Canceled</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-bold text-gray-900">
                          {realStats.canceledOrders}
                    </span>
                        <div className="w-32 bg-gray-200 rounded-full h-3">
                      <div 
                            className="bg-gradient-to-r from-red-500 to-rose-600 h-3 rounded-full transition-all duration-500" 
                        style={{ 
                              width: `${(realStats.canceledOrders / realStats.totalOrders) * 100}%` 
                        }}
                      ></div>
                        </div>
                        <span className="text-xs font-semibold text-gray-600 w-12 text-right">
                          {((realStats.canceledOrders / realStats.totalOrders) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Stats */}
                <div className="pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Items Sold</span>
                    <span className="text-lg font-bold text-gray-900">{realStats.totalItemsSold}</span>
                  </div>
                  {realStats.totalPointsEarned > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Points Earned</span>
                      <span className="text-lg font-bold text-purple-600">{realStats.totalPointsEarned.toLocaleString()}</span>
                    </div>
                  )}
                  {realStats.totalPointsUsed > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Points Used</span>
                      <span className="text-lg font-bold text-orange-600">{realStats.totalPointsUsed.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <ShoppingCartIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No order data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
