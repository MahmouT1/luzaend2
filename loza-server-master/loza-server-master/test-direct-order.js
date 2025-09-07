import { Order } from './models/order.model.js';
import { connectToMongoDB } from './utils/db/connectDB.js';
import { ObjectId } from 'mongodb';

async function testDirectOrderCreation() {
  try {
    console.log('Testing direct order creation...');
    
    await connectToMongoDB();

    const orderData = {
      userInfo: {
        userId: new ObjectId('68adbd15b4cf45e73a0b3f35'), // Use a valid ObjectId
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
    
    console.log('✅ Order created successfully:', order);
    return order;
  } catch (error) {
    console.log('❌ Order creation failed:', error.message);
    throw error;
  }
}

// Run the test
testDirectOrderCreation()
  .then(result => {
    console.log('Test completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.log('Test failed');
    process.exit(1);
  });
