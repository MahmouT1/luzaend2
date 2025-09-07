import { Order } from './models/order.model.js';
import { connectToMongoDB } from './utils/db/connectDB.js';
import { ObjectId } from 'mongodb';

async function testCompleteOrderFlow() {
  try {
    console.log('Testing complete order flow...');
    
    await connectToMongoDB();

    // Create order data with cash on delivery
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
        type: 'cash_on_delivery',
        status: 'unpaid'
      },
      totalPrice: 0 // This will be calculated in the controller
    };

    // Simulate order creation
    const order = await Order.create(orderData);
    console.log('✅ Order created:', order._id);
    console.log('✅ Total Price:', order.totalPrice);
    console.log('✅ Delivery Fee:', order.deliveryFee);
    console.log('✅ Subtotal:', order.subtotal);

    return order;
  } catch (error) {
    console.log('❌ Complete order flow test failed:', error.message);
    throw error;
  }
}

// Run the test
testCompleteOrderFlow()
  .then(result => {
    console.log('Test completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.log('Test failed');
    process.exit(1);
  });
