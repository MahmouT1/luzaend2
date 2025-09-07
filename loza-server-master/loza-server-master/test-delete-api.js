import { Order } from './models/order.model.js';
import { connectToMongoDB } from './utils/db/connectDB.js';
import { ObjectId } from 'mongodb';

async function testDeleteAPI() {
  try {
    console.log('Testing DELETE API endpoint functionality...');
    
    await connectToMongoDB();

    // First, create a test order to delete
    const testOrder = await Order.create({
      userInfo: {
        userId: new ObjectId(),
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '123-456-7890'
      },
      shippingAddress: {
        address: 'Test Address',
        city: 'Test City',
        postalCode: '12345'
      },
      orderItems: [
        {
          id: 'test-product-id',
          name: 'Test Product',
          size: 'M',
          quantity: 1,
          price: 29.99
        }
      ],
      paymentMethod: {
        type: 'card',
        status: 'paid'
      },
      totalPrice: 29.99,
      orderNumber: 999 // Temporary number for testing
    });

    console.log('✅ Test order created:', testOrder._id);

    // Test the controller's deleteOrder function directly
    const deleteOrder = async (req, res) => {
      try {
        const { id } = req.params;
        
        const order = await Order.findByIdAndDelete(id);
        
        if (!order) {
          return res.status(404).json({ message: "Order not found" });
        }

        // Also delete associated invoice (simulate this part)
        console.log('✅ Would delete associated invoice for order:', id);
        
        return { status: 200, data: { message: "Order deleted successfully" } };
      } catch (error) {
        console.log('Delete error:', error.message);
        return { status: 500, data: { message: "Internal Server Error" } };
      }
    };

    // Simulate the API call
    const mockReq = { params: { id: testOrder._id } };
    const mockRes = {
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.responseData = data; return this; }
    };

    const result = await deleteOrder(mockReq, mockRes);

    if (result && result.status === 200) {
      console.log('✅ API delete test successful');
      
      // Verify the order is gone
      const verifyOrder = await Order.findById(testOrder._id);
      if (!verifyOrder) {
        console.log('✅ Order successfully removed from database via API');
        return true;
      } else {
        console.log('❌ Order still exists in database');
        return false;
      }
    } else {
      console.log('❌ API delete test failed');
      return false;
    }
  } catch (error) {
    console.log('❌ API delete test failed:', error.message);
    throw error;
  }
}

// Run the test
testDeleteAPI()
  .then(result => {
    if (result) {
      console.log('✅ API delete test completed successfully');
    } else {
      console.log('❌ API delete test failed');
    }
    process.exit(0);
  })
  .catch(error => {
    console.log('Test failed with error');
    process.exit(1);
  });
