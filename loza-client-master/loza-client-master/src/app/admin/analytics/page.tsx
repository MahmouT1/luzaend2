'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  TrendingUpIcon, 
  ShoppingCartIcon, 
  DollarSignIcon,
  CheckCircleIcon,
  ClockIcon
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
  Cell
} from 'recharts';
import { 
  useGetAnalyticsOverviewQuery, 
  useGetSalesTrendQuery, 
  useGetTopProductsQuery 
} from '@/redux/features/analytics/analyticsApi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');
  const [overviewData, setOverviewData] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  // Fetch analytics data
  const { data: overviewResponse, isLoading: overviewLoading } = useGetAnalyticsOverviewQuery({});
  const { data: salesResponse, isLoading: salesLoading } = useGetSalesTrendQuery(dateRange);
  const { data: productsResponse, isLoading: productsLoading } = useGetTopProductsQuery(5);

  useEffect(() => {
    if (overviewResponse) {
      setOverviewData(overviewResponse.overview);
    }
  }, [overviewResponse]);

  useEffect(() => {
    if (salesResponse) {
      setSalesData(salesResponse.salesData);
    }
  }, [salesResponse]);

  useEffect(() => {
    if (productsResponse) {
      setTopProducts(productsResponse.topProducts);
    }
  }, [productsResponse]);

  const stats = [
    { 
      title: "Total Revenue", 
      value: overviewData ? `$${(overviewData.totalRevenue || 0).toLocaleString()}` : "$0", 
      change: "+12.5%", 
      icon: DollarSignIcon, 
      color: "green" 
    },
    { 
      title: "Total Orders", 
      value: overviewData ? (overviewData.totalOrders || 0).toString() : "0", 
      change: "+8.2%", 
      icon: ShoppingCartIcon, 
      color: "blue" 
    },
    { 
      title: "Completed Orders", 
      value: overviewData ? (overviewData.completedOrders || 0).toString() : "0", 
      change: "+15.3%", 
      icon: CheckCircleIcon, 
      color: "green" 
    },
    { 
      title: "Pending Orders", 
      value: overviewData ? (overviewData.pendingOrders || 0).toString() : "0", 
      change: "-2.1%", 
      icon: ClockIcon, 
      color: "orange" 
    },
    { 
      title: "Average Order Value", 
      value: overviewData ? formatPrice(overviewData.averageOrderValue || 0) : formatPrice(0), 
      change: "+3.1%", 
      icon: TrendingUpIcon, 
      color: "purple" 
    },
    { 
      title: "Conversion Rate", 
      value: "3.2%", 
      change: "-0.4%", 
      icon: ChartBarIcon, 
      color: "red" 
    },
  ];

  const formatSalesData = (data) => {
    return data.map(item => ({
      name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: item.sales
    }));
  };

  if (overviewLoading || salesLoading || productsLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your store performance and insights in real-time</p>
        </div>

        {/* Date Range Selector */}
        <div className="mb-6">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-xs mt-2 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last period
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100 ml-4`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatSalesData(salesData)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Sales']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#7c3aed' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Products</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProducts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, totalSales }) => `${name}: $${totalSales}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="totalSales"
                >
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products List */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Top Products by Revenue</h4>
            <div className="space-y-3">
              {topProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                      {product.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">${product.totalSales.toLocaleString()}</span>
                    <p className="text-xs text-gray-500">{product.totalQuantity} sold</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Status Distribution</h4>
            {overviewData && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed Orders</span>
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-green-600 mr-2">
                      {overviewData.completedOrders}
                    </span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ 
                          width: `${(overviewData.completedOrders / overviewData.totalOrders) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending Orders</span>
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-orange-600 mr-2">
                      {overviewData.pendingOrders}
                    </span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ 
                          width: `${(overviewData.pendingOrders / overviewData.totalOrders) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Other Statuses</span>
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-gray-600 mr-2">
                      {overviewData.totalOrders - overviewData.completedOrders - overviewData.pendingOrders}
                    </span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gray-500 h-2 rounded-full" 
                        style={{ 
                          width: `${((overviewData.totalOrders - overviewData.completedOrders - overviewData.pendingOrders) / overviewData.totalOrders) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
