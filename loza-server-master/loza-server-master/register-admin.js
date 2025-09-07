import { connectToMongoDB } from './utils/db/connectDB.js';
import { User } from './models/user.model.js';
import bcrypt from 'bcrypt';

async function registerAdmin() {
  try {
    console.log('Registering admin user...\n');
    
    await connectToMongoDB();
    
    const email = 'testadmin@example.com';
    const password = 'password123';
    const name = 'Test Admin';

    const userExist = await User.findOne({ email });

    if (userExist) {
      console.log('User already exists. Updating password...\n');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      userExist.password = hashedPassword;
      await userExist.save();
      console.log('✅ Admin user password updated successfully!');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log('✅ Admin user registered successfully!');
    
  } catch (error) {
    console.log('Error registering admin:', error.message);
  }
}

// Run the function
registerAdmin();
