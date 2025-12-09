import mongoose from "mongoose";
import { Product } from "./models/product.model.js";

async function createTestProduct() {
  try {
    // Connect directly using the MongoDB connection string
    await mongoose.connect("mongodb+srv://gamal:i88awp74CwLhGY3w@cluster0.uz3sd8m.mongodb.net/");
    console.log("Connected to MongoDB");
    
    // Create a test product
    const testProduct = new Product({
      name: "Test Product",
      description: "A test product for order creation",
      price: 29.99,
      discountPrice: 24.99,
      images: ["test-image.jpg"],
      inStock: true,
      newArrival: true,
      info: [
        {
          size: "M",
          quantity: 10,
          inStock: true
        },
        {
          size: "L", 
          quantity: 5,
          inStock: true
        }
      ]
    });

    const savedProduct = await testProduct.save();
    console.log("✅ Test product created successfully:");
    console.log("Product ID:", savedProduct._id);
    console.log("Product Name:", savedProduct.name);
    console.log("Available Sizes:", savedProduct.info.map(i => i.size));
    
    await mongoose.disconnect();
    return savedProduct._id;
    
  } catch (error) {
    console.error("❌ Error creating test product:", error.message);
    throw error;
  }
}

// Run the function
createTestProduct()
  .then(productId => {
    console.log("\n🎉 Test product ready for order creation!");
    console.log("Use this product ID in your order tests:", productId);
    process.exit(0);
  })
  .catch(error => {
    console.error("Failed to create test product");
    process.exit(1);
  });
