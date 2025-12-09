import axios from 'axios';

// Test with authentication token
async function testWithAuth() {
  try {
    console.log('Testing with authentication...');
    
    // First login to get token cookie
    const loginResponse = await axios.post('http://localhost:8000/api/users/login', {
      email: 'admin@example.com',
      password: 'adminpassword'
    }, {
      withCredentials: true // This allows cookies to be sent/received
    });

    console.log('✅ Login successful:', loginResponse.data);

    // For API testing, we need to manually handle the cookie
    // Let's try a different approach - use the test-order-with-auth.js approach
    console.log('Testing with cookie-based authentication...');
    
    // Create a simple test to check if we can access orders
    const testResponse = await axios.get('http://localhost:8000/api/orders/get-orders', {
      withCredentials: true
    });

    console.log('✅ Orders retrieved:', testResponse.data);

    return testResponse.data;
  } catch (error) {
    console.log('❌ Test with auth failed:', error.response?.data || error.message);
    throw error;
  }
}

// Run the test
testWithAuth()
  .then(result => {
    console.log('Test completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.log('Test failed');
    process.exit(1);
  });
