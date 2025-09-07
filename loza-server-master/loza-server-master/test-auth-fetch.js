// Test with authentication using fetch API
async function testAuthFetch() {
  try {
    console.log('Testing authentication with fetch API...');
    
    // First login to get token cookie
    const loginResponse = await fetch('http://localhost:8000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'adminpassword'
      }),
      credentials: 'include' // This allows cookies to be sent/received
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.text();
      console.log('❌ Login failed:', loginResponse.status, error);
      return;
    }

    const loginResult = await loginResponse.json();
    console.log('✅ Login successful:', loginResult);

    // Test getting all orders
    const ordersResponse = await fetch('http://localhost:8000/api/orders/get-orders', {
      credentials: 'include' // Include cookies
    });

    if (ordersResponse.ok) {
      const ordersResult = await ordersResponse.json();
      console.log('✅ Orders retrieved:', ordersResult);
      return ordersResult;
    } else {
      const error = await ordersResponse.text();
      console.log('❌ Orders retrieval failed:', ordersResponse.status, error);
      throw new Error('Orders retrieval failed');
    }
  } catch (error) {
    console.log('❌ Test with auth failed:', error.message);
    throw error;
  }
}

// Run the test
testAuthFetch()
  .then(result => {
    console.log('Test completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.log('Test failed');
    process.exit(1);
  });
