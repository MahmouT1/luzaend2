import mongoose from "mongoose";
export const connectToMongoDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://gamal:i88awp74CwLhGY3w@cluster0.uz3sd8m.mongodb.net/");
    console.log("Connected to DB");
  } catch (error) {
    console.log("Error connecting to DB", error.message);
  }
};
