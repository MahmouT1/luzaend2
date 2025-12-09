// Script to update the vist product with new placeholder URLs
import mongoose from "mongoose";
import { Product } from "./models/product.model.js";

async function updateVistProduct() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/loza-culture");
    console.log("Connected to MongoDB");
    
    // Find the vist product
    const vistProduct = await Product.findOne({ name: "vist" });
    
    if (!vistProduct) {
      console.log("❌ Vist product not found");
      return;
    }
    
    console.log("🔍 Found vist product, updating images...");
    
    // Update images array with new placeholder URLs
    vistProduct.images = [
      {
        url: `https://picsum.photos/400/400?random=${Date.now()}_1`,
        public_id: `updated_${Date.now()}_1`
      },
      {
        url: `https://picsum.photos/400/400?random=${Date.now()}_2`,
        public_id: `updated_${Date.now()}_2`
      }
    ];
    
    // Update cover image
    vistProduct.coverImage = `https://picsum.photos/400/400?random=${Date.now()}_cover`;
    
    await vistProduct.save();
    console.log("✅ Vist product updated successfully");
    
    await mongoose.disconnect();
    console.log("✅ Database connection closed");
    
  } catch (error) {
    console.error("❌ Error updating vist product:", error);
  }
}

updateVistProduct();

