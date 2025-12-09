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

// Test creating a product with multiple sizes
async function testProductWithSizes() {
  console.log('Testing product creation with multiple sizes...');
  
  try {
    const token = await login();
    if (!token) {
      console.log('Failed to get authentication token');
      return;
    }

    const productData = {
      data: {
        name: 'Test Product with Sizes',
        description: 'A test product with multiple sizes (S, M, L, XL)',
        price: 49.99,
        discountPrice: 39.99,
        category: '68ab605b6e1816a3712881fc', // jacket category
        images: ['test-image.jpg'],
        info: [
          { size: 'S', quantity: 10 },
          { size: 'M', quantity: 15 },
          { size: 'L', quantity: 8 },
          { size: 'XL', quantity: 5 }
        ]
      }
    };

    const response = await fetch(`${BASE_URL}/products/create-product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `jwt=${token}`
      },
      body: JSON.stringify(productData)
    });

    if (response.ok) {
      console.log('✅ Product created successfully with multiple sizes!');
      const result = await response.json();
      console.log('Created product:', result);
      
      // Verify the product was created with correct sizes
      const verifyResponse = await fetch(`${BASE_URL}/products/get-single-product/${result.product._id}`);
      if (verifyResponse.ok) {
        const verifiedProduct = await verifyResponse.json();
        console.log('Verified product sizes:', verifiedProduct.info);
      }
    } else {
      console.log(`❌ Product creation failed: ${response.status} ${response.statusText}`);
      const error = await response.text();
      console.log('Error details:', error);
    }
    
  } catch (error) {
    console.error('Error testing product creation:', error.message);
  }
}

// Run the test
testProductWithSizes();
