import { createOrder } from './controllers/order.controller.js';
import { connectToMongoDB } from './utils/db/connectDB.js';
import { ObjectId } from 'mongodb';

async function testControllerDelivery() {
  try {
    console.log('Testing controller delivery fee logic...');
    
    await connectToMongoDB();

    // Create mock request object
    const mockReq = {
      body: {
        userInfo: {
          userId: new ObjectId('68adbd15b4cf45e73a0b3f35'),
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '123-456-7890'
        },
        shippingAddress: {
          address: '123 Main St',
          city: 'New York',
          postalCode: '10001'
        },
        orderItems: [
          {
            id: '68adbd15b4cf45e73a0b3f35',
            name: 'Test Product',
            size: 'M',
            quantity: 1,
            price: 29.99
          }
        ],
        paymentMethod: {
          type: 'cash_on_delivery',
          status: 'unpaid'
        }
      },
      totalPrice: 29.99 // Simulate the price calculated by quantityChecker
    };

    const mockRes = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.responseData = data;
        console.log('✅ Order created via controller:', data);
        return this;
      }
    };

    // Test the controller function
    await createOrder(mockReq, mockRes);

    if (mockRes.responseData && mockRes.responseData.orderId) {
      console.log('✅ Controller test successful');
      return mockRes.responseData;
    } else {
      throw new Error('Controller test failed');
    }
  } catch (error) {
    console.log('❌ Controller delivery test failed:', error.message);
    throw error;
  }
}

// Run the test
testControllerDelivery()
  .then(result => {
    console.log('Test completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.log('Test failed');
    process.exit(1);
  });
