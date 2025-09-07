const axios = require('axios');

const BASE_URL = 'http://localhost:8000/api';

// Test the delete product endpoint
async function testDeleteProduct() {
  try {
    // First, let's get all products to see what we can delete
    const productsResponse = await axios.get(`${BASE_URL}/products/get-products`);
    console.log('Available products:', productsResponse.data);
    
    if (productsResponse.data.length === 0) {
      console.log('No products found to delete. Please create a product first.');
      return;
    }
    
    // Use the first product for testing
    const productToDelete = productsResponse.data[0];
    console.log(`Testing delete on product: ${productToDelete.name} (ID: ${productToDelete._id})`);
    
    // Test the delete endpoint
    const deleteResponse = await axios.delete(`${BASE_URL}/products/delete-product/${productToDelete._id}`, {
      withCredentials: true
    });
    
    console.log('Delete response:', deleteResponse.data);
    
    // Verify the product was deleted
    const productsAfterDelete = await axios.get(`${BASE_URL}/products/get-products`);
    console.log('Products after deletion:', productsAfterDelete.data.length);
    
  } catch (error) {
    console.error('Error testing delete product:', error.response?.data || error.message);
  }
}

testDeleteProduct();
