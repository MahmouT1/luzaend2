import dotenv from 'dotenv';
import { sendOrderConfirmationEmail, testEmailService } from './services/email.service.js';
import { connectToMongoDB } from './utils/db/connectDB.js';
import { Order } from './models/order.model.js';

// Load environment variables
dotenv.config();

async function testEmail() {
  try {
    console.log('🔍 Testing Hostinger Email Configuration...\n');
    
    // Check environment variables
    console.log('📋 Environment Variables Check:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET ❌');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET ✅ (length: ' + process.env.EMAIL_PASS.length + ')' : 'NOT SET ❌');
    console.log('SMTP_HOST:', process.env.SMTP_HOST || 'smtp.hostinger.com (default)');
    console.log('SMTP_PORT:', process.env.SMTP_PORT || '465 (default)');
    console.log('');
    
    if (!process.env.EMAIL_PASS) {
      console.error('❌ ERROR: EMAIL_PASS is not set in your .env file!');
      console.log('');
      console.log('📝 Please add the following to your .env file:');
      console.log('EMAIL_USER=orders@luzasculture.org');
      console.log('EMAIL_PASS=your-hostinger-password-here');
      console.log('SMTP_HOST=smtp.hostinger.com');
      console.log('SMTP_PORT=465');
      process.exit(1);
    }
    
    // Test email service connection
    console.log('🔗 Testing SMTP connection...');
    const connectionTest = await testEmailService();
    
    if (!connectionTest) {
      console.error('❌ SMTP connection test failed!');
      process.exit(1);
    }
    
    console.log('');
    console.log('✅ SMTP connection test passed!');
    console.log('');
    
    // Connect to database to get a test order
    console.log('🔗 Connecting to database...');
    await connectToMongoDB();
    console.log('✅ Database connected!');
    console.log('');
    
    // Get the latest order
    const latestOrder = await Order.findOne().sort({ createdAt: -1 }).populate('invoiceId');
    
    if (!latestOrder) {
      console.log('⚠️ No orders found in database. Creating a test order...');
      console.log('');
      console.log('Please create an order first, or modify this script to use a test order.');
      process.exit(0);
    }
    
    console.log('📦 Found latest order:');
    console.log('   Order Number:', latestOrder.orderNumber);
    console.log('   Customer Email:', latestOrder.userInfo?.email || 'N/A');
    console.log('   Total Amount:', latestOrder.totalAmount, 'EGP');
    console.log('');
    
    if (!latestOrder.userInfo?.email) {
      console.error('❌ Order does not have a customer email address!');
      process.exit(1);
    }
    
    // Test sending email
    console.log('📧 Sending test email...');
    console.log('');
    
    const emailResult = await sendOrderConfirmationEmail(latestOrder, latestOrder.userInfo.email);
    
    if (emailResult.success) {
      console.log('');
      console.log('✅ SUCCESS! Email sent successfully!');
      console.log('📧 Message ID:', emailResult.messageId);
      console.log('📧 Email sent to:', latestOrder.userInfo.email);
      console.log('');
      console.log('🎉 Check your inbox (and spam folder) for the confirmation email!');
    } else {
      console.log('');
      console.error('❌ FAILED to send email!');
      console.error('Error:', emailResult.message);
      if (emailResult.error) {
        console.error('Details:', emailResult.error);
      }
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:');
    console.error(error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testEmail();

