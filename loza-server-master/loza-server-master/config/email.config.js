// Email Configuration
export const emailConfig = {
  // Gmail configuration (you can change this to any email provider)
  service: 'gmail',
  user: process.env.EMAIL_USER || 'your-email@gmail.com',
  pass: process.env.EMAIL_PASS || 'your-app-password',
  
  // Alternative configurations for other providers:
  
  // For Outlook/Hotmail:
  // service: 'hotmail',
  // user: 'your-email@outlook.com',
  // pass: 'your-password',
  
  // For custom SMTP:
  // host: 'smtp.your-provider.com',
  // port: 587,
  // secure: false,
  // user: 'your-email@yourdomain.com',
  // pass: 'your-password',
  
  // For Yahoo:
  // service: 'yahoo',
  // user: 'your-email@yahoo.com',
  // pass: 'your-app-password',
};

// Instructions for setting up Gmail:
// 1. Enable 2-factor authentication on your Gmail account
// 2. Generate an "App Password" for this application
// 3. Use the app password (not your regular password) in EMAIL_PASS
// 4. Set EMAIL_USER to your Gmail address

export default emailConfig;
