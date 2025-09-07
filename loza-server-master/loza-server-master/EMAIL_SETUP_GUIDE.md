# 📧 Email Setup Guide for Order Confirmations

## 🚀 Quick Setup (Choose One Option)

### Option 1: Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
   - Copy the 16-character password

3. **Set Environment Variables**:
   ```bash
   # Windows PowerShell
   $env:EMAIL_USER="your-email@gmail.com"
   $env:EMAIL_PASS="your-16-character-app-password"
   
   # Or create a .env file in the server directory
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ```

### Option 2: Outlook/Hotmail Setup

1. **Enable 2-Factor Authentication** on your Outlook account
2. **Generate App Password**:
   - Go to [Microsoft Account Security](https://account.microsoft.com/security)
   - Advanced security options → App passwords
   - Generate new app password

3. **Update Email Service** (in `services/email.service.js`):
   ```javascript
   service: 'hotmail',
   ```

### Option 3: Yahoo Setup

1. **Enable 2-Factor Authentication** on your Yahoo account
2. **Generate App Password**:
   - Go to Yahoo Account Security
   - Generate and manage app passwords

3. **Update Email Service** (in `services/email.service.js`):
   ```javascript
   service: 'yahoo',
   ```

## 🧪 Test Your Setup

Run the test script to verify your email configuration:
```bash
node test-email.js
```

You should see:
```
✅ Email service is properly configured!
📧 You can now receive order confirmation emails.
```

## 🔧 Troubleshooting

### Common Issues:

1. **"Username and Password not accepted"**
   - Make sure you're using an App Password, not your regular password
   - Ensure 2FA is enabled on your email account

2. **"Less secure app access"**
   - Gmail no longer supports less secure apps
   - Use App Passwords instead

3. **"Connection timeout"**
   - Check your internet connection
   - Verify email service settings

## 📝 Environment Variables

Create a `.env` file in the server directory:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
MONGODB_URI=mongodb://localhost:27017/loza-culture
JWT_SECRET=your-jwt-secret
PORT=8000
```

## 🎯 What Happens After Setup

Once configured, every order will automatically send:
- ✅ Beautiful HTML confirmation email
- ✅ Order details with product images
- ✅ Congratulations message
- ✅ Shipping information
- ✅ Points earned (if applicable)

## 🆘 Need Help?

If you're having trouble setting up email:
1. Check the error messages in the console
2. Verify your email credentials
3. Make sure 2FA is enabled
4. Use App Passwords, not regular passwords
