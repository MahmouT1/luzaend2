import 'dotenv/config';

console.log('🔍 Debugging Environment Variables:');
console.log('Current working directory:', process.cwd());
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'undefined');

// Check if the values match what we expect
const expectedUser = 'mahmoudtarekrooa@gmail.com';
const expectedPass = 'sdfkiyxygrcweyjf';

console.log('\n🔍 Comparison:');
console.log('EMAIL_USER matches expected:', process.env.EMAIL_USER === expectedUser);
console.log('EMAIL_PASS matches expected:', process.env.EMAIL_PASS === expectedPass);

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  console.log('✅ Environment variables are loaded!');
} else {
  console.log('❌ Environment variables are missing!');
}
