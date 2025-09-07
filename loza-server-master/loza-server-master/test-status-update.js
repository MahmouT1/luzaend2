import axios from 'axios';
import jwt from 'jsonwebtoken';

// Set JWT_SECRET for testing
process.env.JWT_SECRET = 'test-secret-key-for-development';

async function testStatusUpdate() {
  try {
    // Generate JWT token
    const token = jwt.sign(
      { userId: '68ae01b23235e58f8d35ebc9' }, // Use a valid user ID
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('✅ JWT token generated for API call');

    // Get the first order to update
    const ordersResponse = await axios.get('http://localhost:8000/api/orders/get-orders', {
      headers: {
        Cookie: `jwt=${token}`
      }
    });

    const firstOrder = ordersResponse.data.orders[0];
    console.log('First order to update:', firstOrder._id, firstOrder.orderStatus);

    // Update order status to "Complete"
    const updateResponse = await axios.put(
      `http://localhost:8000/api/orders/update-order-status/${firstOrder._id}`,
      { orderStatus: 'Complete' },
      {
        headers: {
          Cookie: `jwt=${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Order status update successful:', updateResponse.data);

    // Verify the update
    const verifyResponse = await axios.get('http://localhost:8000/api/orders/get-orders', {
      headers: {
        Cookie: `jwt=${token}`
      }
    });

    const updatedOrder = verifyResponse.data.orders.find(order => order._id === firstOrder._id);
    console.log('✅ Order status verified:', updatedOrder.orderStatus);

  } catch (error) {
    console.log('❌ Status update failed:', error.response?.status, error.response?.data?.message);
  }
}

testStatusUpdate();
