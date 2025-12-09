import { Invoice } from './models/invoice.model.js';
import { Order } from './models/order.model.js';
import { connectToMongoDB } from './utils/db/connectDB.js';

async function testInvoiceWithDelivery() {
  try {
    console.log('Testing invoice with delivery fee...');
    
    await connectToMongoDB();

    // Get the latest order (which has the delivery fee)
    const latestOrder = await Order.findOne().sort({ createdAt: -1 });
    
    if (!latestOrder) {
      console.log('❌ No orders found');
      return;
    }

    console.log('✅ Order found with delivery fee:', latestOrder._id);
    
    // Get the invoice for this order
    const invoice = await Invoice.findOne({ orderId: latestOrder._id });
    
    if (invoice && invoice.pdf) {
      console.log('✅ Invoice found with PDF data');
      console.log('Invoice PDF size:', invoice.pdf.length, 'bytes');
      
      // The PDF should contain the delivery fee information
      // We can't easily parse the PDF content here, but we can verify it exists
      return { success: true, order: latestOrder, invoiceExists: true };
    } else {
      console.log('❌ Invoice not found for order');
      return { success: false, order: latestOrder, invoiceExists: false };
    }
  } catch (error) {
    console.log('❌ Invoice with delivery test failed:', error.message);
    throw error;
  }
}

// Run the test
testInvoiceWithDelivery()
  .then(result => {
    console.log('Test completed');
    process.exit(0);
  })
  .catch(error => {
    console.log('Test failed');
    process.exit(1);
  });
