import { Order } from './models/order.model.js';
import { connectToMongoDB } from './utils/db/connectDB.js';
import { ObjectId } from 'mongodb';

async function testDeleteOrder() {
  try {
    console.log('Testing order deletion functionality...');
    
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

    // Now test the delete function
    const deleteOrder = async (orderId) => {
      try {
        const result = await Order.findByIdAndDelete(orderId);
        return result !== null;
      } catch (error) {
        console.log('Delete error:', error.message);
        return false;
      }
    };

    // Delete the test order
    const deleteSuccess = await deleteOrder(testOrder._id);
    
    if (deleteSuccess) {
      console.log('✅ Order deletion successful');
      
      // Verify the order is gone
      const verifyOrder = await Order.findById(testOrder._id);
      if (!verifyOrder) {
        console.log('✅ Order successfully removed from database');
        return true;
      } else {
        console.log('❌ Order still exists in database');
        return false;
      }
    } else {
      console.log('❌ Order deletion failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Delete order test failed:', error.message);
    throw error;
  }
}

// Run the test
testDeleteOrder()
  .then(result => {
    if (result) {
      console.log('✅ Delete order test completed successfully');
    } else {
      console.log('❌ Delete order test failed');
    }
    process.exit(0);
  })
  .catch(error => {
    console.log('Test failed with error');
    process.exit(1);
  });
