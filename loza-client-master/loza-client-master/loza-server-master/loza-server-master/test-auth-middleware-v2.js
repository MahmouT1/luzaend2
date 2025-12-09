import { connectToMongoDB } from './utils/db/connectDB.js';
import { User } from './models/user.model.js';
import jwt from 'jsonwebtoken';

async function testAuthMiddleware() {
  try {
    console.log('Testing authentication middleware...');
    
    await connectToMongoDB();
    
    // Create test user if it doesn't exist
    let testUser = await User.findOne({ email: 'testuser@example.com' });
    
    if (!testUser) {
      testUser = await User.create({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'user'
      });
      console.log('✅ Test user created');
    } else {
      console.log('✅ Test user found');
    }
    
    // Generate valid token
    const validToken = jwt.sign(
      { userId: testUser._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );
    
    console.log('✅ Valid token generated');
    
    // Test token verification
    try {
      const decoded = jwt.verify(validToken, process.env.JWT_SECRET || 'fallback-secret');
      console.log('✅ Token verification successful:', decoded);
      
      // Test user lookup
      const user = await User.findById(decoded.userId);
      if (user) {
        console.log('✅ User lookup successful:', user.email);
      } else {
        console.log('❌ User lookup failed');
      }
      
    } catch (error) {
      console.log('❌ Token verification failed:', error.message);
    }
    
    // Test invalid token
    try {
      const invalidToken = 'invalid.token.here';
      jwt.verify(invalidToken, process.env.JWT_SECRET || 'fallback-secret');
      console.log('❌ Invalid token should have failed');
    } catch (error) {
      console.log('✅ Invalid token correctly rejected:', error.message);
    }
    
    // Clean up
    await User.findByIdAndDelete(testUser._id);
    console.log('✅ Test user cleaned up');
    
  } catch (error) {
    console.log('❌ Auth middleware test failed:', error.message);
  }
}

testAuthMiddleware();
