import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000/api';

async function testBasicAPI() {
  console.log('Testing basic API endpoints...');
  
  try {
    // Test getting all products
    const response = await fetch(`${BASE_URL}/products/get-products`);
    
    if (response.ok) {
      const products = await response.json();
      console.log('✅ Products endpoint working! Found', products.length, 'products');
      
      if (products.length > 0) {
        console.log('Sample product:', {
          name: products[0].name,
          price: products[0].price,
          sizes: products[0].info
        });
      }
    } else {
      console.log(`❌ Products endpoint failed: ${response.status} ${response.statusText}`);
    }
    
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testBasicAPI();
