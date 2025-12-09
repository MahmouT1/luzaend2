// Simple test script to verify order flow functionality
// This can be run with: node test-order-flow.js

import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

// Test data for creating an order
const testOrderData = {
  userInfo: {
    userId: "test-user-id-123",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890"
  },
  shippingAddress: {
    address: "123 Main St",
    city: "Anytown",
    postalCode: "12345"
  },
  orderItems: [
    {
      id: "68ac4efbb338a1d5dc622b13", // Using the test product ID we just created
      name: "Test Product",
      size: "M",
      quantity: 2,
      price: 29.99
    }
  ],
  totalPrice: 59.98,
  paymentMethod: {
    type: "credit_card",
    status: "paid"
  }
};

async function testOrderFlow() {
  try {
    console.log('Testing Order Flow...\n');

    // 1. Test creating an order
    console.log('1. Creating a test order...');
    const createResponse = await axios.post(`${BASE_URL}/orders/create-order`, testOrderData);
    console.log('✅ Order created successfully:', createResponse.data);
    
    const orderId = createResponse.data.orderId;
    const orderNumber = createResponse.data.orderNumber;
    
    // 2. Test getting all orders
    console.log('\n2. Getting all orders...');
    const allOrdersResponse = await axios.get(`${BASE_URL}/orders/get-orders`);
    console.log('✅ Orders retrieved:', allOrdersResponse.data.orders.length, 'orders found');

    // 3. Test getting specific order
    console.log('\n3. Getting specific order...');
    const orderResponse = await axios.get(`${BASE_URL}/orders/get-order/${orderId}`);
    console.log('✅ Order retrieved:', orderResponse.data.order.orderStatus);

    // 4. Test updating order status
    console.log('\n4. Updating order status to "Complete"...');
    const updateResponse = await axios.put(`${BASE_URL}/orders/update-order-status/${orderId}`, {
      orderStatus: "Complete"
    });
    console.log('✅ Order status updated:', updateResponse.data.order.orderStatus);

    // 5. Test getting invoice
    console.log('\n5. Getting invoice...');
    const invoiceResponse = await axios.get(`${BASE_URL}/orders/invoice/${orderId}`, {
      responseType: 'arraybuffer'
    });
    console.log('✅ Invoice retrieved:', invoiceResponse.headers['content-type']);

    console.log('\n🎉 All tests passed! Order flow is working correctly.');
    console.log('\nOrder Details:');
    console.log('- Order ID:', orderId);
    console.log('- Order Number:', orderNumber);
    console.log('- Final Status:', "Complete");

  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    console.error('Full error:', error);
  }
}

// Run the test
testOrderFlow();
