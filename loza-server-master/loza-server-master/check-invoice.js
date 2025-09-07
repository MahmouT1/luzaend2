import axios from 'axios';
import jwt from 'jsonwebtoken';

// Set JWT_SECRET for testing
process.env.JWT_SECRET = 'test-secret-key-for-development';

async function checkInvoice() {
  try {
    // Generate JWT token
    const token = jwt.sign(
      { userId: '68ae01b23235e58f8d35ebc9' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const orderId = '68adcb3a18d1dfa7b9360f90';
    
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
    console.log('✅ Invoice size:', invoiceResponse.data.length + ' bytes');

  } catch (error) {
    if (error.response?.status === 404) {
      console.log('❌ Invoice not found for order: 68adcb3a18d1dfa7b9360f90');
    } else {
      console.log('❌ Error checking invoice:', error.response?.status, error.response?.data?.message);
    }
  }
}

checkInvoice();
