import { sendOrderConfirmationEmail } from './services/email.service.js';

// Create a realistic test order object - sending to your own Gmail
const testOrder = {
  orderNumber: 12346,
  createdAt: new Date(),
  orderStatus: 'Processing',
  totalAmount: 750,
  pointsUsed: 25,
  pointsEarned: 75,
  orderItems: [
    {
      name: 'Beautiful T-Shirt',
      quantity: 2,
      price: 375,
      size: 'L',
      coverImage: 'https://via.placeholder.com/100'
    },
    {
      name: 'Elegant Dress',
      quantity: 1,
      price: 375,
      size: 'M',
      coverImage: 'https://via.placeholder.com/100'
    }
  ],
  userInfo: {
    firstName: 'Mahmoud',
    lastName: 'Tarek',
    email: 'mahmoudtarekrooa@gmail.com', // Send to your own Gmail
    phone: '01234567890',
    nickname: 'MahmoudT'
  },
  shippingAddress: '456 Main Street, Cairo, Egypt'
};

console.log('🧪 Testing Order Confirmation Email to Your Own Gmail...');
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
      console.log('📧 Check your Gmail inbox (mahmoudtarekrooa@gmail.com)');
      console.log('📧 Look for email with subject: "🎉 Order Confirmation - Order #12346 - Loza\'s Culture"');
      console.log('📧 Also check Spam folder if not in inbox');
    } else {
      console.log('❌ Order confirmation email failed:', result.message);
    }
  })
  .catch(error => {
    console.error('❌ Error testing order confirmation email:', error);
  });
