import { connectToMongoDB } from './utils/db/connectDB.js';
import { Order } from './models/order.model.js';
import { Invoice } from './models/invoice.model.js';
import mongoose from 'mongoose';

async function testDBConnection() {
  try {
    console.log('Testing database connection and operations...');
    
    await connectToMongoDB();
    console.log('✅ Database connected successfully');
    
    // Create a valid ObjectId for testing
    const testUserId = new mongoose.Types.ObjectId();
    const testProductId = new mongoose.Types.ObjectId();
    const testOrderId = new mongoose.Types.ObjectId();
    
    // Test basic order creation
    try {
      const testOrder = await Order.create({
        _id: testOrderId,
        userInfo: {
          userId: testUserId,
          firstName: 'Test',
          lastName: 'User',
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
            id: testProductId,
            name: 'Test Product',
            size: 'M',
            quantity: 1,
            price: 100
          }
        ],
        paymentMethod: {
          type: 'cash_on_delivery',
          status: 'unpaid'
        },
        totalPrice: 185,
        orderStatus: 'Pending'
      });
      
      console.log('✅ Order created successfully:', testOrder._id);
      
      // Test invoice creation
      const testInvoice = await Invoice.create({
        orderId: testOrder._id,
        userId: testUserId,
        pdf: Buffer.from('test pdf content')
      });
      
      console.log('✅ Invoice created successfully:', testInvoice._id);
      
      // Test order update to Complete status
      const updatedOrder = await Order.findByIdAndUpdate(
        testOrder._id,
        { orderStatus: 'Complete' },
        { new: true }
      );
      
      console.log('✅ Order updated successfully:', updatedOrder.orderStatus);
      
      // Test order update to Pending status
      const updatedOrder2 = await Order.findByIdAndUpdate(
        testOrder._id,
        { orderStatus: 'Pending' },
        { new: true }
      );
      
      console.log('✅ Order updated to Pending:', updatedOrder2.orderStatus);
      
      // Clean up
      await Order.findByIdAndDelete(testOrder._id);
      await Invoice.findOneAndDelete({ orderId: testOrder._id });
      console.log('✅ Test data cleaned up');
      
    } catch (error) {
      console.log('❌ Database operation error:', error.message);
      throw error;
    }
    
  } catch (error) {
    console.log('❌ Database test failed:', error.message);
  }
}

testDBConnection();
