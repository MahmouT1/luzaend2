import axios from 'axios';
import fs from 'fs';

const BASE_URL = 'http://localhost:8000/api';

async function testInvoiceDownload() {
  try {
    console.log('Testing invoice download functionality...');
    
    // First, get all orders to see what's available
    const ordersResponse = await axios.get(`${BASE_URL}/orders/get-orders`);
    console.log('Orders found:', ordersResponse.data.orders.length);
    
    if (ordersResponse.data.orders.length > 0) {
      const order = ordersResponse.data.orders[0];
      console.log('Testing invoice download for order:', order._id);
      
      // Test downloading the invoice
      const invoiceResponse = await axios.get(`${BASE_URL}/orders/invoice/${order._id}`, {
        responseType: 'arraybuffer' // Important for binary data
      });
      
      // Save the PDF to a file
      fs.writeFileSync(`invoice-${order._id}.pdf`, invoiceResponse.data);
      console.log('✅ Invoice downloaded and saved successfully!');
      console.log('File saved as:', `invoice-${order._id}.pdf`);
      
    } else {
      console.log('No orders found to test invoice download');
    }
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      if (error.response.status === 401) {
        console.error('Authentication required - this is expected for admin endpoints');
      }
    }
  }
}

// Run the test
testInvoiceDownload();
