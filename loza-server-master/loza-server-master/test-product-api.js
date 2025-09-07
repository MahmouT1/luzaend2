// Test the product API to see if it returns recent purchases
import mongoose from "mongoose";
import { Product } from "./models/product.model.js";

async function testProductAPI() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect("mongodb+srv://gamal:i88awp74CwLhGY3w@cluster0.uz3sd8m.mongodb.net/");
    console.log("Connected successfully!");

    // Get first product (same as what the API would return)
    const product = await Product.findById("68b8739ae1e665b12b804203");
    
    if (!product) {
      console.log("Product not found!");
      return;
    }

    console.log("Product found:", product.name);
    console.log("Product ID:", product._id);
    console.log("Recent purchases field exists:", !!product.recentPurchases);
    console.log("Recent purchases type:", typeof product.recentPurchases);
    console.log("Recent purchases length:", product.recentPurchases?.length);
    
    if (product.recentPurchases && product.recentPurchases.length > 0) {
      console.log("Recent purchases data:");
      product.recentPurchases.forEach((purchase, index) => {
        console.log(`  ${index + 1}. ${purchase.nickname} - ${purchase.size} - ${purchase.quantity} - ${purchase.purchaseDate}`);
      });
    } else {
      console.log("No recent purchases found");
    }

    // Test what the API would return (JSON.stringify)
    const apiResponse = JSON.stringify(product, null, 2);
    console.log("\nAPI Response (first 500 chars):");
    console.log(apiResponse.substring(0, 500) + "...");

    await mongoose.disconnect();
    console.log("Test completed!");

  } catch (error) {
    console.error("Error:", error.message);
  }
}

testProductAPI();
