import 'dotenv/config';

console.log('🧪 Testing Environment Variables:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT);

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  console.log('✅ Environment variables are loaded correctly!');
} else {
  console.log('❌ Environment variables are missing!');
}
