import axios from 'axios';
import { connectToMongoDB } from './utils/db/connectDB.js';
import { User } from './models/user.model.js';
import jwt from 'jsonwebtoken';

async function testApiDebug() {
  try {
    console.log('Debugging API with detailed error handling...');
    
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
    
    console.log('✅ JWT token generated');
    
    // Test with detailed error handling
    try {
      const response = await axios.get('http://localhost:8000/api/orders/get-orders', {
        headers: {
          Cookie: `jwt=${token}`
        },
        timeout: 5000
      });
      
      console.log('✅ API call successful:', response.status, response.data);
      
    } catch (error) {
      console.log('❌ API call failed:');
      console.log('Status:', error.response?.status);
      console.log('Status Text:', error.response?.statusText);
      console.log('Headers:', error.response?.headers);
      console.log('Data:', error.response?.data);
      console.log('Error message:', error.message);
      
      if (error.code) {
        console.log('Error code:', error.code);
      }
      
      if (error.response?.data?.stack) {
        console.log('Server stack trace:', error.response.data.stack);
      }
    }
    
  } catch (error) {
    console.log('❌ Debug test failed:', error.message);
  }
}

testApiDebug();
