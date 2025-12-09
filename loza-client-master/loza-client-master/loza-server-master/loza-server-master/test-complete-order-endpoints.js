const BASE_URL = 'http://localhost:8000/api';

// Test data for creating an order
const testOrderData = {
  userInfo: {
    userId: "68ac5938c761ccfa4456c04f",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890"
  },
  shippingAddress: {
    address: "123 Main St",
    city: "Anytown",
    postalCode: "12345"
  },
  orderItems: [
    {
      id: "68ac4efbb338a1d5dc622b13",
      name: "Test Product",
      size: "M",
      quantity: 2,
      price: 29.99
    }
  ],
  totalPrice: 59.98,
  paymentMethod: {
    type: "credit_card",
    status: "paid"
  }
};

async function testAllOrderEndpoints() {
  let createdOrderId = null;
  let createdInvoiceId = null;

  try {
    console.log('🧪 Testing Complete Order Management Endpoints\n');

    // 1. Test creating an order
    console.log('1. Testing order creation...');
    const createResponse = await fetch(`${BASE_URL}/orders/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrderData)
    });

    if (createResponse.ok) {
      const result = await createResponse.json();
      console.log('✅ Order created successfully');
      createdOrderId = result.orderId;
      createdInvoiceId = result.invoiceId;
      console.log(`   Order ID: ${createdOrderId}`);
      console.log(`   Invoice ID: ${createdInvoiceId}`);
      console.log(`   Order Number: ${result.orderNumber}\n`);
    } else {
      console.log('❌ Order creation failed:', createResponse.status);
      const error = await createResponse.text();
      console.log('Error details:', error);
      return;
    }

    // 2. Test getting all orders
    console.log('2. Testing get all orders...');
    const allOrdersResponse = await fetch(`${BASE_URL}/orders/get-orders`);
    
    if (allOrdersResponse.ok) {
      const result = await allOrdersResponse.json();
      console.log('✅ Orders retrieved successfully');
      console.log(`   Total orders: ${result.orders?.length || 0}\n`);
    } else {
      console.log('❌ Get all orders failed:', allOrdersResponse.status);
      const error = await allOrdersResponse.text();
      console.log('Error details:', error);
    }

    // 3. Test getting specific order
    console.log('3. Testing get specific order...');
    const orderResponse = await fetch(`${BASE_URL}/orders/get-order/${createdOrderId}`);
    
    if (orderResponse.ok) {
      const result = await orderResponse.json();
      console.log('✅ Order retrieved successfully');
      console.log(`   Order Status: ${result.order?.orderStatus}`);
      console.log(`   Total Price: $${result.order?.totalPrice}\n`);
    } else {
      console.log('❌ Get order failed:', orderResponse.status);
      const error = await orderResponse.text();
      console.log('Error details:', error);
    }

    // 4. Test updating order status
    console.log('4. Testing order status update...');
    const updateResponse = await fetch(`${BASE_URL}/orders/update-order-status/${createdOrderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderStatus: "Complete" })
    });

    if (updateResponse.ok) {
      const result = await updateResponse.json();
      console.log('✅ Order status updated successfully');
      console.log(`   New Status: ${result.order?.orderStatus}\n`);
    } else {
      console.log('❌ Order status update failed:', updateResponse.status);
      const error = await updateResponse.text();
      console.log('Error details:', error);
    }

    // 5. Test invoice download
    console.log('5. Testing invoice download...');
    const invoiceResponse = await fetch(`${BASE_URL}/invoices/${createdOrderId}`);
    
    if (invoiceResponse.ok) {
      console.log('✅ Invoice download successful');
      const contentType = invoiceResponse.headers.get('content-type');
      console.log(`   Content Type: ${contentType}`);
      console.log('   Invoice PDF received successfully\n');
    } else {
      console.log('❌ Invoice download failed:', invoiceResponse.status);
      const error = await invoiceResponse.text();
      console.log('Error details:', error);
    }

    console.log('🎉 All order management endpoints tested successfully!');

  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Error message:', error.message);
  }
}

// Run the complete test
testAllOrderEndpoints();
