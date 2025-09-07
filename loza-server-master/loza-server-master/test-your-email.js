import { sendOrderConfirmationEmail } from './services/email.service.js';

// Test with your actual email address
const yourEmail = 'mahmoudtarekmonaim@gmail.com';

// Create a realistic test order object
const testOrder = {
  orderNumber: 12349,
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
    }
  ],
  userInfo: {
    firstName: 'Mahmoud',
    lastName: 'Tarek',
    email: yourEmail,
    phone: '01234567890',
    nickname: 'MahmoudT'
  },
  shippingAddress: '123 Your Address, Cairo, Egypt'
};

console.log('🧪 Testing Order Confirmation Email to Your Email...');
console.log('📧 Your email:', yourEmail);
console.log('📦 Order number:', testOrder.orderNumber);
console.log('📧 From: mahmoudtarekrooa@gmail.com');
console.log('📧 To:', yourEmail);

// Test the order confirmation email
sendOrderConfirmationEmail(testOrder, yourEmail)
  .then(result => {
    console.log('\n📧 Order confirmation email result:');
    console.log('Success:', result.success);
    console.log('Message:', result.message);
    
    if (result.success) {
      console.log('✅ Order confirmation email sent successfully!');
      console.log(`📧 Email sent to: ${yourEmail}`);
      console.log('\n📋 Please check your Gmail:');
      console.log('1. Look for email with subject: "🎉 Order Confirmation - Order #12349 - Loza\'s Culture"');
      console.log('2. Check ALL Gmail tabs: Primary, Promotions, Social, Updates');
      console.log('3. Check Spam folder');
      console.log('4. Search for: "Order Confirmation" or "mahmoudtarekrooa@gmail.com"');
      console.log('5. Wait 2-3 minutes for delivery');
    } else {
      console.log('❌ Order confirmation email failed:', result.message);
    }
  })
  .catch(error => {
    console.error('❌ Error testing order confirmation email:', error);
  });
