// Simple script to add test nicknames
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  recentPurchases: [{
    nickname: String,
    size: String,
    quantity: Number,
    purchaseDate: { type: Date, default: Date.now },
    orderId: mongoose.Schema.Types.ObjectId
  }]
});

const Product = mongoose.model('Product', productSchema);

async function addTestNicknames() {
  try {
    await mongoose.connect("mongodb+srv://gamal:i88awp74CwLhGY3w@cluster0.uz3sd8m.mongodb.net/");
    console.log("Connected to database");

    // Get first product
    const product = await Product.findById("68b8739ae1e665b12b804203");
    if (!product) {
      console.log("Product not found");
      return;
    }

    console.log("Found product:", product.name);

    // Add test nicknames
    const testPurchases = [
      {
        nickname: "Ahmed M.",
        size: "Large",
        quantity: 1,
        purchaseDate: new Date(),
        orderId: new mongoose.Types.ObjectId()
      },
      {
        nickname: "Sarah K.",
        size: "Medium", 
        quantity: 2,
        purchaseDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        orderId: new mongoose.Types.ObjectId()
      },
      {
        nickname: "Omar H.",
        size: "Small",
        quantity: 1,
        purchaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        orderId: new mongoose.Types.ObjectId()
      }
    ];

    // Clear existing purchases and add new ones
    product.recentPurchases = testPurchases;
    await product.save();

    console.log("✅ Test nicknames added successfully!");
    console.log("Total recent purchases:", product.recentPurchases.length);
    
    product.recentPurchases.forEach((purchase, index) => {
      console.log(`${index + 1}. ${purchase.nickname} - ${purchase.size} - ${purchase.purchaseDate}`);
    });

    await mongoose.disconnect();
    console.log("Done! Now visit the product page to see the nicknames.");

  } catch (error) {
    console.error("Error:", error.message);
  }
}

addTestNicknames();
