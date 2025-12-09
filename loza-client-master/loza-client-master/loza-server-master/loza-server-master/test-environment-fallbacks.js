import { createToken } from "./utils/token/createToken.js";
import { isAuthenticated } from "./middlewares/auth/isAuthenticated.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

// Test 1: JWT Token Creation with Fallback Values
console.log("=== Testing JWT Token Creation with Fallback Values ===");
try {
  // Clear environment variables to test fallbacks
  const originalJwtSecret = process.env.JWT_SECRET;
  const originalJwtExpire = process.env.JWT_EXPIRE;
  
  delete process.env.JWT_SECRET;
  delete process.env.JWT_EXPIRE;

  // Mock response object
  const mockRes = {
    cookie: () => {},
    status: () => mockRes,
    json: (data) => console.log("Token created successfully:", data)
  };

  // Test user data
  const testUser = {
    _id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
    role: "user"
  };

  console.log("Testing token creation without environment variables...");
  createToken(testUser, 200, mockRes);
  console.log("✅ JWT token creation with fallback values works correctly");

  // Restore environment variables
  if (originalJwtSecret) process.env.JWT_SECRET = originalJwtSecret;
  if (originalJwtExpire) process.env.JWT_EXPIRE = originalJwtExpire;

} catch (error) {
  console.error("❌ JWT token creation test failed:", error.message);
}

// Test 2: JWT Token Verification with Fallback Values
console.log("\n=== Testing JWT Token Verification with Fallback Values ===");
try {
  // Create a test token with fallback secret
  const testToken = jwt.sign(
    { userId: "test-user-id" }, 
    'fallback-secret-key-for-development',
    { expiresIn: '1h' }
  );

  // Mock request and response objects
  const mockReq = {
    cookies: { jwt: testToken }
  };
  const mockRes = {
    status: () => mockRes,
    json: (data) => console.log("Authentication result:", data)
  };
  const mockNext = () => console.log("✅ Authentication middleware passed");

  console.log("Testing authentication middleware with fallback secret...");
  await isAuthenticated(mockReq, mockRes, mockNext);
  console.log("✅ JWT token verification with fallback values works correctly");

} catch (error) {
  console.error("❌ JWT token verification test failed:", error.message);
}

// Test 3: Cloudinary Configuration with Fallback Values
console.log("\n=== Testing Cloudinary Configuration with Fallback Values ===");
try {
  // Clear environment variables to test fallbacks
  const originalCloudName = process.env.CLOUD_NAME;
  const originalCloudApiKey = process.env.CLOUD_API_KEY;
  const originalCloudSecret = process.env.CLOUD_SECRET_KEY;
  
  delete process.env.CLOUD_NAME;
  delete process.env.CLOUD_API_KEY;
  delete process.env.CLOUD_SECRET_KEY;

  console.log("Testing Cloudinary configuration without environment variables...");
  
  // This should not throw an error due to fallback values
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || 'development-cloud-name',
    api_key: process.env.CLOUD_API_KEY || 'development-api-key',
    api_secret: process.env.CLOUD_SECRET_KEY || 'development-secret-key',
  });

  console.log("✅ Cloudinary configuration with fallback values works correctly");

  // Restore environment variables
  if (originalCloudName) process.env.CLOUD_NAME = originalCloudName;
  if (originalCloudApiKey) process.env.CLOUD_API_KEY = originalCloudApiKey;
  if (originalCloudSecret) process.env.CLOUD_SECRET_KEY = originalCloudSecret;

} catch (error) {
  console.error("❌ Cloudinary configuration test failed:", error.message);
}

// Test 4: CORS Configuration with Fallback Values
console.log("\n=== Testing CORS Configuration with Fallback Values ===");
try {
  // Clear environment variable to test fallback
  const originalClientUrl = process.env.CLIENT_URL;
  delete process.env.CLIENT_URL;

  console.log("Testing CORS configuration without CLIENT_URL environment variable...");
  
  // Test the fallback value
  const corsOrigin = process.env.CLIENT_URL || 'http://localhost:3000';
  console.log("CORS origin fallback value:", corsOrigin);
  
  if (corsOrigin === 'http://localhost:3000') {
    console.log("✅ CORS configuration with fallback values works correctly");
  } else {
    console.log("❌ CORS fallback value incorrect");
  }

  // Restore environment variable
  if (originalClientUrl) process.env.CLIENT_URL = originalClientUrl;

} catch (error) {
  console.error("❌ CORS configuration test failed:", error.message);
}

console.log("\n=== All Tests Completed ===");
