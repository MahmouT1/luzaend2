import axios from 'axios';
import jwt from 'jsonwebtoken';

// Set JWT_SECRET for testing
process.env.JWT_SECRET = 'test-secret-key-for-development';

async function testCompleteFlow() {
  try {
    // Generate JWT token
    const token = jwt.sign(
      { userId: '68ae01b23235e58f8d35ebc9' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('✅ JWT token generated for API call');

    // Create a new order with invoice generation
    const orderData = {
      userInfo: {
        userId: '68ae01b23235e58f8d35ebc9',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '1234567890'
      },
      shippingAddress: {
        address: '123 Test Street',
        city: 'Test City',
        postalCode: '12345',
        country: 'Test Country'
      },
      orderItems: [
        {
          id: 'test-product-1',
          name: 'Test Product',
          size: 'M',
          quantity: 2,
          price: 50
        }
      ],
      paymentMethod: {
        type: 'cash_on_delivery',
        status: 'unpaid'
      },
      totalPrice: 100
    };

    console.log('Creating new order with invoice generation...');
    const createResponse = await axios.post(
      'http://localhost:8000/api/orders/create-order',
      orderData,
      {
        headers: {
          Cookie: `jwt=${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Order created successfully:', createResponse.data);
    const orderId = createResponse.data.orderId;

    // Test order status update
    console.log('Testing order status update...');
    const updateResponse = await axios.put(
      `http://localhost:8000/api/orders/update-order-status/${orderId}`,
      { orderStatus: 'Complete' },
      {
        headers: {
          Cookie: `jwt=${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Order status updated successfully:', updateResponse.data);

    // Test invoice download
    console.log('Testing invoice download...');
    const invoiceResponse = await axios.get(
      `http://localhost:8000/api/orders/invoice/${orderId}`,
      {
        headers: {
          Cookie: `jwt=${token}`
        },
        responseType: 'arraybuffer'
      }
    );

    console.log('✅ Invoice download successful:', invoiceResponse.headers['content-type']);
    console.log('✅ Invoice size:', invoiceResponse.data.length + ' bytes');

    console.log('🎉 Complete flow test successful!');

  } catch (error) {
    console.log('❌ Test failed:', error.response?.status, error.response?.data?.message || error.message);
  }
}

testCompleteFlow();
