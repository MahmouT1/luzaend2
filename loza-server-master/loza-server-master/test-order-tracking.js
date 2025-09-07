// Test the order tracking logic
import mongoose from "mongoose";
import { Product } from "./models/product.model.js";

async function testOrderTracking() {
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
    console.log("Found product:", product.name, "ID:", product._id);

    // Simulate order items structure
    const orderItems = [
      {
        productId: product._id.toString(),
        id: product._id.toString(),
        name: product.name,
        size: "Large",
        quantity: 1,
        price: product.price,
        points: 0
      }
    ];

    const userInfo = {
      nickname: "Test Order User",
      userId: new mongoose.Types.ObjectId()
    };

    console.log("Testing order tracking with:");
    console.log("Order items:", orderItems);
    console.log("User info:", userInfo);

    // Test the tracking logic
    for (const item of orderItems) {
      console.log("Processing item:", item);
      console.log("Item productId:", item.productId);
      console.log("User nickname:", userInfo.nickname);
      
      if (item.productId && userInfo.nickname) {
        console.log("Adding purchase to product:", item.productId);
        
        const purchaseData = {
          nickname: userInfo.nickname,
          size: item.size || "One Size",
          quantity: item.quantity,
          purchaseDate: new Date(),
          orderId: new mongoose.Types.ObjectId()
        };
        
        console.log("Purchase data:", purchaseData);
        
        const updatedProduct = await Product.findByIdAndUpdate(
          item.productId,
          {
            $push: {
              recentPurchases: purchaseData
            }
          },
          { new: true }
        );
        
        console.log("Product updated:", updatedProduct ? "Success" : "Failed");
        console.log("Recent purchases count:", updatedProduct.recentPurchases.length);
        console.log("Latest purchase:", updatedProduct.recentPurchases[updatedProduct.recentPurchases.length - 1]);
      } else {
        console.log("Skipping item - missing productId or nickname");
      }
    }

    await mongoose.disconnect();
    console.log("Test completed successfully!");

  } catch (error) {
    console.error("Error:", error.message);
  }
}

testOrderTracking();
