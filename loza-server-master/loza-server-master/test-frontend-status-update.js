import axios from 'axios';
import jwt from 'jsonwebtoken';

// Set JWT_SECRET for testing
process.env.JWT_SECRET = 'test-secret-key-for-development';

async function testFrontendStatusUpdate() {
  try {
    // Generate JWT token
    const token = jwt.sign(
      { userId: '68ae01b23235e58f8d35ebc9' }, // Use a valid user ID
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('✅ JWT token generated for API call');

    // Test the exact payload that the frontend sends
    const orderId = '68adcb3a18d1dfa7b9360f90'; // Use a valid order ID
    const status = 'Complete';
    
    const updateResponse = await axios.put(
      `http://localhost:8000/api/orders/update-order-status/${orderId}`,
      { orderStatus: status }, // This is what the frontend should send now
      {
        headers: {
          Cookie: `jwt=${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Frontend-style status update successful:', updateResponse.data);

    // Test invoice download
    const invoiceResponse = await axios.get(
      `http://localhost:8000/api/invoices/${orderId}`,
      {
        headers: {
          Cookie: `jwt=${token}`
        },
        responseType: 'arraybuffer'
      }
    );

    console.log('✅ Invoice download successful:', invoiceResponse.headers['content-type']);

  } catch (error) {
    console.log('❌ Frontend test failed:', error.response?.status, error.response?.data?.message);
  }
}

testFrontendStatusUpdate();
