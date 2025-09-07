import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

async function testEndpoints() {
  console.log('Testing API Endpoints...\n');

  try {
    // 1. Test server health
    console.log('1. Testing server health...');
    const healthResponse = await axios.get('http://localhost:8000/');
    console.log('✅ Server health:', healthResponse.data);

    // 2. Test authentication requirement
    console.log('\n2. Testing authentication requirement...');
    try {
      const ordersResponse = await axios.get(`${BASE_URL}/orders/get-orders`);
      console.log('❌ Should have required authentication');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Authentication required (401 Unauthorized)');
      } else {
        console.log('❌ Unexpected error:', error.response?.status);
      }
    }

    // 3. Test order creation endpoint structure (without auth)
    console.log('\n3. Testing order creation endpoint...');
    try {
      const testOrderData = {
        userInfo: {
          userId: "test-user-id",
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          phone: "123-456-7890"
        },
        shippingAddress: {
          address: "123 Test St",
          city: "Test City",
          postalCode: "12345"
        },
        orderItems: [
          {
            id: "test-product-id",
            name: "Test Product",
            size: "M",
            quantity: 1,
            price: 29.99
          }
        ],
        totalPrice: 29.99,
        paymentMethod: {
          type: "credit_card",
          status: "paid"
        }
      };

      const createResponse = await axios.post(`${BASE_URL}/orders/create-order`, testOrderData);
      console.log('❌ Should have required authentication or validation');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Authentication required for order creation (401)');
      } else if (error.response?.status === 400) {
        console.log('✅ Validation working (400 Bad Request)');
      } else {
        console.log('Response status:', error.response?.status);
        console.log('Response data:', error.response?.data);
      }
    }

    console.log('\n🎉 Basic API endpoint testing completed!');
    console.log('\nNext steps for thorough testing:');
    console.log('1. Obtain valid authentication tokens');
    console.log('2. Use valid product IDs from database');
    console.log('3. Test order creation with proper authentication');
    console.log('4. Test order status updates');
    console.log('5. Test invoice download functionality');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Run the test
testEndpoints();
