import fetch from 'node-fetch';

async function testRoutes() {
  const endpoints = [
    '/api/users/login',
    '/api/users/profile',
    '/api/users/purchased-products',
    '/api/users/update-points',
    '/api/users/me'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\nTesting: ${endpoint}`);
      
      let options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      };

      // For login endpoint, use POST with data
      if (endpoint === '/api/users/login') {
        options.method = 'POST';
        options.body = JSON.stringify({
          email: 'johndoe@example.com',
          password: 'securepassword123'
        });
      }

      const response = await fetch(`http://localhost:8000${endpoint}`, options);
      
      console.log(`Status: ${response.status}`);
      console.log(`Content-Type: ${response.headers.get('content-type')}`);
      
      if (response.status !== 404) {
        const data = await response.text();
        console.log(`Response: ${data.substring(0, 200)}...`);
      } else {
        console.log('Endpoint not found (404)');
      }
      
    } catch (error) {
      console.error(`Error testing ${endpoint}:`, error.message);
    }
  }
}

testRoutes();
