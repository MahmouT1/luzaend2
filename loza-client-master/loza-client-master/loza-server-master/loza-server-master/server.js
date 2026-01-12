// PACKAGES IMPORT
import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

// CONFIG
// Use fallback values for development if environment variables are not set
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || 'development-cloud-name',
  api_key: process.env.CLOUD_API_KEY || process.env.CLOUDINARY_API_KEY || 'development-api-key',
  api_secret: process.env.CLOUD_SECRET_KEY || process.env.CLOUDINARY_API_SECRET || 'development-secret-key',
});

// FILES IMPORT
import { connectToMongoDB } from "./utils/db/connectDB.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import orderRoutes from "./routes/order.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { checkAndUnlockProducts } from "./utils/autoUnlockProducts.js";

// DEFINING VARIABLES
const app = express();
const port = process.env.PORT || 8000;

// MIDDLEWARES
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// Add request logging middleware (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}
// CORS configuration - allow both main domain and admin subdomain
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  process.env.ADMIN_URL || 'http://localhost:3000',
  'https://luzasculture.org',
  'https://www.luzasculture.org',
  'https://admin.luzasculture.org',
  'http://localhost:3000'
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all origins in production for now
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ROUTES
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  console.log("Root endpoint hit!");
  res.send("Server is running");
});

app.get("/test", (req, res) => {
  console.log("Test endpoint hit!");
  res.json({ message: "Test successful", timestamp: new Date().toISOString() });
});

// Auto-unlock products endpoint (for manual triggering)
app.get("/api/auto-unlock-products", async (req, res) => {
  try {
    console.log("🔓 Manual auto-unlock triggered");
    const result = await checkAndUnlockProducts();
    res.json({
      success: true,
      message: `Auto-unlock completed. ${result.unlocked} products unlocked.`,
      result
    });
  } catch (error) {
    console.error("❌ Error in manual auto-unlock:", error);
    res.status(500).json({
      success: false,
      message: "Error during auto-unlock process",
      error: error.message
    });
  }
});

// STARTING SERVER
const server = app.listen(port, '0.0.0.0', async () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Server accessible at http://localhost:${port}`);
  await connectToMongoDB();
  
  // Run auto-unlock on server startup
  console.log("🔓 Running initial auto-unlock check...");
  try {
    const result = await checkAndUnlockProducts();
    console.log(`✅ Initial auto-unlock completed: ${result.unlocked} products unlocked`);
  } catch (error) {
    console.error("❌ Error in initial auto-unlock:", error);
  }
  
  // Set up periodic auto-unlock (every 15 minutes to reduce CPU usage)
  setInterval(async () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log("🕐 Running scheduled auto-unlock check...");
    }
    try {
      const result = await checkAndUnlockProducts();
      if (result.unlocked > 0) {
        console.log(`🎉 Scheduled auto-unlock completed: ${result.unlocked} products unlocked`);
      }
    } catch (error) {
      console.error("❌ Error in scheduled auto-unlock:", error);
    }
  }, 15 * 60 * 1000); // Run every 15 minutes (reduced from 5 to reduce CPU usage)
  
  console.log("⏰ Auto-unlock system initialized (checking every 15 minutes)");
});

server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
  }
});
