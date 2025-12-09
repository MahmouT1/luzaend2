// Test script to manually add a recent purchase to a product
import mongoose from "mongoose";
import { Product } from "./models/product.model.js";

async function addTestPurchase() {
  try {
    // Connect to database
    await mongoose.connect("mongodb+srv://gamal:i88awp74CwLhGY3w@cluster0.uz3sd8m.mongodb.net/");
    console.log("Connected to database");

    // Get the first product
    const products = await Product.find().limit(1);
    if (products.length === 0) {
      console.log("No products found in database");
      return;
    }

    const product = products[0];
    console.log("Found product:", product.name, "ID:", product._id);

    // Add a test purchase
    const testPurchase = {
      nickname: "Test User",
      size: "Large",
      quantity: 1,
      purchaseDate: new Date(),
      orderId: new mongoose.Types.ObjectId()
    };

    console.log("Adding test purchase:", testPurchase);

    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: {
          recentPurchases: testPurchase
        }
      },
      { new: true }
    );

    console.log("Product updated successfully");
    console.log("Recent purchases count:", updatedProduct.recentPurchases.length);
    console.log("Recent purchases:", updatedProduct.recentPurchases);

    await mongoose.disconnect();
    console.log("Disconnected from database");

  } catch (error) {
    console.error("Error:", error);
  }
}

addTestPurchase();
