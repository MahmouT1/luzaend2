import fetch from 'node-fetch';

async function testLogin() {
  try {
    const response = await fetch('http://localhost:8000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'johndoe@example.com',
        password: 'securepassword123'
      })
    });

    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const result = await response.text();
    console.log('Response:', result);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLogin();
