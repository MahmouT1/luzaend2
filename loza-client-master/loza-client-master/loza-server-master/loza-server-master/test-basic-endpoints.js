import axios from 'axios';

async function testBasicEndpoints() {
  try {
    console.log('Testing basic API endpoints...');
    
    // Test if server is responding
    try {
      const response = await axios.get('http://localhost:8000/');
      console.log('✅ Server is responding:', response.status);
    } catch (error) {
      console.log('❌ Server not responding:', error.message);
      return;
    }
    
    // Test health endpoint
    try {
      const response = await axios.get('http://localhost:8000/api/health');
      console.log('✅ Health endpoint:', response.status, response.data);
    } catch (error) {
      console.log('⚠️ Health endpoint not available:', error.message);
    }
    
    // Test if orders endpoint exists
    try {
      const response = await axios.get('http://localhost:8000/api/orders/get-orders');
      console.log('✅ Orders endpoint accessible:', response.status);
    } catch (error) {
      console.log('❌ Orders endpoint error:', error.response?.status, error.response?.data?.message);
    }
    
  } catch (error) {
    console.log('❌ Basic endpoint test failed:', error.message);
  }
}

testBasicEndpoints();
