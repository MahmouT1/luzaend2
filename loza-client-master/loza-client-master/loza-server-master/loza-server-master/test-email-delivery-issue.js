import nodemailer from 'nodemailer';

console.log('🔍 Testing Email Delivery Issue...');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mahmoudtarekrooa@gmail.com',
    pass: 'sdfkiyxygrcweyjf'
  }
});

// Test 1: Send to your own email (should work)
console.log('\n📧 Test 1: Sending to mahmoudtarekrooa@gmail.com (sender email)');
const mailOptions1 = {
  from: 'mahmoudtarekrooa@gmail.com',
  to: 'mahmoudtarekrooa@gmail.com',
  subject: 'Test 1: Self Email - ' + new Date().toLocaleString(),
  text: 'This email is sent to the same address as the sender.',
  html: '<p>This email is sent to the same address as the sender.</p>'
};

transporter.sendMail(mailOptions1, (error, info) => {
  if (error) {
    console.log('❌ Test 1 failed:', error.message);
  } else {
    console.log('✅ Test 1 successful - Message ID:', info.messageId);
  }
});

// Test 2: Send to your target email (might be blocked)
console.log('\n📧 Test 2: Sending to mahmoudtarekmonaim@gmail.com (target email)');
const mailOptions2 = {
  from: 'mahmoudtarekrooa@gmail.com',
  to: 'mahmoudtarekmonaim@gmail.com',
  subject: 'Test 2: Target Email - ' + new Date().toLocaleString(),
  text: 'This email is sent to the target email address.',
  html: '<p>This email is sent to the target email address.</p>'
};

transporter.sendMail(mailOptions2, (error, info) => {
  if (error) {
    console.log('❌ Test 2 failed:', error.message);
    console.log('Error code:', error.code);
    if (error.code === 'EENVELOPE') {
      console.log('🔧 This might be a Gmail filtering issue');
    }
  } else {
    console.log('✅ Test 2 successful - Message ID:', info.messageId);
    console.log('📧 Email sent to mahmoudtarekmonaim@gmail.com');
    console.log('📧 Check that email address for delivery');
  }
});

// Test 3: Send to a different email to see if it's specific to that address
console.log('\n📧 Test 3: Sending to test@example.com (generic email)');
const mailOptions3 = {
  from: 'mahmoudtarekrooa@gmail.com',
  to: 'test@example.com',
  subject: 'Test 3: Generic Email - ' + new Date().toLocaleString(),
  text: 'This email is sent to a generic email address.',
  html: '<p>This email is sent to a generic email address.</p>'
};

transporter.sendMail(mailOptions3, (error, info) => {
  if (error) {
    console.log('❌ Test 3 failed:', error.message);
  } else {
    console.log('✅ Test 3 successful - Message ID:', info.messageId);
  }
});
