 import { connectToMongoDB } from './utils/db/connectDB.js';
import { User } from './models/user.model.js';
import bcrypt from 'bcrypt';

async function loginAdmin() {
  try {
    console.log('Logging in as admin...\n');
    
    await connectToMongoDB();
    
    const email = 'testadmin@example.com';
    const password = 'password123';

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.password) {
      console.log('❌ Invalid email or password');
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      console.log('❌ Invalid email or password');
      return;
    }

    console.log('✅ Login successful!');
    console.log('User object:', user); // Log the user object for debugging
    
  } catch (error) {
    console.log('Error logging in:', error.message);
  }
}

// Run the function
loginAdmin();
