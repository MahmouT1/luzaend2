import axios from 'axios';
import { ObjectId } from 'mongodb';

async function testOrderCreation() {
  try {
    console.log('Testing order creation...');
    
    const orderData = {
      userInfo: {
        userId: 'test-user-id',
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
          id: new ObjectId('68adbd15b4cf45e73a0b3f35'),
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
testOrderCreation()
  .then(result => {
    console.log('Test completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.log('Test failed');
    process.exit(1);
  });
