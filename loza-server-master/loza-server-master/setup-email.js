import readline from 'readline';
import { testEmailService } from './services/email.service.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('📧 Email Setup for Order Confirmations');
console.log('=====================================\n');

console.log('This will help you configure email sending for order confirmations.\n');

console.log('📝 Prerequisites:');
console.log('1. Gmail account with 2-Factor Authentication enabled');
console.log('2. App Password generated (not your regular password)');
console.log('3. If you don\'t have these, please set them up first.\n');

rl.question('Enter your Gmail address: ', (email) => {
  rl.question('Enter your Gmail App Password (16 characters): ', (password) => {
    console.log('\n🧪 Testing email configuration...');
    
    // Set environment variables for this test
    process.env.EMAIL_USER = email;
    process.env.EMAIL_PASS = password;
    
    testEmailService().then((success) => {
      if (success) {
        console.log('\n✅ SUCCESS! Email is properly configured!');
        console.log('\n📝 To make this permanent, set these environment variables:');
        console.log(`EMAIL_USER=${email}`);
        console.log(`EMAIL_PASS=${password}`);
        console.log('\n🎉 Order confirmation emails will now be sent automatically!');
      } else {
        console.log('\n❌ Email configuration failed!');
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure 2FA is enabled on your Gmail account');
        console.log('2. Use App Password, not your regular password');
        console.log('3. Check that the App Password is correct');
        console.log('4. Try generating a new App Password');
      }
      
      rl.close();
    }).catch((error) => {
      console.log('\n❌ Error testing email:', error.message);
      rl.close();
    });
  });
});

rl.on('close', () => {
  console.log('\n👋 Setup complete!');
  process.exit(0);
});
