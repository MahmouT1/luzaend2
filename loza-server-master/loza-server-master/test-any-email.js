import { sendOrderConfirmationEmail } from './services/email.service.js';

// Test with a different email address (you can change this to any email)
const testEmail = 'test@example.com'; // Change this to any email you want to test

// Create a realistic test order object
const testOrder = {
  orderNumber: 12347,
  createdAt: new Date(),
  orderStatus: 'Processing',
  totalAmount: 600,
  pointsUsed: 0,
  pointsEarned: 60,
  orderItems: [
    {
      name: 'Beautiful Dress',
      quantity: 1,
      price: 600,
      size: 'M',
      coverImage: 'https://via.placeholder.com/100'
    }
  ],
  userInfo: {
    firstName: 'Test',
    lastName: 'Customer',
    email: testEmail, // This will be the recipient email
    phone: '01234567890',
    nickname: 'TestCustomer'
  },
  shippingAddress: '789 Customer Street, Cairo, Egypt'
};

console.log('🧪 Testing Order Confirmation Email to Any Email Address...');
console.log('📧 Customer email:', testOrder.userInfo.email);
console.log('📦 Order number:', testOrder.orderNumber);
console.log('📧 From: mahmoudtarekrooa@gmail.com');
console.log('📧 To:', testEmail);

// Test the order confirmation email
sendOrderConfirmationEmail(testOrder, testOrder.userInfo.email)
  .then(result => {
    console.log('\n📧 Order confirmation email result:');
    console.log('Success:', result.success);
    console.log('Message:', result.message);
    
    if (result.success) {
      console.log('✅ Order confirmation email sent successfully!');
      console.log(`📧 Email sent to: ${testEmail}`);
      console.log('📧 Check the customer\'s email inbox for the order confirmation');
      console.log('📧 Also check Spam folder if not in inbox');
    } else {
      console.log('❌ Order confirmation email failed:', result.message);
    }
  })
  .catch(error => {
    console.error('❌ Error testing order confirmation email:', error);
  });
