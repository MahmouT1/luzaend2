# 📧 Gmail App Password Setup Guide

## 🚨 Important: Gmail Requires App Password

Gmail no longer accepts regular passwords for third-party applications. You need to generate a special "App Password".

## 📋 Step-by-Step Instructions

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click "2-Step Verification"
3. Follow the setup process (you'll need your phone)

### Step 2: Generate App Password
1. Go back to [Google Account Security](https://myaccount.google.com/security)
2. Click "2-Step Verification" again
3. Scroll down to find "App passwords"
4. Click "App passwords"
5. Select "Mail" from the dropdown
6. Click "Generate"
7. **Copy the 16-character password** (example: `abcd efgh ijkl mnop`)

### Step 3: Use App Password
- **Don't use your regular Gmail password**
- **Use the 16-character App Password** (no spaces when entering)
- **The App Password looks like**: `abcdefghijklmnop` (16 characters, no spaces)

## 🔧 Alternative: Use a Different Email Provider

If you don't want to set up Gmail App Password, you can use:

### Outlook/Hotmail
1. Go to [Microsoft Account Security](https://account.microsoft.com/security)
2. Enable 2FA and generate App Password
3. Update the email service to use 'hotmail' instead of 'gmail'

### Yahoo
1. Go to Yahoo Account Security
2. Enable 2FA and generate App Password
3. Update the email service to use 'yahoo' instead of 'gmail'

## 🧪 Test Your Setup

After getting the App Password, run:
```bash
node gmail-app-password-setup.js
```

Enter your Gmail address and the 16-character App Password (not your regular password).

## ✅ Success Indicators

You'll know it's working when you see:
```
✅ Email configuration saved!
🎉 Automatic email sending is now configured!
```

## 🆘 Still Having Issues?

If you're still having trouble:
1. Make sure 2FA is enabled on your Gmail account
2. Use the App Password, not your regular password
3. Try generating a new App Password
4. Check that you copied the password correctly (16 characters, no spaces)
