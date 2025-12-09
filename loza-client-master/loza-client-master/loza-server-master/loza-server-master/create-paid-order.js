import { connectToMongoDB } from './utils/db/connectDB.js';
import { Order } from './models/order.model.js';

async function createPaidOrder() {
  try {
    console.log('Creating a paid order for testing analytics...\n');
    
    await connectToMongoDB();
    
    // Create a paid order
    const paidOrder = await Order.create({
      userInfo: {
        userId: '68ac5cbc0d80ce5c56892b2e', // Using a valid ObjectId from existing orders
        firstName: 'Test',
        lastName: 'Customer',
        email: 'test@example.com',
        phone: '1234567890'
      },
      shippingAddress: {
        address: '123 Test St',
        city: 'Test City',
        postalCode: '12345'
      },
      orderItems: [
        {
          id: 'test-product-1',
          name: 'Test Product',
          price: 10000,
          quantity: 2,
          size: 'M'
        }
      ],
      orderStatus: 'Complete',
      totalPrice: 20000,
      paymentMethod: {
        type: 'Credit Card',
        status: 'paid'
      },
      paidAt: new Date()
    });
    
    console.log('✅ Paid order created successfully!');
    console.log(`- Order Number: ${paidOrder.orderNumber}`);
    console.log(`- Total Price: $${paidOrder.totalPrice}`);
    console.log(`- Payment Status: ${paidOrder.paymentMethod.status}`);
    console.log(`- Order Status: ${paidOrder.orderStatus}`);
    
    // Now test the analytics
    console.log('\nTesting analytics with the new paid order...');
    
    const orders = await Order.find({});
    const paidOrders = orders.filter(order => 
      order.paymentMethod?.status === 'paid' || order.paymentStatus === 'paid'
    );
    
    const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    
    console.log(`Total orders: ${orders.length}`);
    console.log(`Paid orders: ${paidOrders.length}`);
    console.log(`Total revenue: $${totalRevenue}`);
    
  } catch (error) {
    console.log('Error creating paid order:', error.message);
  }
}

// Run the function
createPaidOrder();
