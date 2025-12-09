import { Order } from './models/order.model.js';
import { connectToMongoDB } from './utils/db/connectDB.js';

async function checkLatestOrder() {
  try {
    console.log('Checking latest order for delivery fee...');
    
    await connectToMongoDB();

    // Get the latest order
    const latestOrder = await Order.findOne().sort({ createdAt: -1 });
    
    if (latestOrder) {
      console.log('✅ Latest order found:');
      console.log('Order ID:', latestOrder._id);
      console.log('Total Price:', latestOrder.totalPrice);
      console.log('Delivery Fee:', latestOrder.deliveryFee);
      console.log('Subtotal:', latestOrder.subtotal);
      console.log('Payment Method:', latestOrder.paymentMethod);
      console.log('Order Items:', latestOrder.orderItems);
      
      return latestOrder;
    } else {
      console.log('❌ No orders found');
      return null;
    }
  } catch (error) {
    console.log('❌ Error checking latest order:', error.message);
    throw error;
  }
}

// Run the check
checkLatestOrder()
  .then(result => {
    console.log('Check completed');
    process.exit(0);
  })
  .catch(error => {
    console.log('Check failed');
    process.exit(1);
  });
