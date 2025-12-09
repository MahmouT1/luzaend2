const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test script to verify order creation updates user profile
async function testOrderUserUpdate() {
  try {
    console.log('Testing Order Creation -> User Profile Update Integration...\n');

    // First, let's login to get a token
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/users/login`, {
      email: 'test@example.com', // Replace with actual test user email
      password: 'password123'    // Replace with actual test user password
    }, {
      withCredentials: true
    });

    console.log('Login successful:', loginResponse.data.message);

    // Get user profile before order creation
    console.log('\n2. Getting user profile before order...');
    const profileBefore = await axios.get(`${BASE_URL}/users/profile`, {
      withCredentials: true
    });

    console.log('Profile before order:', {
      points: profileBefore.data.user.points,
      purchasedProductsCount: profileBefore.data.user.purchasedProductsCount,
      totalPurchases: profileBefore.data.user.totalPurchases
    });

    // Create a test order
    console.log('\n3. Creating test order...');
    const orderData = {
      userInfo: {
        firstName: "Test",
        lastName: "User",
        phone: "1234567890",
        email: "test@example.com",
        userId: profileBefore.data.user._id
      },
      shippingAddress: {
        address: "123 Test St",
        city: "Test City",
        postalCode: "12345",
        country: "Test Country",
        street: "Test Street",
        building: "Test Building",
        unitNumber: "Test Unit"
      },
      orderItems: [
        {
          id: "test-product-id",
          name: "Test Product",
          size: "M",
          quantity: 1,
          price: 29.99
        }
      ],
      paymentMethod: {
        status: "unpaid",
        type: "Cash On Delivery"
      },
      totalPrice: 29.99
    };

    const orderResponse = await axios.post(`${BASE_URL}/orders`, orderData, {
      withCredentials: true
    });

    console.log('Order created:', orderResponse.data.message);

    // Get user profile after order creation
    console.log('\n4. Getting user profile after order...');
    const profileAfter = await axios.get(`${BASE_URL}/users/profile`, {
      withCredentials: true
    });

    console.log('Profile after order:', {
      points: profileAfter.data.user.points,
      purchasedProductsCount: profileAfter.data.user.purchasedProductsCount,
      totalPurchases: profileAfter.data.user.totalPurchases
    });

    // Verify the update
    const pointsIncreased = profileAfter.data.user.points > profileBefore.data.user.points;
    const purchasesIncreased = profileAfter.data.user.purchasedProductsCount > profileBefore.data.user.purchasedProductsCount;

    console.log('\n5. Verification:');
    console.log('Points increased:', pointsIncreased);
    console.log('Purchases count increased:', purchasesIncreased);

    if (pointsIncreased && purchasesIncreased) {
      console.log('\n✅ SUCCESS: Order creation successfully updates user profile!');
    } else {
      console.log('\n❌ FAILED: Order creation did not properly update user profile');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testOrderUserUpdate();
