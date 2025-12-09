import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

// GET ANALYTICS OVERVIEW
export const getAnalyticsOverview = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build date filter
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get all orders with date filter
    const orders = await Order.find(dateFilter);

    // Calculate statistics
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter(order => order.paymentMethod?.status === 'paid' || order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    
    const completedOrders = orders.filter(order => 
      order.orderStatus === 'Complete' || order.orderStatus === 'completed'
    ).length;
    
    const pendingOrders = orders.filter(order => 
      order.orderStatus === 'Pending' || order.orderStatus === 'pending'
    ).length;

    // Calculate daily sales for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentOrders = await Order.find({
      createdAt: { $gte: sevenDaysAgo }
    });

    const dailySales = {};
    recentOrders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!dailySales[date]) {
        dailySales[date] = 0;
      }
      if (order.paymentMethod?.status === 'paid' || order.paymentStatus === 'paid') {
        dailySales[date] += order.totalPrice;
      }
    });

    // Get top products
    const productSales = {};
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (!productSales[item.id]) {
          productSales[item.id] = {
            name: item.name,
            sales: 0,
            quantity: 0
          };
        }
        productSales[item.id].sales += item.price * item.quantity;
        productSales[item.id].quantity += item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    res.status(200).json({
      overview: {
        totalOrders,
        totalRevenue,
        completedOrders,
        pendingOrders,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
      },
      dailySales: Object.entries(dailySales).map(([date, sales]) => ({
        date,
        sales
      })),
      topProducts
    });
  } catch (error) {
    console.log("analytics controller error (getAnalyticsOverview) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET SALES TREND
export const getSalesTrend = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    const orders = await Order.find({
      createdAt: { $gte: startDate },
      $or: [
        { 'paymentMethod.status': 'paid' },
        { paymentStatus: 'paid' }
      ]
    });

    // Group by date
    const salesByDate = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!salesByDate[date]) {
        salesByDate[date] = 0;
      }
      salesByDate[date] += order.totalPrice;
    });

    // Format for chart
    const salesData = Object.entries(salesByDate).map(([date, sales]) => ({
      date,
      sales: Math.round(sales)
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({ salesData });
  } catch (error) {
    console.log("analytics controller error (getSalesTrend) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET TOP PRODUCTS
export const getTopProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const orders = await Order.find({
      $or: [
        { 'paymentMethod.status': 'paid' },
        { paymentStatus: 'paid' }
      ]
    });

    const productStats = {};
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (!productStats[item.id]) {
          productStats[item.id] = {
            id: item.id,
            name: item.name,
            totalSales: 0,
            totalQuantity: 0,
            averagePrice: item.price
          };
        }
        productStats[item.id].totalSales += item.price * item.quantity;
        productStats[item.id].totalQuantity += item.quantity;
      });
    });

    const topProducts = Object.values(productStats)
      .sort((a, b) => b.totalSales - a.totalSales)
      .slice(0, parseInt(limit));

    res.status(200).json({ topProducts });
  } catch (error) {
    console.log("analytics controller error (getTopProducts) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
