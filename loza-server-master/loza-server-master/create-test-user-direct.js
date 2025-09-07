const BASE_URL = 'http://localhost:8000/api';

async function createTestUser() {
  const testUserData = {
    name: "Test User",
    email: "testuser@example.com",
    password: "password123",
    phone: "123-456-7890"
  };

  try {
    console.log('Creating test user directly...');
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUserData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Test user created successfully:', result);
    } else {
      console.log('❌ Test user creation failed:', response.status);
      const error = await response.text();
      console.log('Error details:', error);
    }
  } catch (error) {
    console.error('❌ Test user creation failed:', error.message);
  }
}

// Run the test user creation
createTestUser();
