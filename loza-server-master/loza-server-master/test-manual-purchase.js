// Simple test to manually add a purchase to a product
import mongoose from "mongoose";

// Define the product schema inline for testing
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  images: Array,
  recentPurchases: [{
    nickname: String,
    size: String,
    quantity: Number,
    purchaseDate: { type: Date, default: Date.now },
    orderId: mongoose.Schema.Types.ObjectId
  }]
});

const Product = mongoose.model('Product', productSchema);

async function testManualPurchase() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect("mongodb+srv://gamal:i88awp74CwLhGY3w@cluster0.uz3sd8m.mongodb.net/");
    console.log("Connected successfully!");

    // Get first product
    const products = await Product.find().limit(1);
    if (products.length === 0) {
      console.log("No products found!");
      return;
    }

    const product = products[0];
    console.log("Found product:", product.name);

    // Add test purchase
    const testPurchase = {
      nickname: "Manual Test User",
      size: "Medium",
      quantity: 2,
      purchaseDate: new Date(),
      orderId: new mongoose.Types.ObjectId()
    };

    console.log("Adding purchase:", testPurchase);

    const updated = await Product.findByIdAndUpdate(
      product._id,
      { $push: { recentPurchases: testPurchase } },
      { new: true }
    );

    console.log("Updated product recent purchases:", updated.recentPurchases);
    console.log("Total purchases:", updated.recentPurchases.length);

    await mongoose.disconnect();
    console.log("Test completed successfully!");

  } catch (error) {
    console.error("Error:", error.message);
  }
}

testManualPurchase();
