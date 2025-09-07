// Check if product data includes recent purchases
import mongoose from "mongoose";
import { Product } from "./models/product.model.js";

async function checkProductData() {
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
    console.log("Product name:", product.name);
    console.log("Product ID:", product._id);
    console.log("Recent purchases count:", product.recentPurchases ? product.recentPurchases.length : 0);
    
    if (product.recentPurchases && product.recentPurchases.length > 0) {
      console.log("Recent purchases:");
      product.recentPurchases.forEach((purchase, index) => {
        console.log(`  ${index + 1}. ${purchase.nickname} - ${purchase.size} - ${purchase.quantity} - ${purchase.purchaseDate}`);
      });
    } else {
      console.log("No recent purchases found");
    }

    await mongoose.disconnect();
    console.log("Check completed!");

  } catch (error) {
    console.error("Error:", error.message);
  }
}

checkProductData();
