import axios from 'axios';
import mongoose from 'mongoose';
import { connectToMongoDB } from "./utils/db/connectDB.js";
import { Product } from "./models/product.model.js";

async function createTestProduct() {
  try {
    await connectToMongoDB();
    
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
    console.log("✅ Test product created successfully:", savedProduct._id);

    // Now test the order creation with the new product ID
    const orderData = {
      userInfo: {
        userId: "68afafa2d482755e87ce7882", // Use the valid user ID
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        phone: "123-456-7890"
      },
      shippingAddress: {
        address: "123 Test St",
        city: "Test City",
        postalCode: "12345"
      },
      orderItems: [
        {
          id: savedProduct._id, // Use the valid product ID
          name: savedProduct.name,
          size: "M",
          quantity: 1,
          price: savedProduct.price
        }
      ],
      totalPrice: savedProduct.price,
      paymentMethod: {
        type: "credit_card",
        status: "paid"
      }
    };

    try {
      const createResponse = await axios.post('http://localhost:8000/api/orders/create-order', orderData);
      console.log('✅ Order created successfully:', createResponse.data);
    } catch (error) {
      console.log('❌ Order creation failed:', error.response?.status, error.response?.data);
    }

    await mongoose.disconnect();
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run the function
createTestProduct();
