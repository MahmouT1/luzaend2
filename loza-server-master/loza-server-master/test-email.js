import { testEmailService, sendOrderConfirmationEmail } from './services/email.service.js';

// Test email configuration
async function testEmail() {
  console.log('🧪 Testing email service configuration...');
  
  const isReady = await testEmailService();
  
  if (isReady) {
    console.log('✅ Email service is properly configured!');
    console.log('📧 You can now receive order confirmation emails.');
    console.log('');
    console.log('📝 To configure your email:');
    console.log('1. Set EMAIL_USER environment variable to your email');
    console.log('2. Set EMAIL_PASS environment variable to your app password');
    console.log('3. For Gmail: Enable 2FA and generate an app password');
  } else {
    console.log('❌ Email service configuration failed!');
    console.log('📝 Please check your email configuration:');
    console.log('1. Make sure EMAIL_USER and EMAIL_PASS are set');
    console.log('2. For Gmail: Use app password, not regular password');
    console.log('3. Check if 2FA is enabled on your email account');
  }
}

// Run the test
testEmail().catch(console.error);
