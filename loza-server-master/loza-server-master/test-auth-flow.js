import { connectToMongoDB } from './utils/db/connectDB.js';
import { User } from './models/user.model.js';
import jwt from 'jsonwebtoken';
import { isAuthenticatd } from './middlewares/auth/isAuthenticated.js';

async function testAuthFlow() {
  try {
    console.log('Testing authentication flow...');
    
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
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );
    
    console.log('✅ JWT token generated:', token);
    
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
    
    console.log('Testing authentication middleware...');
    await isAuthenticatd(mockRequest, mockResponse, mockNext);
    
    if (nextCalled) {
      console.log('✅ Authentication flow working correctly');
      console.log('Authenticated user:', mockRequest.user);
    } else {
      console.log('❌ Authentication middleware did not call next()');
    }
    
  } catch (error) {
    console.log('❌ Auth flow test failed:', error.message);
  }
}

testAuthFlow();
