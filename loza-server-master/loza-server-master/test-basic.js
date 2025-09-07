// Simple test to verify basic functionality without product validation
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

async function testBasicFunctionality() {
  try {
    console.log('Testing Basic Functionality...\n');

    // 1. Test getting all orders (should work without authentication for testing)
    console.log('1. Getting all orders...');
    try {
      const allOrdersResponse = await axios.get(`${BASE_URL}/orders/get-orders`);
      console.log('✅ Orders retrieved:', allOrdersResponse.data.orders.length, 'orders found');
    } catch (error) {
      console.log('⚠️  Getting orders requires authentication:', error.response?.status);
    }

    // 2. Test server health
    console.log('\n2. Testing server health...');
    const healthResponse = await axios.get('http://localhost:8000/');
    console.log('✅ Server is running:', healthResponse.data);

    console.log('\n🎉 Basic functionality test completed!');

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
testBasicFunctionality();
