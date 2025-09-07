import { connectToMongoDB } from './utils/db/connectDB.js';
import { User } from './models/user.model.js';
import jwt from 'jsonwebtoken';
import { Order } from './models/order.model.js';
import { getAnalyticsOverview, getSalesTrend, getTopProducts } from './controllers/analytics.controller.js';

async function testAnalyticsDirect() {
  try {
    console.log('Testing Analytics Controller Directly...\n');
    
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
    
    // Create mock request with admin user
    const mockRequest = {
      user: {
        _id: adminUser._id,
        role: 'admin'
      },
      query: {}
    };
    
    const mockResponse = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        console.log('✅ Response:', this.statusCode, data);
        return this;
      }
    };
    
    console.log('1. Testing getAnalyticsOverview...');
    await getAnalyticsOverview(mockRequest, mockResponse);
    
    console.log('\n2. Testing getSalesTrend...');
    mockRequest.query = { period: '7d' };
    await getSalesTrend(mockRequest, mockResponse);
    
    console.log('\n3. Testing getTopProducts...');
    mockRequest.query = { limit: 5 };
    await getTopProducts(mockRequest, mockResponse);
    
    console.log('\n✅ All analytics controller tests completed successfully!');
    
  } catch (error) {
    console.log('❌ Analytics test failed:', error.message);
    console.log(error.stack);
  }
}

// Run the test
testAnalyticsDirect();
