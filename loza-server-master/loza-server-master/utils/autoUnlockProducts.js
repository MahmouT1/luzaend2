import { Product } from "../models/product.model.js";

/**
 * Automatically unlock products whose release date has passed
 * This function should be called periodically (e.g., every hour or daily)
 */
export const autoUnlockProducts = async () => {
  try {
    console.log("🔓 Starting automatic product unlock process...");
    
    const now = new Date();
    
    // Find all scheduled products that are still locked but should be unlocked
    const productsToUnlock = await Product.find({
      isScheduled: true,
      isReleased: false,
      releaseDate: { $lte: now }
    });
    
    if (productsToUnlock.length === 0) {
      console.log("✅ No products need to be unlocked at this time");
      return { unlocked: 0, products: [] };
    }
    
    console.log(`🔍 Found ${productsToUnlock.length} products ready to be unlocked`);
    
    // Update all products to be released
    const updateResult = await Product.updateMany(
      {
        isScheduled: true,
        isReleased: false,
        releaseDate: { $lte: now }
      },
      {
        $set: { isReleased: true }
      }
    );
    
    console.log(`🎉 Successfully unlocked ${updateResult.modifiedCount} products!`);
    
    // Log the unlocked products
    const unlockedProducts = productsToUnlock.map(product => ({
      id: product._id,
      name: product.name,
      releaseDate: product.releaseDate
    }));
    
    console.log("📦 Unlocked products:", unlockedProducts);
    
    return {
      unlocked: updateResult.modifiedCount,
      products: unlockedProducts
    };
    
  } catch (error) {
    console.error("❌ Error in autoUnlockProducts:", error);
    throw error;
  }
};

/**
 * Check and unlock products (can be called manually or via cron job)
 */
export const checkAndUnlockProducts = async () => {
  try {
    const result = await autoUnlockProducts();
    return result;
  } catch (error) {
    console.error("❌ Error checking and unlocking products:", error);
    return { unlocked: 0, products: [], error: error.message };
  }
};
