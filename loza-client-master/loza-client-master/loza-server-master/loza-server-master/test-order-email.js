import { sendOrderConfirmationEmail } from './services/email.service.js';

// Create a realistic test order object
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
    lastName: 'Customer',
    email: 'mahmoudtarekmonaim@gmail.com', // This is the email that should receive the order confirmation
    phone: '01234567890'
  },
  shippingAddress: '123 Test Street, Cairo, Egypt'
};

console.log('🧪 Testing Order Confirmation Email...');
console.log('📧 Customer email:', testOrder.userInfo.email);
console.log('📦 Order number:', testOrder.orderNumber);

// Test the order confirmation email
sendOrderConfirmationEmail(testOrder, testOrder.userInfo.email)
  .then(result => {
    console.log('\n📧 Order confirmation email result:');
    console.log('Success:', result.success);
    console.log('Message:', result.message);
    
    if (result.success) {
      console.log('✅ Order confirmation email sent successfully!');
      console.log('📧 Check the customer\'s Gmail inbox for the order confirmation');
      console.log('📧 Also check Spam folder if not in inbox');
    } else {
      console.log('❌ Order confirmation email failed:', result.message);
    }
  })
  .catch(error => {
    console.error('❌ Error testing order confirmation email:', error);
  });
