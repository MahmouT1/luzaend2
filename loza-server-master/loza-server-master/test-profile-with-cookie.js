import fetch from 'node-fetch';

async function testProfile() {
  try {
    // First login to get the cookie
    console.log('Logging in...');
    const loginResponse = await fetch('http://localhost:8000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'johndoe@example.com',
        password: 'securepassword123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login successful');

    // Get the cookie from the response headers
    const cookie = loginResponse.headers.get('set-cookie');
    console.log('Cookie:', cookie);

    // Now test the profile endpoint with the cookie
    console.log('\nTesting profile endpoint...');
    const profileResponse = await fetch('http://localhost:8000/api/users/profile', {
      method: 'GET',
      headers: {
        'Cookie': cookie
      }
    });

    console.log('Profile Status:', profileResponse.status);
    console.log('Profile Headers:', Object.fromEntries(profileResponse.headers.entries()));
    
    const profileData = await profileResponse.text();
    console.log('Profile Response:', profileData);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testProfile();
