import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000/api';

async function testNewArrival() {
  console.log('Testing new-arrival category...');
  
  try {
    // Test getting new arrival products
    const response = await fetch(`${BASE_URL}/products/get-products/new-arrival`);
    
    if (response.ok) {
      const products = await response.json();
      console.log('✅ New arrival endpoint working! Found', products.length, 'new arrival products');
      
      if (products.length > 0) {
        console.log('Sample new arrival product:', {
          name: products[0].name,
          price: products[0].price,
          discountPrice: products[0].discountPrice,
          sizes: products[0].info
        });
        
        // Verify that prices are being displayed correctly
        console.log('Price display verification:');
        console.log('Actual price:', products[0].price);
        console.log('Discount price:', products[0].discountPrice);
      }
    } else {
      console.log(`❌ New arrival endpoint failed: ${response.status} ${response.statusText}`);
      const error = await response.text();
      console.log('Error details:', error);
    }
    
  } catch (error) {
    console.error('Error testing new arrival:', error.message);
  }
}

testNewArrival();
