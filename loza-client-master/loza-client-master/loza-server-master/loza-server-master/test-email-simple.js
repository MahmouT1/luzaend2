import 'dotenv/config';
import { sendOrderConfirmationEmail } from './services/email.service.js';

// Create a test order object
const testOrder = {
  orderNumber: 12345,
  createdAt: new Date(),
  orderStatus: 'Processing',
  totalAmount: 500,
  pointsUsed: 0,
  pointsEarned: 50,
  orderItems: [
    {
      name: 'Test Product',
      quantity: 1,
      price: 500,
      size: 'M',
      coverImage: 'https://via.placeholder.com/100'
    }
  ],
  userInfo: {
    firstName: 'Test',
    lastName: 'User',
    email: 'mahmoudtarekmonaim@gmail.com', // Valid email format
    phone: '01234567890'
  },
  shippingAddress: '123 Test Street, Cairo, Egypt'
};

console.log('🧪 Testing email service with valid email address...');
console.log('📧 Test email:', testOrder.userInfo.email);

// Test the email service
sendOrderConfirmationEmail(testOrder, testOrder.userInfo.email)
  .then(result => {
    console.log('📧 Email test result:', result);
    if (result.success) {
      console.log('✅ Email service is working correctly!');
    } else {
      console.log('❌ Email service failed:', result.message);
    }
  })
  .catch(error => {
    console.error('❌ Email test error:', error);
  });
