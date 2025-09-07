const BASE_URL = 'http://localhost:8000/api';

// Test data for creating an order (simplified)
const testOrderData = {
  userInfo: {
    userId: "68ac5938c761ccfa4456c04f", // Valid user ID from the database
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

async function testSimpleOrder() {
  try {
    console.log('Testing simple order creation...');
    
    // Test creating an order
    const createResponse = await fetch(`${BASE_URL}/orders/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrderData)
    });
    
    if (createResponse.ok) {
      const result = await createResponse.json();
      console.log('✅ Order created successfully:', result);
    } else {
      console.log('❌ Order creation failed:', createResponse.status);
      const error = await createResponse.text();
      console.log('Error details:', error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('Error message:', error.message);
  }
}

// Run the test
testSimpleOrder();
