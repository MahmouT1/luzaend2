import { connectToMongoDB } from './utils/db/connectDB.js';
import { Order } from './models/order.model.js';

async function checkOrderData() {
  try {
    console.log('Checking order data in database...\n');
    
    await connectToMongoDB();
    
    // Get all orders
    const orders = await Order.find({});
    
    console.log(`Total orders: ${orders.length}`);
    
    orders.forEach((order, index) => {
      console.log(`\nOrder ${index + 1}:`);
      console.log(`- ID: ${order._id}`);
      console.log(`- Order Number: ${order.orderNumber}`);
      console.log(`- Total Price: $${order.totalPrice}`);
      console.log(`- Order Status: ${order.orderStatus}`);
      console.log(`- Payment Method: ${JSON.stringify(order.paymentMethod)}`);
      console.log(`- Payment Status: ${order.paymentStatus}`);
      console.log(`- Created At: ${order.createdAt}`);
      
      if (order.orderItems && order.orderItems.length > 0) {
        console.log(`- Items: ${order.orderItems.length} products`);
        order.orderItems.forEach((item, itemIndex) => {
          console.log(`  ${itemIndex + 1}. ${item.name} - $${item.price} x ${item.quantity}`);
        });
      }
    });
    
    // Check payment status distribution
    const paidOrders = orders.filter(order => 
      order.paymentMethod?.status === 'paid' || order.paymentStatus === 'paid'
    );
    
    const completedOrders = orders.filter(order => 
      order.orderStatus === 'Complete' || order.orderStatus === 'completed'
    );
    
    const pendingOrders = orders.filter(order => 
      order.orderStatus === 'Pending' || order.orderStatus === 'pending'
    );
    
    console.log(`\n--- Summary ---`);
    console.log(`Paid orders: ${paidOrders.length}`);
    console.log(`Completed orders: ${completedOrders.length}`);
    console.log(`Pending orders: ${pendingOrders.length}`);
    
  } catch (error) {
    console.log('Error checking order data:', error.message);
  }
}

// Run the check
checkOrderData();
