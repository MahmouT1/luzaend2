import axios from 'axios';
import * as https from 'https';

// Create axios instance that preserves cookies
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
});

// Test user profile endpoints
async function testUserProfile() {
  try {
    console.log('Testing User Profile Endpoints...\n');

    // First, let's login to get a token
    console.log('1. Logging in...');
    const loginResponse = await axiosInstance.post('/users/login', {
      email: 'johndoe@example.com',
      password: 'securepassword123'
    });

    console.log('Login successful:', loginResponse.data.message);

    // Test getting user profile
    console.log('\n2. Getting user profile...');
    const profileResponse = await axiosInstance.get('/users/profile');
    console.log('Profile data:', JSON.stringify(profileResponse.data, null, 2));

    // Test getting purchased products
    console.log('\n3. Getting purchased products...');
    const purchasesResponse = await axiosInstance.get('/users/purchased-products');
    console.log('Purchased products:', JSON.stringify(purchasesResponse.data, null, 2));

    // Test updating points
    console.log('\n4. Updating user points...');
    const pointsResponse = await axiosInstance.put('/users/update-points', {
      points: 100
    });
    console.log('Points update:', JSON.stringify(pointsResponse.data, null, 2));

    console.log('\n✅ All user profile tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

// Run the test
testUserProfile();
