import axios from 'axios';

async function testAPIOrderCreation() {
  try {
    console.log('Testing API order creation...');
    
    const orderData = {
      userInfo: {
        userId: '68adbd15b4cf45e73a0b3f35', // String ID (API should handle conversion)
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
          id: '68adbd15b4cf45e73a0b3f35', // String ID
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

    const response = await axios.post('http://localhost:8000/api/orders/create-order', orderData);
    
    console.log('✅ Order created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.log('❌ Order creation failed:', error.response?.data || error.message);
    throw error;
  }
}

// Run the test
testAPIOrderCreation()
  .then(result => {
    console.log('Test completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.log('Test failed');
    process.exit(1);
  });
