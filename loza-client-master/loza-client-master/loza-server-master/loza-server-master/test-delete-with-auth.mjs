import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000/api';

// Login to get JWT token
async function login() {
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'adminpassword'
      })
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Login response:', data);
    
    // Check if token is in response body
    if (data.token) {
      return data.token;
    }
    
    // Check if token is in cookies
    const cookies = response.headers.get('set-cookie');
    if (cookies) {
      console.log('Cookies:', cookies);
      // Extract JWT token from cookies
      const jwtCookie = cookies.split(';').find(cookie => cookie.trim().startsWith('jwt='));
      if (jwtCookie) {
        return jwtCookie.split('=')[1];
      }
    }
    
    return null;
  } catch (error) {
    console.error('Login error:', error.message);
    return null;
  }
}

// Test product deletion
async function testProductDelete() {
  console.log('Testing product delete functionality...');
  
  // First, get a list of products
  try {
    const productsResponse = await fetch(`${BASE_URL}/products/get-products`);
    const productsData = await productsResponse.json();
    
    console.log('Available products:', productsData);
    
    if (productsData.length === 0) {
      console.log('No products available for testing');
      return;
    }
    
    // Get first product for testing
    const testProduct = productsData[0];
    console.log(`Testing delete on product: ${testProduct.name} (ID: ${testProduct._id})`);
    
    // Login to get token
    const token = await login();
    if (!token) {
      console.log('Failed to get authentication token');
      return;
    }
    
    console.log('Got authentication token');
    
    // Delete the product - send token as cookie
    const deleteResponse = await fetch(`${BASE_URL}/products/delete-product/${testProduct._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `jwt=${token}`
      }
    });
    
    if (deleteResponse.ok) {
      console.log('Product deleted successfully!');
      const result = await deleteResponse.json();
      console.log('Delete result:', result);
    } else {
      console.log(`Delete failed: ${deleteResponse.status} ${deleteResponse.statusText}`);
      const error = await deleteResponse.text();
      console.log('Error details:', error);
    }
    
  } catch (error) {
    console.error('Error testing delete product:', error.message);
  }
}

// Run the test
testProductDelete();
