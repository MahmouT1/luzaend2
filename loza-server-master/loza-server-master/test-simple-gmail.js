import nodemailer from 'nodemailer';

console.log('🔍 Testing Gmail with App Password...');

// Test with your Gmail App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mahmoudtarekrooa@gmail.com',
    pass: 'sdfkiyxygrcweyjf' // Your App Password
  }
});

// Simple test email
const mailOptions = {
  from: 'mahmoudtarekrooa@gmail.com',
  to: 'mahmoudtarekrooa@gmail.com',
  subject: '🔧 Simple Gmail Test - ' + new Date().toLocaleString(),
  text: 'This is a simple text email to test Gmail delivery.',
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Simple Gmail Test</h2>
      <p>This is a test email sent at: ${new Date().toLocaleString()}</p>
      <p>If you receive this, Gmail is working correctly!</p>
    </div>
  `
};

console.log('📧 Testing Gmail connection...');

// Test connection first
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Gmail connection failed:');
    console.log('Error:', error.message);
    console.log('Code:', error.code);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Authentication Error - Possible Solutions:');
      console.log('1. Check if 2FA is enabled on your Gmail account');
      console.log('2. Verify the App Password is correct');
      console.log('3. Make sure you\'re using App Password, not regular password');
      console.log('4. Try generating a new App Password');
    }
  } else {
    console.log('✅ Gmail connection successful!');
    
    // Send the email
    console.log('📧 Sending test email...');
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('❌ Email sending failed:', error.message);
        console.log('Error code:', error.code);
      } else {
        console.log('✅ Email sent successfully!');
        console.log('📧 Message ID:', info.messageId);
        console.log('📧 Response:', info.response);
        console.log('\n📋 Check your Gmail:');
        console.log('1. Look for email with subject: "🔧 Simple Gmail Test"');
        console.log('2. Check Inbox, Spam, and all Gmail tabs');
        console.log('3. Wait 1-2 minutes for delivery');
      }
    });
  }
});
