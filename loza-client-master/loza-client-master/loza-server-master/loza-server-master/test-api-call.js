import axios from 'axios';
import jwt from 'jsonwebtoken';

// Set JWT_SECRET for testing
process.env.JWT_SECRET = 'test-secret-key-for-development';

async function testApiCall() {
  try {
    // Generate JWT token
    const token = jwt.sign(
      { userId: '68ae01b23235e58f8d35ebc9' }, // Use a valid user ID
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('✅ JWT token generated for API call');

    // Make API call to get orders
    const response = await axios.get('http://localhost:8000/api/orders/get-orders', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ API call successful:', response.data);
  } catch (error) {
    console.log('❌ API call failed:', error.response?.status, error.response?.data?.message);
  }
}

testApiCall();
