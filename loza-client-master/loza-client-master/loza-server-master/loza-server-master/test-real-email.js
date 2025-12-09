import nodemailer from 'nodemailer';

// Create transporter with your Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mahmoudtarekrooa@gmail.com',
    pass: 'sdfkiyxygrcweyjf'
  }
});

// Test email
const mailOptions = {
  from: 'mahmoudtarekrooa@gmail.com',
  to: 'mahmoudtarekmonaim@gmail.com',
  subject: '🧪 Test Email from Loza Server',
  html: `
    <h1>Test Email</h1>
    <p>This is a test email to verify Gmail sending works.</p>
    <p>If you receive this, the email service is working correctly!</p>
    <p>Sent at: ${new Date().toLocaleString()}</p>
  `
};

console.log('🧪 Testing real Gmail email sending...');
console.log('📧 From: mahmoudtarekrooa@gmail.com');
console.log('📧 To: mahmoudtarekmonaim@gmail.com');

// Verify connection first
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Gmail connection error:', error);
  } else {
    console.log('✅ Gmail connection verified successfully');
    
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('❌ Email sending error:', error);
      } else {
        console.log('✅ Email sent successfully!');
        console.log('📧 Message ID:', info.messageId);
        console.log('📧 Response:', info.response);
        console.log('📧 Check your Gmail inbox for the test email!');
      }
    });
  }
});
