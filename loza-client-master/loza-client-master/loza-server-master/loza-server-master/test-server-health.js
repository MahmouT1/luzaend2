import axios from 'axios';

async function testServerHealth() {
  try {
    console.log('Testing server health...');
    
    // Test root endpoint
    const response = await axios.get('http://localhost:8000/');
    console.log('✅ Root endpoint:', response.status, response.data);
    
    // Test create-order endpoint (should work without auth)
    try {
      const orderResponse = await axios.post('http://localhost:8000/api/orders/create-order', {
        userInfo: {
          userId: 'test-user-id',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '1234567890'
        },
        shippingAddress: {
          address: '123 Test St',
          city: 'Test City',
          postalCode: '12345'
        },
        orderItems: [
          {
            id: 'test-product-id',
            name: 'Test Product',
            size: 'M',
            quantity: 1,
            price: 100
          }
        ],
        paymentMethod: {
          type: 'cash_on_delivery',
          status: 'unpaid'
        },
        totalPrice: 185 // 100 + 85 delivery fee
      });
      console.log('✅ Create order endpoint:', orderResponse.status, orderResponse.data);
    } catch (error) {
      console.log('❌ Create order endpoint error:', error.response?.status, error.response?.data?.message);
    }
    
  } catch (error) {
    console.log('❌ Server health test failed:', error.message);
  }
}

testServerHealth();
