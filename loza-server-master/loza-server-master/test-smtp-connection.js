import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

async function testSMTPConnection() {
  console.log('🔍 Testing SMTP Connection to Hostinger...\n');
  
  const emailUser = process.env.EMAIL_USER || 'orders@luzasculture.org';
  const emailPass = process.env.EMAIL_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');
  
  console.log('📋 Configuration:');
  console.log('   EMAIL_USER:', emailUser);
  console.log('   EMAIL_PASS:', emailPass ? 'SET ✅ (length: ' + emailPass.length + ')' : 'NOT SET ❌');
  console.log('   SMTP_HOST:', smtpHost);
  console.log('   SMTP_PORT:', smtpPort);
  console.log('');
  
  if (!emailPass) {
    console.error('❌ ERROR: EMAIL_PASS is not set!');
    console.log('\n📝 Please add to your .env file:');
    console.log('EMAIL_PASS=your-password-here');
    process.exit(1);
  }
  
  // Test multiple configurations
  const configurations = [
    {
      name: 'TLS (Port 587)',
      port: 587,
      secure: false,
      description: 'Recommended for most cases'
    },
    {
      name: 'SSL (Port 465)',
      port: 465,
      secure: true,
      description: 'Alternative option'
    },
    {
      name: 'Custom Port',
      port: smtpPort,
      secure: smtpPort === 465,
      description: 'Your configured port'
    }
  ];
  
  for (const config of configurations) {
    console.log(`\n🧪 Testing ${config.name} (Port ${config.port})...`);
    console.log(`   Description: ${config.description}`);
    
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: config.port,
        secure: config.secure,
        auth: {
          user: emailUser,
          pass: emailPass
        },
        tls: {
          rejectUnauthorized: false,
          minVersion: 'TLSv1.2'
        },
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
        debug: false, // Disable debug for cleaner output
        logger: false
      });
      
      console.log('   ⏳ Verifying connection...');
      await transporter.verify();
      console.log(`   ✅ ${config.name} - CONNECTION SUCCESSFUL!`);
      
      // Try sending a test email
      console.log('   ⏳ Sending test email...');
      const testEmail = {
        from: `"LUZA\'S CULTURE Test" <${emailUser}>`,
        to: emailUser, // Send to yourself
        subject: 'Test Email - SMTP Connection',
        text: `This is a test email sent using ${config.name} (Port ${config.port}).\n\nIf you receive this, your SMTP connection is working correctly!`,
        html: `
          <h2>Test Email - SMTP Connection</h2>
          <p>This is a test email sent using <strong>${config.name}</strong> (Port ${config.port}).</p>
          <p>If you receive this, your SMTP connection is working correctly! ✅</p>
        `
      };
      
      const result = await transporter.sendMail(testEmail);
      console.log(`   ✅ ${config.name} - EMAIL SENT SUCCESSFULLY!`);
      console.log(`   📧 Message ID: ${result.messageId}`);
      console.log(`\n🎉 ${config.name} is working! Use this configuration:`);
      console.log(`   SMTP_PORT=${config.port}`);
      if (config.secure) {
        console.log(`   SMTP_USE_SSL=true`);
      }
      
      return; // Exit on first successful connection
      
    } catch (error) {
      console.log(`   ❌ ${config.name} - FAILED`);
      console.log(`   Error: ${error.message}`);
      
      if (error.code) {
        console.log(`   Error Code: ${error.code}`);
      }
      
      if (error.response) {
        console.log(`   Server Response: ${error.response}`);
      }
      
      // Continue to next configuration
    }
  }
  
  console.log('\n❌ All SMTP connection attempts failed!');
  console.log('\n💡 Troubleshooting tips:');
  console.log('1. Check your EMAIL_PASS is correct');
  console.log('2. Verify your email account is active in Hostinger');
  console.log('3. Check if port 587 or 465 is blocked by firewall');
  console.log('4. Try accessing your email via webmail to confirm it works');
  console.log('5. Contact Hostinger support if issue persists');
  
  process.exit(1);
}

testSMTPConnection();

