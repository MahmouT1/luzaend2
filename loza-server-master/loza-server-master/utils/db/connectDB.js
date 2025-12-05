import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb+srv://gamal:i88awp74CwLhGY3w@cluster0.uz3sd8m.mongodb.net/";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    throw error;
  }
};
