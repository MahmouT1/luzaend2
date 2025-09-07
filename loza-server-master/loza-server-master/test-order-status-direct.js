import { Order } from './models/order.model.js';
import { connectToMongoDB } from './utils/db/connectDB.js';
import { ObjectId } from 'mongodb';

async function testOrderStatusDirect() {
  try {
    console.log('Testing order status update directly...');
    
    await connectToMongoDB();

    // First create an order
    const orderData = {
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
        type: 'credit_card',
        status: 'paid'
      },
      totalPrice: 29.99
    };

    const order = await Order.create(orderData);
    console.log('✅ Order created:', order._id);

    // Test updating order status to "Complete"
    const updatedOrder = await Order.findByIdAndUpdate(
      order._id,
      { orderStatus: 'Complete' },
      { new: true, runValidators: true }
    );

    console.log('✅ Order status updated to Complete:', updatedOrder.orderStatus);

    // Test updating order status to "Pending"
    const updatedOrder2 = await Order.findByIdAndUpdate(
      order._id,
      { orderStatus: 'Pending' },
      { new: true, runValidators: true }
    );

    console.log('✅ Order status updated to Pending:', updatedOrder2.orderStatus);

    return { orderId: order._id, statuses: [updatedOrder.orderStatus, updatedOrder2.orderStatus] };
  } catch (error) {
    console.log('❌ Order status update failed:', error.message);
    throw error;
  }
}

// Run the test
testOrderStatusDirect()
  .then(result => {
    console.log('Test completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.log('Test failed');
    process.exit(1);
  });
