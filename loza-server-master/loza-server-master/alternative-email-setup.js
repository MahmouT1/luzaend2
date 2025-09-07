import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('📧 Alternative Email Setup (No Gmail App Password Required)');
console.log('========================================================\n');

console.log('Since Gmail App Password can be complex, here are alternatives:\n');

console.log('Option 1: Use Outlook/Hotmail (Easier)');
console.log('1. Go to: https://account.microsoft.com/security');
console.log('2. Enable 2FA and generate App Password');
console.log('3. Use your Outlook email and App Password\n');

console.log('Option 2: Use Yahoo (Easier)');
console.log('1. Go to Yahoo Account Security');
console.log('2. Enable 2FA and generate App Password');
console.log('3. Use your Yahoo email and App Password\n');

console.log('Option 3: Use Gmail with App Password');
console.log('1. Follow the Gmail App Password guide');
console.log('2. Generate 16-character App Password');
console.log('3. Use your Gmail and App Password\n');

rl.question('Which option do you want to use? (1=Outlook, 2=Yahoo, 3=Gmail): ', (option) => {
  rl.question('Enter your email address: ', (email) => {
    rl.question('Enter your App Password (16 characters): ', (password) => {
      console.log('\n📝 Creating email configuration...');
      
      let service = 'gmail';
      if (option === '1') {
        service = 'hotmail';
        console.log('📧 Using Outlook/Hotmail service');
      } else if (option === '2') {
        service = 'yahoo';
        console.log('📧 Using Yahoo service');
      } else {
        service = 'gmail';
        console.log('📧 Using Gmail service');
      }
      
      // Create a simple .env file
      const envContent = `EMAIL_USER=${email}
EMAIL_PASS=${password}
EMAIL_SERVICE=${service}
MONGODB_URI=mongodb://localhost:27017/loza-culture
JWT_SECRET=development-secret-key
PORT=8000`;

      import('fs').then(fs => {
        fs.writeFileSync('.env', envContent);
        console.log('✅ Email configuration saved!');
        console.log('\n📧 Your email settings:');
        console.log('Email: ' + email);
        console.log('Service: ' + service);
        console.log('App Password: ' + password);
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
});

rl.on('close', () => {
  console.log('\n👋 Setup complete!');
  process.exit(0);
});
