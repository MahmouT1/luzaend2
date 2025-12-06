#!/usr/bin/env node

/**
 * 🔧 Email Service Test Script for Server
 * 
 * This script tests the email service configuration on the server
 * Usage: node test-email-service.js
 */

import 'dotenv/config';
import nodemailer from 'nodemailer';

console.log('╔═══════════════════════════════════════════════════════╗');
console.log('║  🧪 EMAIL SERVICE TEST - LUZA\'S CULTURE            ║');
console.log('╚═══════════════════════════════════════════════════════╝');
console.log('');

// Check environment variables
console.log('📋 Checking Environment Variables:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const emailUser = process.env.EMAIL_USER || 'orders@luzasculture.org';
const emailPass = process.env.EMAIL_PASS;
const smtpHost = process.env.SMTP_HOST || 'smtp.hostinger.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '465');

console.log('✅ EMAIL_USER:', emailUser);
console.log(emailPass ? `✅ EMAIL_PASS: SET (length: ${emailPass.length})` : '❌ EMAIL_PASS: NOT SET');
console.log('✅ SMTP_HOST:', smtpHost);
console.log('✅ SMTP_PORT:', smtpPort);
console.log('');

// Validate configuration
if (!emailPass) {
  console.error('❌ ERROR: EMAIL_PASS is not set!');
  console.error('');
  console.log('📝 To fix this, create/update .env file:');
  console.log('   cd /var/www/luzasculture/loza-server-master/loza-server-master');
  console.log('   nano .env');
  console.log('');
  console.log('📝 Add the following:');
  console.log('   EMAIL_USER=orders@luzasculture.org');
  console.log('   EMAIL_PASS=Memo.Ro2123');
  console.log('   SMTP_HOST=smtp.hostinger.com');
  console.log('   SMTP_PORT=465');
  process.exit(1);
}

// Create transporter
console.log('🔧 Creating SMTP Transporter...');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const useSSL = smtpPort === 465;
const useSTARTTLS = smtpPort === 587;

const transporterConfig = {
  host: smtpHost,
  port: smtpPort,
  secure: useSSL,
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
  debug: true,
  logger: true
};

console.log('   Host:', transporterConfig.host);
console.log('   Port:', transporterConfig.port);
console.log('   Secure (SSL):', transporterConfig.secure);
console.log('   Connection Type:', useSSL ? 'SSL (Port 465)' : useSTARTTLS ? 'STARTTLS (Port 587)' : 'Custom');
console.log('');

const transporter = nodemailer.createTransport(transporterConfig);

// Test connection
console.log('🔌 Testing SMTP Connection...');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

try {
  await transporter.verify();
  console.log('✅ SMTP Connection Verified!');
  console.log('');
  
  // Test sending email
  console.log('📤 Testing Email Send...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const testEmail = {
    from: `"LUZA'S CULTURE" <${emailUser}>`,
    to: emailUser, // Send to self for testing
    subject: '🧪 Test Email from Server - Email Service Working!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #000000; color: #ffffff; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f5f5f5; }
          .success { background-color: #4CAF50; color: white; padding: 10px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>LUZA'S CULTURE</h1>
          </div>
          <div class="content">
            <div class="success">
              ✅ Email Service is Working!
            </div>
            <p>This is a test email sent from the server.</p>
            <p><strong>If you receive this email, your email system is configured correctly!</strong></p>
            <hr>
            <p><small>Server: ${process.env.HOSTNAME || 'Production Server'}</small></p>
            <p><small>Time: ${new Date().toLocaleString()}</small></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Email Service Test - LUZA'S CULTURE
      
      ✅ Email Service is Working!
      
      This is a test email sent from the server.
      If you receive this email, your email system is configured correctly!
      
      Server: ${process.env.HOSTNAME || 'Production Server'}
      Time: ${new Date().toLocaleString()}
    `
  };
  
  const info = await transporter.sendMail(testEmail);
  
  console.log('✅ Email Sent Successfully!');
  console.log('   Message ID:', info.messageId);
  console.log('   Sent to:', testEmail.to);
  console.log('');
  
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║  ✅ EMAIL SERVICE TEST PASSED!                       ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('');
  console.log('📧 Check your inbox:', emailUser);
  console.log('📧 You should receive a test email shortly.');
  console.log('');
  console.log('🎉 Email system is working correctly on the server!');
  
  process.exit(0);
  
} catch (error) {
  console.error('❌ ERROR:', error.message);
  console.error('');
  console.error('Error details:');
  console.error('   Code:', error.code);
  console.error('   Command:', error.command);
  console.error('   Response:', error.response);
  console.error('');
  console.log('🔍 Troubleshooting:');
  console.log('   1. Check .env file exists and contains EMAIL_PASS');
  console.log('   2. Verify EMAIL_PASS is correct');
  console.log('   3. Check firewall allows SMTP connection');
  console.log('   4. Try different SMTP_PORT (465 or 587)');
  console.log('');
  console.log('📝 To check .env file:');
  console.log('   cat /var/www/luzasculture/loza-server-master/loza-server-master/.env');
  
  process.exit(1);
}

