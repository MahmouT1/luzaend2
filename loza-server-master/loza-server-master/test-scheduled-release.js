import 'dotenv/config';
import { Product } from './models/product.model.js';
import { connectToMongoDB } from './utils/db/connectDB.js';
import { checkAndUnlockProducts } from './utils/autoUnlockProducts.js';

async function testScheduledRelease() {
  try {
    console.log('🧪 Testing Scheduled Release Feature...');
    
    // Connect to database
    await connectToMongoDB();
    console.log('✅ Connected to database');
    
    // Create a test product with scheduled release (1 minute from now)
    const releaseDate = new Date();
    releaseDate.setMinutes(releaseDate.getMinutes() + 1); // 1 minute from now
    
    const testProduct = {
      name: 'Test Scheduled Product',
      description: 'This is a test product for scheduled release',
      price: 100,
      discountPrice: 80,
      points: 10,
      category: '64f8b8c9e4b0a1b2c3d4e5f6', // You'll need to replace with actual category ID
      images: [
        {
          url: 'https://via.placeholder.com/400x500/cccccc/969696?text=Test+Product',
          public_id: 'test-product-1'
        }
      ],
      coverImage: 'https://via.placeholder.com/400x500/cccccc/969696?text=Test+Product',
      info: [
        {
          size: 'M',
          quantity: 10
        }
      ],
      isScheduled: true,
      releaseDate: releaseDate,
      isReleased: false
    };
    
    console.log('📦 Creating test scheduled product...');
    console.log('📅 Release date:', releaseDate.toLocaleString());
    
    const product = await Product.create(testProduct);
    console.log('✅ Test product created:', product._id);
    console.log('🔒 Product is currently locked:', !product.isReleased);
    
    // Wait for 1 minute and 10 seconds
    console.log('⏳ Waiting for release date (1 minute and 10 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 70 * 1000)); // 70 seconds
    
    // Check and unlock products
    console.log('🔓 Running auto-unlock check...');
    const result = await checkAndUnlockProducts();
    
    console.log('📊 Auto-unlock result:', result);
    
    // Check the product status
    const updatedProduct = await Product.findById(product._id);
    console.log('📦 Updated product status:');
    console.log('  - isScheduled:', updatedProduct.isScheduled);
    console.log('  - isReleased:', updatedProduct.isReleased);
    console.log('  - releaseDate:', updatedProduct.releaseDate);
    
    if (updatedProduct.isReleased) {
      console.log('🎉 SUCCESS: Product was automatically unlocked!');
    } else {
      console.log('❌ FAILED: Product was not unlocked');
    }
    
    // Clean up - delete the test product
    await Product.findByIdAndDelete(product._id);
    console.log('🧹 Test product cleaned up');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    process.exit(0);
  }
}

// Run the test
testScheduledRelease();
