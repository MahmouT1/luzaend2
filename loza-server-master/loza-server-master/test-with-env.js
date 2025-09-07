import { connectToMongoDB } from './utils/db/connectDB.js';
import { User } from './models/user.model.js';
import jwt from 'jsonwebtoken';
import { isAuthenticatd } from './middlewares/auth/isAuthenticated.js';

// Set JWT_SECRET for testing
process.env.JWT_SECRET = 'test-secret-key-for-development';

async function testWithEnv() {
  try {
    console.log('Testing with explicit JWT_SECRET...');
    
    await connectToMongoDB();
    
    // Create test admin user
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
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('✅ JWT token generated with explicit secret');
    
    // Test authentication middleware directly
    const mockRequest = {
      cookies: {
        jwt: token
      }
    };
    
    const mockResponse = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        console.log('Auth response:', this.statusCode, data);
        return this;
      }
    };
    
    let nextCalled = false;
    const mockNext = () => {
      nextCalled = true;
      console.log('✅ Authentication middleware passed - next() called');
    };
    
    console.log('Testing authentication middleware with explicit secret...');
    await isAuthenticatd(mockRequest, mockResponse, mockNext);
    
    if (nextCalled) {
      console.log('✅ Authentication flow working correctly with explicit secret');
      console.log('Authenticated user:', mockRequest.user);
      
      // Now test the API call
      try {
        const axios = require('axios');
        const response = await axios.get('http://localhost:8000/api/orders/get-orders', {
          headers: {
            Cookie: `jwt=${token}`
          }
        });
        
        console.log('✅ API call successful with explicit secret:', response.status);
        console.log('Orders count:', response.data.orders.length);
        
      } catch (error) {
        console.log('❌ API call still failing:', error.response?.status, error.response?.data?.message);
      }
    } else {
      console.log('❌ Authentication middleware still failing');
    }
    
  } catch (error) {
    console.log('❌ Test with env failed:', error.message);
  }
}

testWithEnv();
