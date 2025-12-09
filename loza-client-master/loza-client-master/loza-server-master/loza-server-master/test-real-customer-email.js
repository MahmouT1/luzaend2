import { sendOrderConfirmationEmail } from './services/email.service.js';

// Test with a real Gmail address (you can change this to any real email)
const customerEmail = 'mahmoudtarekmonaim@gmail.com'; // Change this to any real email

// Create a realistic test order object
const testOrder = {
  orderNumber: 12348,
  createdAt: new Date(),
  orderStatus: 'Processing',
  totalAmount: 850,
  pointsUsed: 50,
  pointsEarned: 80,
  orderItems: [
    {
      name: 'Elegant Blouse',
      quantity: 1,
      price: 400,
      size: 'L',
      coverImage: 'https://via.placeholder.com/100'
    },
    {
      name: 'Stylish Pants',
      quantity: 1,
      price: 450,
      size: 'M',
      coverImage: 'https://via.placeholder.com/100'
    }
  ],
  userInfo: {
    firstName: 'Customer',
    lastName: 'Name',
    email: customerEmail,
    phone: '01234567890',
    nickname: 'CustomerNick'
  },
  shippingAddress: '123 Customer Address, Cairo, Egypt'
};

console.log('🧪 Testing Order Confirmation Email to Real Customer Email...');
console.log('📧 Customer email:', customerEmail);
console.log('📦 Order number:', testOrder.orderNumber);
console.log('📧 From: mahmoudtarekrooa@gmail.com');
console.log('📧 To:', customerEmail);

// Test the order confirmation email
sendOrderConfirmationEmail(testOrder, customerEmail)
  .then(result => {
    console.log('\n📧 Order confirmation email result:');
    console.log('Success:', result.success);
    console.log('Message:', result.message);
    
    if (result.success) {
      console.log('✅ Order confirmation email sent successfully!');
      console.log(`📧 Email sent to: ${customerEmail}`);
      console.log('📧 Check the customer\'s email inbox for the order confirmation');
      console.log('📧 Also check Spam folder if not in inbox');
      console.log('📧 Look for subject: "🎉 Order Confirmation - Order #12348 - Loza\'s Culture"');
    } else {
      console.log('❌ Order confirmation email failed:', result.message);
    }
  })
  .catch(error => {
    console.error('❌ Error testing order confirmation email:', error);
  });
