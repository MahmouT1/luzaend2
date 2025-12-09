import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000/api';

async function testDeleteEndpoint() {
  try {
    console.log('Testing DELETE endpoint availability...');
    
    // First test if the endpoint exists by making a simple request
    const response = await fetch(`${BASE_URL}/products/delete-product/test-id`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response status text:', response.statusText);
    
    if (response.status === 401) {
      console.log('Endpoint exists but requires authentication (expected)');
    } else if (response.status === 404) {
      console.log('Endpoint not found');
    } else {
      console.log('Unexpected response');
    }
    
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
  } catch (error) {
    console.error('Error testing DELETE endpoint:', error.message);
  }
}

testDeleteEndpoint();
