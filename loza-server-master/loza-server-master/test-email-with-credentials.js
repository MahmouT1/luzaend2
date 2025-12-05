import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

// Test credentials provided by user
const TEST_EMAIL = 'orders@luzasculture.org';
const TEST_PASSWORD = 'Memo.Ro2123';
const SMTP_HOST = 'smtp.hostinger.com';

async function testEmailWithCredentials() {
  console.log('🔍 Testing Email Connection with Provided Credentials...\n');
  console.log('📧 Email:', TEST_EMAIL);
  console.log('🔐 Password:', TEST_PASSWORD ? 'PROVIDED ✅' : 'NOT PROVIDED ❌');
  console.log('🌐 SMTP Host:', SMTP_HOST);
  console.log('');
  
  // Test configurations - according to Hostinger documentation
  const configurations = [
    {
      name: 'SSL (Port 465) - Recommended by Hostinger',
      port: 465,
      secure: true,
      description: 'Standard SSL connection'
    },
    {
      name: 'STARTTLS (Port 587) - Alternative if 465 fails',
      port: 587,
      secure: false,
      requireTLS: true,
      description: 'STARTTLS connection (recommended if SSL fails)'
    }
  ];
  
  for (const config of configurations) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🧪 Testing: ${config.name}`);
    console.log(`   Port: ${config.port}`);
    console.log(`   Description: ${config.description}`);
    console.log('='.repeat(60));
    
    try {
      const transporterConfig = {
        host: SMTP_HOST,
        port: config.port,
        secure: config.secure,
        auth: {
          user: TEST_EMAIL,
          pass: TEST_PASSWORD
        },
        tls: {
          rejectUnauthorized: false,
          minVersion: 'TLSv1.2'
        },
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
        debug: false,
        logger: false
      };
      
      if (config.requireTLS) {
        transporterConfig.requireTLS = true;
      }
      
      console.log('   ⏳ Creating transporter...');
      const transporter = nodemailer.createTransport(transporterConfig);
      
      console.log('   ⏳ Verifying SMTP connection...');
      await transporter.verify();
      console.log(`   ✅ ${config.name} - CONNECTION VERIFIED!`);
      
      // Try sending a test email
      console.log('   ⏳ Sending test email to yourself...');
      const testEmail = {
        from: `"LUZA'S CULTURE - Test" <${TEST_EMAIL}>`,
        to: TEST_EMAIL, // Send to yourself
        subject: `✅ Test Email - ${config.name} (Port ${config.port})`,
        text: `This is a test email sent using ${config.name} (Port ${config.port}).\n\nIf you receive this email, your SMTP connection is working correctly!\n\nConfiguration:\n- Host: ${SMTP_HOST}\n- Port: ${config.port}\n- Secure: ${config.secure}\n- Email: ${TEST_EMAIL}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #27ae60;">✅ Test Email - SMTP Connection Successful!</h2>
            <p>This is a test email sent using <strong>${config.name}</strong> (Port ${config.port}).</p>
            <p>If you receive this email, your SMTP connection is working correctly! 🎉</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Configuration Details:</h3>
              <ul>
                <li><strong>Host:</strong> ${SMTP_HOST}</li>
                <li><strong>Port:</strong> ${config.port}</li>
                <li><strong>Secure (SSL):</strong> ${config.secure}</li>
                <li><strong>Email:</strong> ${TEST_EMAIL}</li>
                <li><strong>Connection Type:</strong> ${config.name}</li>
              </ul>
            </div>
            
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              This is an automated test email from LUZA'S CULTURE email system.
            </p>
          </div>
        `
      };
      
      const result = await transporter.sendMail(testEmail);
      console.log(`   ✅ ${config.name} - EMAIL SENT SUCCESSFULLY!`);
      console.log(`   📧 Message ID: ${result.messageId}`);
      console.log(`   📬 Response: ${result.response}`);
      
      console.log(`\n🎉 SUCCESS! ${config.name} is working perfectly!`);
      console.log(`\n✅ Use this configuration in your .env file:`);
      console.log(`   EMAIL_USER=${TEST_EMAIL}`);
      console.log(`   EMAIL_PASS=${TEST_PASSWORD}`);
      console.log(`   SMTP_HOST=${SMTP_HOST}`);
      console.log(`   SMTP_PORT=${config.port}`);
      if (config.requireTLS) {
        console.log(`   SMTP_REQUIRE_TLS=true`);
      }
      console.log(`\n📧 Check your inbox (${TEST_EMAIL}) for the test email!`);
      console.log(`   (Also check spam folder if not found)`);
      
      return {
        success: true,
        config: config,
        messageId: result.messageId
      };
      
    } catch (error) {
      console.log(`   ❌ ${config.name} - FAILED`);
      console.log(`   Error: ${error.message}`);
      
      if (error.code) {
        console.log(`   Error Code: ${error.code}`);
      }
      
      if (error.responseCode) {
        console.log(`   Response Code: ${error.responseCode}`);
      }
      
      if (error.command) {
        console.log(`   Command: ${error.command}`);
      }
      
      if (error.response) {
        console.log(`   Server Response: ${error.response}`);
      }
      
      // Continue to next configuration
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('❌ All SMTP connection attempts failed!');
  console.log('='.repeat(60));
  console.log('\n💡 Troubleshooting tips:');
  console.log('1. ✅ Check that your password is correct: Memo.Ro2123');
  console.log('2. ✅ Verify your email account is active in Hostinger');
  console.log('3. ✅ Check if port 465 or 587 is blocked by firewall');
  console.log('4. ✅ Try accessing your email via Hostinger webmail');
  console.log('5. ✅ Contact Hostinger support if issue persists');
  console.log('\n📝 Make sure your .env file contains:');
  console.log('   EMAIL_USER=orders@luzasculture.org');
  console.log('   EMAIL_PASS=Memo.Ro2123');
  console.log('   SMTP_HOST=smtp.hostinger.com');
  console.log('   SMTP_PORT=465');
  
  process.exit(1);
}

testEmailWithCredentials().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});

