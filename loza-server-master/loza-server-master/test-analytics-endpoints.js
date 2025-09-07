import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
const AUTH_TOKEN = 'your-auth-token-here'; // You'll need to get this from a logged-in session

async function testAnalyticsEndpoints() {
  try {
    console.log('Testing Analytics Endpoints...\n');

    // Test 1: Get Analytics Overview
    console.log('1. Testing GET /analytics/overview');
    try {
      const overviewResponse = await axios.get(`${BASE_URL}/analytics/overview`, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log('✅ Success:', overviewResponse.data);
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }

    // Test 2: Get Sales Trend
    console.log('\n2. Testing GET /analytics/sales-trend?period=7d');
    try {
      const salesResponse = await axios.get(`${BASE_URL}/analytics/sales-trend?period=7d`, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log('✅ Success:', salesResponse.data);
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }

    // Test 3: Get Top Products
    console.log('\n3. Testing GET /analytics/top-products?limit=5');
    try {
      const productsResponse = await axios.get(`${BASE_URL}/analytics/top-products?limit=5`, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log('✅ Success:', productsResponse.data);
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }

  } catch (error) {
    console.log('Unexpected error:', error);
  }
}

// Run the tests
testAnalyticsEndpoints();
