import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

const jwt = require('jsonwebtoken');

const mockUser = {
  userId: "68ac4efbb338a1d5dc622b13", // Use a valid user ID from the database
};

const token = jwt.sign(mockUser, 'your_jwt_secret'); // Replace with your actual JWT secret

async function testOrderStatus() {
  try {
    console.log('Testing order status functionality...');
    
    // First, get all orders to see what's available
    const ordersResponse = await axios.get(`${BASE_URL}/orders/get-orders`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request
      },
    });
  try {
    console.log('Testing order status functionality...');
    
    // First, get all orders to see what's available
    const ordersResponse = await axios.get(`${BASE_URL}/orders/get-orders`);
    console.log('✅ Orders retrieved successfully:', ordersResponse.data.orders.length, 'orders found');
    
    if (ordersResponse.data.orders.length > 0) {
      const order = ordersResponse.data.orders[0];
      console.log('First order:', {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.orderStatus
      });
      
      // Test updating order status
      const updateResponse = await axios.put(`${BASE_URL}/orders/update-order-status/${order._id}`, {
        orderStatus: 'Complete'
      });
      
      console.log('✅ Order status updated successfully:', updateResponse.data);
      
      // Test getting invoice
      const invoiceResponse = await axios.get(`${BASE_URL}/orders/invoice/${order._id}`);
      console.log('✅ Invoice retrieved successfully (PDF buffer)');
      
    } else {
      console.log('No orders found to test with');
    }
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testOrderStatus();
