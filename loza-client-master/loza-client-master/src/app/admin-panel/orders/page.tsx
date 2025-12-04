"use client";

import { useState, useEffect } from 'react';
import { ShoppingCartIcon, PackageIcon, ClockIcon, CheckCircleIcon, DownloadIcon, EyeIcon, PrinterIcon, XIcon, InfoIcon, SearchIcon } from 'lucide-react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation, useDeleteOrderMutation } from '@/redux/features/orders/orderApi';
import { useGetSingleProductQuery } from '@/redux/features/products/productApi';
import toast from 'react-hot-toast';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

interface Order {
  _id: string;
  orderNumber: number;
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    street: string;
    building: string;
    unitNumber: string;
  };
  orderItems: Array<{
    name: string;
    size: string;
    quantity: number;
    price: number;
    productId?: string;
    productInfo?: {
      name: string;
      images: string[];
      coverImage: string;
    };
    image?: string;
    images?: Array<{ url?: string } | string>;
  }>;
  totalPrice: number;
  subtotal?: number;
  deliveryFee?: number;
  orderStatus: 'Complete' | 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Canceled';
  paymentMethod: {
    type: string;
    status: string;
    instapayAccountName?: string;
  };
  // Points system fields
  pointsEarned?: number;
  pointsUsed?: number;
  pointsDiscount?: number;
  finalAmount?: number;
  createdAt: string;
  invoiceId?: string;
}

