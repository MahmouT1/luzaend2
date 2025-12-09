import { connectToMongoDB } from './utils/db/connectDB.js';
import { User } from './models/user.model.js';

async function fetchAdmin() {
  try {
    console.log('Fetching admin user...\n');
    
    await connectToMongoDB();
    
    const user = await User.findOne({ email: 'testadmin@example.com' });

    if (user) {
      console.log('✅ Admin user found:');
      console.log(`- Name: ${user.name}`);
      console.log(`- Email: ${user.email}`);
      console.log(`- Password (hashed): ${user.password}`);
    } else {
      console.log('No admin user found.');
    }
    
  } catch (error) {
    console.log('Error fetching admin:', error.message);
  }
}

// Run the function
fetchAdmin();
