import nodemailer from 'nodemailer';

console.log('🔍 Testing Email Delivery with Different Settings...');

// Test with different Gmail settings
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mahmoudtarekrooa@gmail.com',
    pass: 'sdfkiyxygrcweyjf'
  },
  // Add additional options to improve delivery
  tls: {
    rejectUnauthorized: false
  }
});

// Create a very simple email
const mailOptions = {
  from: 'mahmoudtarekrooa@gmail.com',
  to: 'mahmoudtarekrooa@gmail.com',
  subject: 'Test Email Delivery - ' + new Date().toLocaleString(),
  text: 'This is a simple test email to check delivery.',
  html: '<p>This is a simple test email to check delivery.</p>'
};

console.log('📧 Sending simple test email...');

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('❌ Email sending failed:', error.message);
  } else {
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);
    console.log('\n📋 Please check your Gmail:');
    console.log('1. Look for email with subject: "Test Email Delivery"');
    console.log('2. Check Inbox, Spam, and all Gmail tabs');
    console.log('3. Wait 5-10 minutes for delivery');
    console.log('4. Search for: "Test Email Delivery"');
  }
});
