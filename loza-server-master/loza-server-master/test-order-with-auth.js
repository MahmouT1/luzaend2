const BASE_URL = 'http://localhost:8000/api';

// Test data for creating an order
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

async function testOrderWithAuth() {
  try {
    // First, log in to get the token
    const loginData = {
      email: "testuser@example.com",
      password: "password123"
    };

    const loginResponse = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.text();
      console.log('❌ Login failed:', loginResponse.status, error);
      return;
    }

    const loginResult = await loginResponse.json();
    const token = loginResult.token;

    console.log('Testing order creation...');
    
    // Test creating an order
    const createResponse = await fetch(`${BASE_URL}/orders/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Include the token for authentication
      },
      body: JSON.stringify(testOrderData)
    });
    
    if (createResponse.ok) {
      const result = await createResponse.json();
      console.log('✅ Order created successfully:', result);
      
      const orderId = result.orderId;
      
      // Test invoice download
      console.log('Testing invoice download...');
      const invoiceResponse = await fetch(`${BASE_URL}/orders/invoice/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}` // Include the token for authentication
        }
      });
      
      if (invoiceResponse.ok) {
        console.log('✅ Invoice download successful');
        // The invoice should be a PDF file
        const contentType = invoiceResponse.headers.get('content-type');
        console.log('Content-Type:', contentType);
      } else {
        console.log('❌ Invoice download failed:', invoiceResponse.status);
        const error = await invoiceResponse.text();
        console.log('Error details:', error);
      }
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
testOrderWithAuth();
