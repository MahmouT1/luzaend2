import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('📧 Simple Email Setup for Order Notifications');
console.log('=============================================\n');

console.log('This will send order confirmation emails to your device.');
console.log('You just need your Gmail address and password.\n');

rl.question('Enter your Gmail address (where you want to receive emails): ', (email) => {
  rl.question('Enter your Gmail password: ', (password) => {
    console.log('\n📝 Creating email configuration...');
    
    // Create a simple .env file
    const envContent = `EMAIL_USER=${email}
EMAIL_PASS=${password}
MONGODB_URI=mongodb://localhost:27017/loza-culture
JWT_SECRET=development-secret-key
PORT=8000`;

    import('fs').then(fs => {
      fs.writeFileSync('.env', envContent);
      console.log('✅ Email configuration saved!');
      console.log('\n📧 Your email settings:');
      console.log('Email: ' + email);
      console.log('Password: ' + password);
      console.log('\n🎉 Order confirmation emails will now be sent to: ' + email);
      console.log('\n📝 Note: If you get authentication errors, you may need to:');
      console.log('1. Enable "Less secure app access" in your Gmail settings');
      console.log('2. Or use an App Password instead of your regular password');
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
