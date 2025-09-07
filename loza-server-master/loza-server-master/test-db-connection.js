import { connectToMongoDB } from './utils/db/connectDB.js';
import { Order } from './models/order.model.js';
import { Invoice } from './models/invoice.model.js';

async function testDBConnection() {
  try {
    console.log('Testing database connection and operations...');
    
    await connectToMongoDB();
    console.log('✅ Database connected successfully');
    
    // Test basic order creation
    try {
      const testOrder = await Order.create({
        userInfo: {
          userId: 'test-user-id-123',
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
            id: 'test-product-id',
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
        orderStatus: 'Confirmed'
      });
      
      console.log('✅ Order created successfully:', testOrder._id);
      
      // Test invoice creation
      const testInvoice = await Invoice.create({
        orderId: testOrder._id,
        userId: 'test-user-id-123',
        pdf: Buffer.from('test pdf content')
      });
      
      console.log('✅ Invoice created successfully:', testInvoice._id);
      
      // Test order update
      const updatedOrder = await Order.findByIdAndUpdate(
        testOrder._id,
        { orderStatus: 'Complete' },
        { new: true }
      );
      
      console.log('✅ Order updated successfully:', updatedOrder.orderStatus);
      
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
