'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  HomeIcon, 
  PackageIcon, 
  ShoppingCartIcon, 
  TagIcon, 
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  UsersIcon
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const salesData = [
  { name: 'Mon', sales: 1200 },
  { name: 'Tue', sales: 1900 },
  { name: 'Wed', sales: 3000 },
  { name: 'Thu', sales: 2500 },
  { name: 'Fri', sales: 2200 },
  { name: 'Sat', sales: 3000 },
  { name: 'Sun', sales: 2847 },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'John Smith', amount: 89.99, status: 'Completed' },
  { id: 'ORD-002', customer: 'Sarah Johnson', amount: 124.50, status: 'Processing' },
  { id: 'ORD-003', customer: 'Mike Davis', amount: 67.25, status: 'Shipped' },
];

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const { user } = useSelector((state: any) => state.auth);

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

  // Debug section to show user state
  const debugUserState = () => {
    if (!user) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>❌ No user logged in!</strong>
          <p>You need to log in to access admin features.</p>
          <p>Current user state: {JSON.stringify(user)}</p>
        </div>
      );
    }

    if (user.role !== 'admin') {
      return (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <strong>⚠️ User logged in but not admin!</strong>
          <p>Current user role: {user.role || 'undefined'}</p>
          <p>User email: {user.email}</p>
          <p>Full user object: {JSON.stringify(user, null, 2)}</p>
        </div>
      );
    }

    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
        <strong>✅ Admin access granted!</strong>
        <p>Welcome, {user.name || user.email} (Role: {user.role})</p>
      </div>
    );
  };

  const stats = [
    { title: "Today's Sales", value: "$2,847", change: "+12.5%", trend: "up", icon: TrendingUpIcon, color: "green" },
    { title: "Orders Today", value: "23", change: "+8.2%", trend: "up", icon: ShoppingCartIcon, color: "blue" },
    { title: "Total Products", value: "156", change: "+3.1%", trend: "up", icon: PackageIcon, color: "purple" },
    { title: "Low Stock Items", value: "8", change: "-2.4%", trend: "down", icon: TrendingDownIcon, color: "red" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Security Notice */}
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
          <strong>🔒 Admin Access Restricted</strong>
          <p>This dashboard is only accessible to users with admin role in the database.</p>
          <p>Current user: {user?.email} (Role: {user?.role})</p>
        </div>
        
        {/* Debug Section */}
        {debugUserState()}
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-2 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from yesterday
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Sales</h3>
            {mounted && (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${order.amount}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
