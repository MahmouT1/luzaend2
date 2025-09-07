import axios from 'axios';
import { connectToMongoDB } from './utils/db/connectDB.js';
import { User } from './models/user.model.js';
import jwt from 'jsonwebtoken';

async function createTestAdmin() {
  try {
    await connectToMongoDB();
    
    // Create or get test admin user
    let adminUser = await User.findOne({ email: 'testadmin@example.com' });
    
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Test Admin',
        email: 'testadmin@example.com',
        password: 'password123',
        role: 'admin'
      });
      console.log('✅ Test admin user created');
    } else {
      console.log('✅ Test admin user found');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: adminUser._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );
    
    console.log('✅ JWT token generated');
    return token;
  } catch (error) {
    console.log('❌ Error creating test admin:', error.message);
    throw error;
  }
}

async function testApiWithAuth() {
  try {
    console.log('Testing API with authentication...');
    
    const token = await createTestAdmin();
    
    // Test getting orders with authentication
    const ordersResponse = await axios.get('http://localhost:8000/api/orders/get-orders', {
      headers: {
        Cookie: `jwt=${token}`
      },
      withCredentials: true
    });
    
    console.log('✅ Orders response:', ordersResponse.data);
    
    if (ordersResponse.data.orders.length === 0) {
      console.log('No orders found to test with');
      return;
    }
    
    const testOrder = ordersResponse.data.orders[0];
    console.log('Testing with order:', testOrder._id, 'Current status:', testOrder.orderStatus);
    
    // Test updating status to Complete
    const newStatus = 'Complete';
    const updateResponse = await axios.put(
      `http://localhost:8000/api/orders/update-order-status/${testOrder._id}`,
      { status: newStatus },
      {
        headers: {
          Cookie: `jwt=${token}`
        },
        withCredentials: true
      }
    );
    
    console.log('✅ Update response:', updateResponse.data);
    
    // Verify the update
    const verifyResponse = await axios.get(`http://localhost:8000/api/orders/get-order/${testOrder._id}`, {
      headers: {
        Cookie: `jwt=${token}`
      },
      withCredentials: true
    });
    
    console.log('✅ Verified status:', verifyResponse.data.order.orderStatus);
    
    if (verifyResponse.data.order.orderStatus === newStatus) {
      console.log('🎉 API order status update working correctly with authentication');
    } else {
      console.log('❌ API order status update failed');
    }
    
  } catch (error) {
    console.log('❌ API test failed:', error.response?.data || error.message);
    console.log('Error details:', error.response?.status, error.response?.statusText);
  }
}

testApiWithAuth();
