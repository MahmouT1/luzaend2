import { connectToMongoDB } from './utils/db/connectDB.js';
import { Order } from './models/order.model.js';
import { getAllOrders } from './controllers/order.controller.js';

// Mock request and response objects
const mockRequest = {
  user: {
    _id: '68ac5938c761ccfa4456c04f', // Use the actual admin user ID
    role: 'admin'
  }
};

const mockResponse = {
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    console.log('Response:', this.statusCode, data);
    return this;
  }
};

async function testOrderControllerDirect() {
  try {
    console.log('Testing order controller directly...');
    
    await connectToMongoDB();
    console.log('✅ Database connected successfully');
    
    // Test getAllOrders function directly
    try {
      await getAllOrders(mockRequest, mockResponse);
      console.log('✅ getAllOrders executed successfully');
    } catch (error) {
      console.log('❌ getAllOrders error:', error.message);
      console.log('Stack:', error.stack);
    }
    
  } catch (error) {
    console.log('❌ Direct test failed:', error.message);
  }
}

testOrderControllerDirect();
