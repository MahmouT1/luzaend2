import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('📧 Gmail App Password Setup for Automatic Email Sending');
console.log('======================================================\n');

console.log('To send emails automatically, you need a Gmail App Password.');
console.log('This is different from your regular Gmail password.\n');

console.log('📝 Step-by-Step Instructions:');
console.log('1. Go to: https://myaccount.google.com/security');
console.log('2. Click "2-Step Verification" (enable it if not already enabled)');
console.log('3. Scroll down to "App passwords"');
console.log('4. Click "App passwords"');
console.log('5. Select "Mail" from the dropdown');
console.log('6. Click "Generate"');
console.log('7. Copy the 16-character password (like: abcd efgh ijkl mnop)');
console.log('8. Come back here and enter it\n');

rl.question('Enter your Gmail address: ', (email) => {
  rl.question('Enter your Gmail App Password (16 characters): ', (appPassword) => {
    console.log('\n📝 Creating email configuration...');
    
    // Create a simple .env file
    const envContent = `EMAIL_USER=${email}
EMAIL_PASS=${appPassword}
MONGODB_URI=mongodb://localhost:27017/loza-culture
JWT_SECRET=development-secret-key
PORT=8000`;

    import('fs').then(fs => {
      fs.writeFileSync('.env', envContent);
      console.log('✅ Email configuration saved!');
      console.log('\n📧 Your email settings:');
      console.log('Email: ' + email);
      console.log('App Password: ' + appPassword);
      console.log('\n🎉 Automatic email sending is now configured!');
      console.log('📧 Order confirmation emails will be sent automatically to customers!');
      console.log('\n🔄 Restart your server to apply the changes!');
      
      rl.close();
    }).catch(error => {
      console.error('❌ Error saving configuration:', error);
      rl.close();
    });
  });
});

rl.on('close', () => {
  console.log('\n👋 Setup complete!');
  process.exit(0);
});
