// Add your nickname to test the display
import mongoose from "mongoose";
import { Product } from "./models/product.model.js";

async function addYourNickname() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect("mongodb+srv://gamal:i88awp74CwLhGY3w@cluster0.uz3sd8m.mongodb.net/");
    console.log("Connected successfully!");

    // Get the first product
    const product = await Product.findById("68b8739ae1e665b12b804203");
    
    if (!product) {
      console.log("Product not found!");
      return;
    }

    // Add your test purchase
    const yourPurchase = {
      nickname: "Your Test Nickname", // Change this to your actual nickname
      size: "Large",
      quantity: 1,
      purchaseDate: new Date(),
      orderId: new mongoose.Types.ObjectId()
    };

    console.log("Adding your purchase:", yourPurchase);

    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: {
          recentPurchases: yourPurchase
        }
      },
      { new: true }
    );

    console.log("✅ Your nickname added successfully!");
    console.log("Total recent purchases:", updatedProduct.recentPurchases.length);
    console.log("Latest purchase:", updatedProduct.recentPurchases[updatedProduct.recentPurchases.length - 1]);

    await mongoose.disconnect();
    console.log("Test completed! Now visit the product page to see your nickname.");

  } catch (error) {
    console.error("Error:", error.message);
  }
}

addYourNickname();
