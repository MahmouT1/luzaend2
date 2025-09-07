import { Product } from "../models/product.model.js";

export const quantityChecker = async (req, res, next) => {
  try {
    console.log("🔍 Starting stock validation for order...");
    console.log("📋 Full request body:", JSON.stringify(req.body, null, 2));
    const { orderItems } = req.body;
    
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    let checkedProducts = [];
    let totalPrice = 0;

    for (const orderedProduct of orderItems) {
      console.log(`📦 Checking product: ${orderedProduct.name || orderedProduct.id}, Size: ${orderedProduct.size}, Qty: ${orderedProduct.quantity}`);
      
      const product = await Product.findById(orderedProduct.id);

      if (!product) {
        console.log(`❌ Product not found: ${orderedProduct.id}`);
        return res.status(400).json({ 
          message: `Product "${orderedProduct.name || orderedProduct.id}" does not exist` 
        });
      }

      console.log(`📦 Current product in database:`, {
        name: product.name,
        info: product.info
      });

      let sizeMatched = false;

      for (const [index, item] of product.info.entries()) {
        if (item.size === orderedProduct.size) {
          sizeMatched = true;
          console.log(`📊 Stock check - Product: ${product.name}, Size: ${item.size}, Available: ${item.quantity}, Requested: ${orderedProduct.quantity}`);

          if (item.quantity < orderedProduct.quantity) {
            console.log(`❌ Insufficient stock - Available: ${item.quantity}, Requested: ${orderedProduct.quantity}`);
            return res.status(400).json({ 
              message: `Not enough stock for "${product.name}" (Size: ${orderedProduct.size}). Available: ${item.quantity}, Requested: ${orderedProduct.quantity}` 
            });
          }

          // Reduce stock in memory
          const oldQuantity = item.quantity;
          product.info[index].quantity -= orderedProduct.quantity;
          console.log(`✅ Stock reduced - Product: ${product.name}, Size: ${item.size}, From: ${oldQuantity} to: ${product.info[index].quantity}`);

          // Calculate price
          totalPrice += orderedProduct.quantity * product.price;

          checkedProducts.push(product);
          break; // Found the matching size, no need to continue
        }
      }

      if (!sizeMatched) {
        console.log(`❌ Size not found: ${orderedProduct.size} for product: ${product.name}`);
        return res.status(400).json({ 
          message: `Size "${orderedProduct.size}" not available for "${product.name}"` 
        });
      }
    }

    console.log(`✅ Stock validation passed. Total price: ${totalPrice}, Products to update: ${checkedProducts.length}`);
    req.products = checkedProducts;
    req.totalPrice = totalPrice;
    next();
  } catch (error) {
    console.error("❌ quantityChecker middleware error:", error.message);
    res.status(500).json({ message: "Internal Server Error during stock validation" });
  }
};

