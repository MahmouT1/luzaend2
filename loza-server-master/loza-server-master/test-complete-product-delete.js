import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000/api';

// Login to get JWT token
async function login(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Check if token is in cookies
    const cookies = response.headers.get('set-cookie');
    if (cookies) {
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

// Test 1: Delete product with admin credentials
async function testAdminProductDelete() {
  console.log('=== Test 1: Admin Product Deletion ===');
  
  try {
    const productsResponse = await fetch(`${BASE_URL}/products/get-products`);
    const productsData = await productsResponse.json();
    
    if (productsData.length === 0) {
      console.log('No products available for testing');
      return;
    }
    
    const testProduct = productsData[0];
    console.log(`Testing delete on product: ${testProduct.name} (ID: ${testProduct._id})`);
    
    // Login as admin
    const token = await login('admin@example.com', 'adminpassword');
    if (!token) {
      console.log('Failed to get admin authentication token');
      return;
    }
    
    // Delete the product
    const deleteResponse = await fetch(`${BASE_URL}/products/delete-product/${testProduct._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `jwt=${token}`
      }
    });
    
    if (deleteResponse.ok) {
      console.log('✅ Product deleted successfully!');
      const result = await deleteResponse.json();
      console.log('Delete result:', result);
    } else {
      console.log(`❌ Delete failed: ${deleteResponse.status} ${deleteResponse.statusText}`);
      const error = await deleteResponse.text();
      console.log('Error details:', error);
    }
    
  } catch (error) {
    console.error('Error testing admin product delete:', error.message);
  }
}

// Test 2: Try to delete product with invalid ID
async function testInvalidProductId() {
  console.log('\n=== Test 2: Invalid Product ID ===');
  
  try {
    const token = await login('admin@example.com', 'adminpassword');
    if (!token) {
      console.log('Failed to get admin authentication token');
      return;
    }
    
    const deleteResponse = await fetch(`${BASE_URL}/products/delete-product/invalid-id-123`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `jwt=${token}`
      }
    });
    
    if (deleteResponse.ok) {
      console.log('❌ Unexpected success with invalid ID');
      const result = await deleteResponse.json();
      console.log('Result:', result);
    } else {
      console.log(`✅ Expected failure with invalid ID: ${deleteResponse.status}`);
      const error = await deleteResponse.text();
      console.log('Error details:', error);
    }
    
  } catch (error) {
    console.error('Error testing invalid product ID:', error.message);
  }
}

// Test 3: Try to delete product without authentication
async function testUnauthenticatedDelete() {
  console.log('\n=== Test 3: Unauthenticated Access ===');
  
  try {
    const productsResponse = await fetch(`${BASE_URL}/products/get-products`);
    const productsData = await productsResponse.json();
    
    if (productsData.length === 0) {
      console.log('No products available for testing');
      return;
    }
    
    const testProduct = productsData[0];
    
    const deleteResponse = await fetch(`${BASE_URL}/products/delete-product/${testProduct._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (deleteResponse.ok) {
      console.log('❌ Unexpected success without authentication');
      const result = await deleteResponse.json();
      console.log('Result:', result);
    } else {
      console.log(`✅ Expected failure without authentication: ${deleteResponse.status}`);
      const error = await deleteResponse.text();
      console.log('Error details:', error);
    }
    
  } catch (error) {
    console.error('Error testing unauthenticated delete:', error.message);
  }
}

// Test 4: Try to delete product with non-admin user
async function testNonAdminDelete() {
  console.log('\n=== Test 4: Non-Admin User Access ===');
  
  // First create a regular user
  try {
    const registerResponse = await fetch(`${BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'user@example.com',
        password: 'userpassword'
      })
    });

    if (!registerResponse.ok) {
      console.log('User registration failed, may already exist');
    }
  } catch (error) {
    console.log('User may already exist, proceeding with login');
  }
  
  try {
    const token = await login('user@example.com', 'userpassword');
    if (!token) {
      console.log('Failed to get user authentication token');
      return;
    }
    
    const productsResponse = await fetch(`${BASE_URL}/products/get-products`);
    const productsData = await productsResponse.json();
    
    if (productsData.length === 0) {
      console.log('No products available for testing');
      return;
    }
    
    const testProduct = productsData[0];
    
    const deleteResponse = await fetch(`${BASE_URL}/products/delete-product/${testProduct._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `jwt=${token}`
      }
    });
    
    if (deleteResponse.ok) {
      console.log('❌ Unexpected success with non-admin user');
      const result = await deleteResponse.json();
      console.log('Result:', result);
    } else {
      console.log(`✅ Expected failure with non-admin user: ${deleteResponse.status}`);
      const error = await deleteResponse.text();
      console.log('Error details:', error);
    }
    
  } catch (error) {
    console.error('Error testing non-admin delete:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('Starting comprehensive product deletion tests...\n');
  
  await testAdminProductDelete();
  await testInvalidProductId();
  await testUnauthenticatedDelete();
  await testNonAdminDelete();
  
  console.log('\n=== Testing Complete ===');
  console.log('All tests have been executed. Check results above.');
}

runAllTests();
