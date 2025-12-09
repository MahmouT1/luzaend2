import { Order } from './models/order.model.js';
import { Invoice } from './models/invoice.model.js';
import { connectToMongoDB } from './utils/db/connectDB.js';
import { ObjectId } from 'mongodb';
import PDFDocument from 'pdfkit';

async function testInvoiceDownloadDirect() {
  try {
    console.log('Testing invoice download directly...');
    
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

    // Generate a simple PDF invoice
    const pdfBuffer = await new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      // Simple PDF content
      doc.fontSize(20).text("Test Invoice", { align: "center" }).moveDown();
      doc.fontSize(12).text(`Order ID: ${order._id}`);
      doc.text(`Customer: John Doe`);
      doc.text(`Total: $29.99`);
      doc.end();
    });

    // Save Invoice to DB
    const invoice = await Invoice.create({
      orderId: order._id,
      userId: order.userInfo.userId,
      pdf: pdfBuffer,
    });

    console.log('✅ Invoice created:', invoice._id);

    // Link invoiceId to order
    order.invoiceId = invoice._id;
    await order.save();

    console.log('✅ Order updated with invoice ID');

    // Test retrieving the invoice
    const retrievedInvoice = await Invoice.findOne({ orderId: order._id });
    
    if (retrievedInvoice && retrievedInvoice.pdf) {
      console.log('✅ Invoice retrieved successfully');
      console.log('Invoice PDF buffer size:', retrievedInvoice.pdf.length, 'bytes');
      return { success: true, orderId: order._id, invoiceId: invoice._id };
    } else {
      console.log('❌ Invoice retrieval failed');
      throw new Error('Invoice not found or no PDF data');
    }
  } catch (error) {
    console.log('❌ Invoice download test failed:', error.message);
    throw error;
  }
}

// Run the test
testInvoiceDownloadDirect()
  .then(result => {
    console.log('Test completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.log('Test failed');
    process.exit(1);
  });
