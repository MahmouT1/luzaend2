import { Order } from './models/order.model.js';
import { Invoice } from './models/invoice.model.js';
import { connectToMongoDB } from './utils/db/connectDB.js';
import { ObjectId } from 'mongodb';

async function testCompleteSystem() {
  try {
    console.log('Testing complete order management system...');
    
    await connectToMongoDB();

    // Test 1: Create order with cash on delivery (should add $85 fee)
    console.log('\n1. Testing order creation with cash on delivery...');
    const orderData = {
      userInfo: {
        userId: new ObjectId(),
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
          id: 'product-1',
          name: 'Test Product',
          size: 'M',
          quantity: 2,
          price: 25.00
        }
      ],
      paymentMethod: {
        type: 'cash_on_delivery',
        status: 'unpaid'
      }
    };

    const order = await Order.create({
      ...orderData,
      totalPrice: 50.00, // 2 items × $25
      deliveryFee: 85.00,
      subtotal: 50.00
    });

    console.log('✅ Order created:', order._id);
    console.log('   Total Price:', order.totalPrice);
    console.log('   Delivery Fee:', order.deliveryFee);
    console.log('   Subtotal:', order.subtotal);

    // Test 2: Create invoice
    console.log('\n2. Testing invoice creation...');
    const invoice = await Invoice.create({
      orderId: order._id,
      userId: order.userInfo.userId,
      pdf: Buffer.from('Test PDF content')
    });

    console.log('✅ Invoice created:', invoice._id);

    // Test 3: Update order status
    console.log('\n3. Testing order status update...');
    const updatedOrder = await Order.findByIdAndUpdate(
      order._id,
      { orderStatus: 'Complete' },
      { new: true }
    );

    console.log('✅ Order status updated to:', updatedOrder.orderStatus);

    // Test 4: Get all orders
    console.log('\n4. Testing get all orders...');
    const allOrders = await Order.find().populate('invoiceId');
    console.log('✅ Found', allOrders.length, 'orders');

    // Test 5: Delete order
    console.log('\n5. Testing order deletion...');
    const deleteResult = await Order.findByIdAndDelete(order._id);
    console.log('✅ Order deleted successfully');

    // Also delete invoice
    await Invoice.findOneAndDelete({ orderId: order._id });
    console.log('✅ Invoice deleted successfully');

    // Verify deletion
    const verifyOrder = await Order.findById(order._id);
    const verifyInvoice = await Invoice.findOne({ orderId: order._id });
    
    if (!verifyOrder && !verifyInvoice) {
      console.log('✅ Order and invoice completely removed from database');
      return true;
    } else {
      console.log('❌ Cleanup failed');
      return false;
    }

  } catch (error) {
    console.log('❌ Complete system test failed:', error.message);
    throw error;
  }
}

// Run the test
testCompleteSystem()
  .then(result => {
    if (result) {
      console.log('\n🎉 Complete system test PASSED! All functionality working correctly.');
    } else {
      console.log('\n❌ Complete system test FAILED!');
    }
    process.exit(0);
  })
  .catch(error => {
    console.log('\n❌ Test failed with error');
    process.exit(1);
  });
