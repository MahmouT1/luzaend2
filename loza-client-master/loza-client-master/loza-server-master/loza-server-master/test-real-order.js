// Test real order creation process
import mongoose from "mongoose";
import { Product } from "./models/product.model.js";
import { Order } from "./models/order.model.js";

async function testRealOrder() {
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

    // Create a test order
    const orderData = {
      userInfo: {
        firstName: "Test",
        lastName: "User",
        phone: "1234567890",
        email: "test@example.com",
        userId: new mongoose.Types.ObjectId(),
        nickname: "Real Order Test User"
      },
      shippingAddress: {
        address: "Test Address",
        city: "Test City",
        postalCode: "12345",
        country: "Test Country",
        building: "Test Building",
        unitNumber: "Test Unit"
      },
      orderItems: [
        {
          productId: product._id.toString(),
          id: product._id.toString(),
          name: product.name,
          size: "Medium",
          quantity: 1,
          price: product.price,
          points: 0
        }
      ],
      paymentMethod: {
        status: "unpaid",
        type: "cash_on_delivery"
      },
      totalPrice: product.price,
      orderStatus: "Pending",
      orderNumber: 9999
    };

    console.log("Creating order with data:", JSON.stringify(orderData, null, 2));

    // Create the order
    const order = await Order.create(orderData);
    console.log("Order created successfully:", order._id);

    // Now test the tracking logic
    console.log("Starting recent purchases tracking...");
    const { userInfo, orderItems } = orderData;
    
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
          orderId: order._id
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
      } else {
        console.log("Skipping item - missing productId or nickname");
      }
    }

    // Check final product data
    const finalProduct = await Product.findById(product._id);
    console.log("Final product recent purchases count:", finalProduct.recentPurchases.length);
    console.log("Latest purchase:", finalProduct.recentPurchases[finalProduct.recentPurchases.length - 1]);

    await mongoose.disconnect();
    console.log("Test completed successfully!");

  } catch (error) {
    console.error("Error:", error.message);
  }
}

testRealOrder();
