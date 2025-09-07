// Simple script to check if there are any products in the database
import mongoose from "mongoose";

async function checkProducts() {
  try {
    // Try to connect using the same method as the server
    await mongoose.connect("mongodb+srv://gamal:i88awp74CwLhGY3w@cluster0.uz3sd8m.mongodb.net/");
    
    const Product = mongoose.model('Product', new mongoose.Schema({
      name: String,
      description: String,
      price: Number,
      images: Array,
      info: Array
    }));
    
    const products = await Product.find().limit(5);
    console.log("Found", products.length, "products in database");
    
    if (products.length > 0) {
      console.log("Sample product:", {
        id: products[0]._id,
        name: products[0].name,
        price: products[0].price
      });
    } else {
      console.log("No products found in database");
    }
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error("Error checking products:", error.message);
  }
}

checkProducts();
