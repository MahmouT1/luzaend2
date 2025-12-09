import { Order } from './models/order.model.js';
import { connectToMongoDB } from './utils/db/connectDB.js';
import { ObjectId } from 'mongodb';

async function testOrderStatusUpdate() {
  try {
    console.log('Testing order status update functionality...');
    
    await connectToMongoDB();

    // Create a test order
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
      orderStatus: 'Pending',
      orderNumber: 999
    });

    console.log('✅ Test order created:', testOrder._id);
    console.log('Initial status:', testOrder.orderStatus);

    // Test status update
    const updatedOrder = await Order.findByIdAndUpdate(
      testOrder._id,
      { orderStatus: 'Complete' },
      { new: true, runValidators: true }
    );

    console.log('✅ Order status updated to:', updatedOrder.orderStatus);

    // Verify the update
    const verifiedOrder = await Order.findById(testOrder._id);
    console.log('✅ Verified status:', verifiedOrder.orderStatus);

    if (verifiedOrder.orderStatus === 'Complete') {
      console.log('✅ Order status update test PASSED');
      // Clean up
      await Order.findByIdAndDelete(testOrder._id);
      console.log('✅ Test order cleaned up');
      return true;
    } else {
      console.log('❌ Order status update test FAILED');
      return false;
    }
  } catch (error) {
    console.log('❌ Order status update test failed:', error.message);
    throw error;
  }
}

// Run the test
testOrderStatusUpdate()
  .then(result => {
    if (result) {
      console.log('🎉 Order status update functionality working correctly');
    } else {
      console.log('❌ Order status update functionality failed');
    }
    process.exit(0);
  })
  .catch(error => {
    console.log('Test failed with error');
    process.exit(1);
  });
