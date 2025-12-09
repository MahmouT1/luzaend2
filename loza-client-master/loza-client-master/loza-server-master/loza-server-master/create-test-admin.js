import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from './models/user.model.js';

const createAdminUser = async () => {
  try {
    await mongoose.connect("mongodb+srv://gamal:i88awp74CwLhGY3w@cluster0.uz3sd8m.mongodb.net/");

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin);
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('adminpassword', salt);

    const adminUser = new User({
      name: 'Test Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully:', {
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      _id: adminUser._id
    });
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

createAdminUser();
