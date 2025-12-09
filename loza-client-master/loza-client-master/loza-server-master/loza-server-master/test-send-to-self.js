import nodemailer from 'nodemailer';

console.log('🔍 Testing email to your own Gmail account...');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mahmoudtarekrooa@gmail.com',
    pass: 'sdfkiyxygrcweyjf'
  }
});

// Send to your own Gmail account
const mailOptions = {
  from: 'mahmoudtarekrooa@gmail.com',
  to: 'mahmoudtarekrooa@gmail.com', // Send to yourself
  subject: '🧪 Self Test - Loza Server Email',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">🧪 Email Test</h1>
      <p>This is a test email sent from your Loza server to your own Gmail account.</p>
      <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>From:</strong> mahmoudtarekrooa@gmail.com</p>
      <p><strong>To:</strong> mahmoudtarekrooa@gmail.com</p>
      <hr>
      <p style="color: #666; font-size: 14px;">
        If you receive this email, the email service is working correctly!
      </p>
    </div>
  `
};

console.log('📧 Sending email to your own Gmail account...');
console.log('📧 From: mahmoudtarekrooa@gmail.com');
console.log('📧 To: mahmoudtarekrooa@gmail.com');

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('❌ Email sending failed:', error.message);
  } else {
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);
    console.log('\n📋 Next Steps:');
    console.log('1. Check your Gmail inbox (mahmoudtarekrooa@gmail.com)');
    console.log('2. Look in Spam folder if not in inbox');
    console.log('3. Search for "Self Test - Loza Server Email"');
    console.log('4. Wait 1-2 minutes for delivery');
  }
});
