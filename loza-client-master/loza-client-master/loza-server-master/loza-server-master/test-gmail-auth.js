import nodemailer from 'nodemailer';

console.log('🔍 Testing Gmail Authentication...');

// Test with your credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mahmoudtarekrooa@gmail.com',
    pass: 'sdfkiyxygrcweyjf'
  }
});

console.log('📧 Testing Gmail connection...');

// Test connection
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Gmail Authentication Failed:');
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
    console.log('Error response:', error.response);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Authentication Error Solutions:');
      console.log('1. Check if 2FA is enabled on your Gmail account');
      console.log('2. Verify the App Password is correct');
      console.log('3. Make sure you\'re using App Password, not regular password');
      console.log('4. Check if "Less secure app access" is enabled (if 2FA is off)');
    }
  } else {
    console.log('✅ Gmail Authentication Successful!');
    console.log('📧 Connection verified with Gmail servers');
    
    // Try sending a simple email
    const mailOptions = {
      from: 'mahmoudtarekrooa@gmail.com',
      to: 'mahmoudtarekmonaim@gmail.com',
      subject: '🔧 Gmail Test - ' + new Date().toLocaleString(),
      text: 'This is a simple text email to test Gmail delivery.',
      html: '<h2>Gmail Test Email</h2><p>This is a test email sent at: ' + new Date().toLocaleString() + '</p>'
    };
    
    console.log('\n📧 Sending test email...');
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('❌ Email sending failed:', error.message);
      } else {
        console.log('✅ Email sent successfully!');
        console.log('📧 Message ID:', info.messageId);
        console.log('📧 Response:', info.response);
        console.log('📧 Check Gmail inbox in 1-2 minutes');
        console.log('📧 Also check Spam folder if not in inbox');
      }
    });
  }
});