export default function OrdersPage() {
  const { data: ordersResponse, isLoading, error, refetch } = useGetAllOrdersQuery({});
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [selectedOrderForProducts, setSelectedOrderForProducts] = useState<Order | null>(null);

  useEffect(() => {
    if (ordersResponse?.orders) {
      setOrders(ordersResponse.orders);
    }
  }, [ordersResponse]);

  const filteredOrders = orders.filter(order => {
    // Status filter
    const statusMatch = filterStatus === 'all' || order.orderStatus === filterStatus;
    
    // Search filter
    if (!searchQuery.trim()) {
      return statusMatch;
    }
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      order.orderNumber.toString().includes(query) ||
      `${order.userInfo.firstName} ${order.userInfo.lastName}`.toLowerCase().includes(query) ||
      order.userInfo.email.toLowerCase().includes(query) ||
      (order.paymentMethod?.instapayAccountName && order.paymentMethod.instapayAccountName.toLowerCase().includes(query));
    
    return statusMatch && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return ClockIcon;
      case 'Confirmed': return PackageIcon;
      case 'Shipped': return ShoppingCartIcon;
      case 'Delivered': return CheckCircleIcon;
      case 'Complete': return CheckCircleIcon;
      case 'Canceled': return ClockIcon;
      default: return ClockIcon;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Complete': return 'bg-green-100 text-green-800';
      case 'Canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      toast.success('Order status updated successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteOrder(orderId).unwrap();
      toast.success('Order deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to delete order');
    }
  };

  const handleViewInvoice = (order: Order) => {
    setSelectedOrder(order);
    setShowInvoiceModal(true);
  };

  const handleViewProducts = (order: Order) => {
    setSelectedOrderForProducts(order);
    setShowProductsModal(true);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleDownloadInvoice = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/invoice/${orderId}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading orders</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Orders Management</h1>
          
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order number, name, email, or Instapay account..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            
            {/* Status Filter */}
            <div className="md:w-64">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
            >
              <option value="all">All Orders</option>
              <option value="Complete">Complete</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Canceled">Canceled</option>
            </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{filteredOrders.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(filteredOrders.reduce((sum, order) => sum + (order.finalAmount || order.totalPrice), 0))}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <PackageIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Points Earned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredOrders.reduce((sum, order) => sum + (order.pointsEarned || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DownloadIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Points Used</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredOrders.reduce((sum, order) => sum + (order.pointsUsed || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600">Orders will appear here when customers make purchases.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Final Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const StatusIcon = getStatusIcon(order.orderStatus);
                    return (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.orderNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.userInfo.firstName} {order.userInfo.lastName}
                          <br />
                          <span className="text-gray-500 text-xs">{order.userInfo.email}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.orderItems.length} items
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(order.subtotal || order.totalPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(order.finalAmount || order.totalPrice)}
                          {order.pointsDiscount && order.pointsDiscount > 0 && (
                            <div className="text-xs text-green-600">
                              -{formatPrice(order.pointsDiscount)} points
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {order.orderStatus}
                            </span>
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="Complete">Complete</option>
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Canceled">Canceled</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <div className="flex flex-col space-y-2">
                            <button
                              onClick={() => handleViewProducts(order)}
                              className="text-green-600 hover:text-green-900 flex items-center"
                              title="View Products Details"
                            >
                              <InfoIcon className="w-4 h-4 mr-1" />
                              Products
                            </button>
                            {order.invoiceId && (
                              <button
                                onClick={() => handleDownloadInvoice(order._id)}
                                className="text-blue-600 hover:text-blue-900 flex items-center"
                                title="Download Invoice"
                              >
                                <DownloadIcon className="w-4 h-4 mr-1" />
                                Invoice
                              </button>
                            )}
                            <button
                              onClick={() => handleViewInvoice(order)}
                              className="text-purple-600 hover:text-purple-900 flex items-center"
                              title="View Invoice Details"
                            >
                              <EyeIcon className="w-4 h-4 mr-1" />
                              View
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="text-red-600 hover:text-red-900 flex items-center"
                              title="Delete Order"
                            >
                              <XIcon className="w-4 h-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Invoice Details</h2>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Order #:</strong> #{selectedOrder.orderNumber}</p>
                    <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
                    <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    <p><strong>Subtotal:</strong> {formatPrice(selectedOrder.subtotal || selectedOrder.totalPrice)}</p>
                    {selectedOrder.deliveryFee && (
                      <p><strong>Delivery Fee:</strong> {formatPrice(selectedOrder.deliveryFee)}</p>
                    )}
                    {selectedOrder.pointsDiscount && selectedOrder.pointsDiscount > 0 && (
                      <p><strong>Points Discount:</strong> -{formatPrice(selectedOrder.pointsDiscount)}</p>
                    )}
                    <p><strong>Final Amount:</strong> {formatPrice(selectedOrder.finalAmount || selectedOrder.totalPrice)}</p>
                    <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod?.type}</p>
                    <p><strong>Payment Status:</strong> {selectedOrder.paymentMethod?.status}</p>
                    {selectedOrder.paymentMethod?.instapayAccountName && (
                      <p><strong>Instapay Account Name:</strong> {selectedOrder.paymentMethod.instapayAccountName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedOrder.userInfo.firstName} {selectedOrder.userInfo.lastName}</p>
                    <p><strong>Email:</strong> {selectedOrder.userInfo.email}</p>
                    <p><strong>Phone:</strong> {selectedOrder.userInfo.phone}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Address:</strong> {selectedOrder.shippingAddress?.address}</p>
                    <p><strong>City:</strong> {selectedOrder.shippingAddress?.city}</p>
                    <p><strong>Postal Code:</strong> {selectedOrder.shippingAddress?.postalCode}</p>
                    <p><strong>Country:</strong> {selectedOrder.shippingAddress?.country}</p>
                  </div>
                  <div>
                    <p><strong>Street:</strong> {selectedOrder.shippingAddress?.street}</p>
                    <p><strong>Building:</strong> {selectedOrder.shippingAddress?.building}</p>
                    <p><strong>Unit Number:</strong> {selectedOrder.shippingAddress?.unitNumber}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Product Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Size</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Qty</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Price</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.orderItems.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm font-medium">{item.name || item.productInfo?.name || 'Unknown Product'}</td>
                          <td className="px-4 py-2 text-sm">{item.size}</td>
                          <td className="px-4 py-2 text-sm">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm">{formatPrice(item.price)}</td>
                          <td className="px-4 py-2 text-sm font-semibold">{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Order Summary */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center text-sm">
                      <span>Subtotal:</span>
                      <span>{formatPrice(selectedOrder.subtotal || selectedOrder.totalPrice)}</span>
                    </div>
                    {selectedOrder.deliveryFee && (
                      <div className="flex justify-between items-center text-sm">
                        <span>Delivery Fee:</span>
                        <span>{formatPrice(selectedOrder.deliveryFee)}</span>
                      </div>
                    )}
                    {selectedOrder.pointsDiscount && selectedOrder.pointsDiscount > 0 && (
                      <div className="flex justify-between items-center text-sm text-green-600">
                        <span>Points Discount:</span>
                        <span>-{formatPrice(selectedOrder.pointsDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t">
                      <span>Final Amount:</span>
                      <span>{formatPrice(selectedOrder.finalAmount || selectedOrder.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Points Summary */}
              {(selectedOrder.pointsEarned || selectedOrder.pointsUsed) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Points Summary</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    {selectedOrder.pointsEarned > 0 && (
                      <p><strong>Points Earned:</strong> {selectedOrder.pointsEarned} points ({formatPrice(selectedOrder.pointsEarned * 10)})</p>
                    )}
                    {selectedOrder.pointsUsed > 0 && (
                      <p><strong>Points Used:</strong> {selectedOrder.pointsUsed} points ({formatPrice(selectedOrder.pointsUsed * 10)})</p>
                    )}
                    {selectedOrder.pointsDiscount > 0 && (
                      <p><strong>Discount Applied:</strong> -{formatPrice(selectedOrder.pointsDiscount)}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  onClick={handlePrintInvoice}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PrinterIcon className="w-4 h-4 mr-2" />
                  Print Invoice
                </button>
                <button
                  onClick={() => handleDownloadInvoice(selectedOrder._id)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Details Modal */}
      {showProductsModal && selectedOrderForProducts && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Products Details - Order #{selectedOrderForProducts.orderNumber}</h2>
              <button
                onClick={() => setShowProductsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedOrderForProducts.orderItems.map((item, index) => {
                // Get product image with better handling
                let productImage: string | null = null;
                
                // Try productInfo first (from backend) - this should have the correct format
                if (item.productInfo) {
                  // coverImage should be a string URL
                  if (item.productInfo.coverImage && typeof item.productInfo.coverImage === 'string') {
                    productImage = item.productInfo.coverImage;
                  } 
                  // If coverImage is an object, extract URL
                  else if (item.productInfo.coverImage && typeof item.productInfo.coverImage === 'object' && (item.productInfo.coverImage as any).url) {
                    productImage = (item.productInfo.coverImage as any).url;
                  }
                  // Try images array
                  else if (item.productInfo.images && Array.isArray(item.productInfo.images) && item.productInfo.images.length > 0) {
                    const firstImage = item.productInfo.images[0];
                    if (typeof firstImage === 'string') {
                      productImage = firstImage;
                    } else if (firstImage && typeof firstImage === 'object' && (firstImage as any).url) {
                      productImage = (firstImage as any).url;
                    }
                  }
                }
                
                // Fallback to item.image or item.images
                if (!productImage) {
                  if (item.image && typeof item.image === 'string') {
                    productImage = item.image;
                  } else if (item.images && Array.isArray(item.images) && item.images.length > 0) {
                    const firstImage = item.images[0];
                    if (typeof firstImage === 'string') {
                      productImage = firstImage;
                    } else if (firstImage && typeof firstImage === 'object' && (firstImage as any).url) {
                      productImage = (firstImage as any).url;
                    }
                  }
                }
                
                // Final fallback
                if (!productImage) {
                  productImage = "/api/placeholder/300/300";
                }

                const productName = item.name || item.productInfo?.name || 'Unknown Product';

                // Debug log
                console.log("🔍 Product Image Debug:", {
                  productName,
                  productImage,
                  productInfo: item.productInfo,
                  itemImage: item.image,
                  itemImages: item.images
                });

                return (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {productImage && productImage !== "/api/placeholder/300/300" ? (
                          <Image
                            src={productImage}
                            alt={productName}
                            fill
                            className="object-cover"
                            unoptimized
                            onError={(e) => {
                              console.error("Image load error:", productImage);
                              const target = e.target as HTMLImageElement;
                              target.src = '/api/placeholder/300/300';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{productName}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><strong>Size:</strong> {item.size || 'One Size'}</p>
                          <p><strong>Quantity:</strong> {item.quantity}</p>
                          <p><strong>Unit Price:</strong> {formatPrice(item.price)}</p>
                          <p className="text-base font-semibold text-gray-900 pt-2 border-t">
                            <strong>Total:</strong> {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowProductsModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
