import { connectToMongoDB } from './utils/db/connectDB.js';
import axios from 'axios';

async function loginAdmin() {
  try {
    console.log('Logging in as admin...\n');
    
    await connectToMongoDB();
    
    const response = await axios.post('http://localhost:8000/api/users/login', {
      email: 'admin@example.com',
      password: 'adminpassword'
    });
    
    console.log('✅ Login successful!');
    console.log(`- Token: ${response.data.token}`);
    
  } catch (error) {
    console.log('Error logging in:', error.message);
  }
}

// Run the function
loginAdmin();
