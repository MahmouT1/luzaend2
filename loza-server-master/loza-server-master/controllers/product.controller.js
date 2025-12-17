import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { uploadProductImageService, updateProductImageService } from "../services/product.service.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    console.log("📦 Product creation request received:", JSON.stringify(req.body, null, 2));
    const { data } = req.body;

    if (!data || !data.name || !data.price) {
      console.log("❌ Validation failed - Missing required fields");
      console.log("  data:", !!data);
      console.log("  name:", data?.name);
      console.log("  price:", data?.price);
      return res.status(400).json({ message: "Missed data" });
    }

    const existProduct = await Product.findOne({ name: data.name });
    if (existProduct) {
      return res.status(400).json({
        message: "Product name already exists",
      });
    }

    // HANDLE IMAGE UPLOAD
    console.log("🖼️ Starting image upload process...");
    console.log("Images to upload:", data.images?.length || 0);
    console.log("Cover image:", !!data.coverImage);
    
    // Combine cover image with additional images for upload
    let allImagesToUpload = [...(data.images || [])];
    if (data.coverImage) {
      allImagesToUpload.unshift(data.coverImage); // Add cover image at the beginning
    }
    
    console.log("📸 Total images to upload:", allImagesToUpload.length);
    
    // Check if we have any images to upload
    if (allImagesToUpload.length === 0) {
      console.log("❌ No images provided - cannot create product without images");
      return res.status(400).json({ message: "At least one image is required" });
    }
    
    const uploadedImgsData = await uploadProductImageService(allImagesToUpload, res);
    console.log("✅ All images uploaded:", uploadedImgsData.length);
    
    // Set the images array
    data.images = uploadedImgsData;
    
    // Set cover image (first uploaded image URL)
    if (uploadedImgsData.length > 0) {
      data.coverImage = uploadedImgsData[0].url; // Store only the URL string
      console.log("📸 Cover image set to first uploaded image URL:", data.coverImage);
    } else {
      console.log("❌ No images uploaded - cannot create product without images");
      return res.status(400).json({ message: "At least one image is required" });
    }
    
    console.log("💾 Creating product in database...");
    console.log("Final data:", { 
      name: data.name, 
      imagesCount: data.images.length, 
      hasCoverImage: !!data.coverImage 
    });
    await Product.create(data);
    console.log("✅ Product created successfully");

    // increment category productsCount
    await Category.findByIdAndUpdate(data.category, {
      $inc: { products: 1 },
    });
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    console.error("❌ Product controller error (createProduct):", error.message);
    console.error("❌ Full error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    0, res.status(200).json(products);
  } catch (error) {
    console.log("product controller error (getAllProducts) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET PRODUCTS BY CATEGORY NAME OR NEW ARRIVALS
export const getProductsByCategoryName = async (req, res) => {
  try {
    const { categoryName } = req.params;

    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    let products;

    if (categoryName.toLowerCase() === "new-arrival") {
      products = await Product.find({ newArrival: true }).populate(
        "category",
        "name"
      );
    } else {
      const category = await Category.findOne({ name: categoryName });
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      products = await Product.find({ category: category._id }).populate(
        "category",
        "name"
      );
    }

    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.log(
      "product controller error (getProductsByCategoryName) :",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// SEARCH PRODUCTS
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchQuery = q.trim();
    
    // Search in product name and description
    const products = await Product.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } }
      ]
    }).populate("category", "name");

    res.status(200).json({
      products,
      query: searchQuery,
      count: products.length
    });
  } catch (error) {
    console.log("product controller error (searchProducts) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET SINGLE PRODUCT
export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching product with ID:", id);
    
    const product = await Product.findById(id);
    console.log("Product found:", product ? "Yes" : "No");
    
    if (product) {
      console.log("Product recentPurchases:", product.recentPurchases);
      console.log("Recent purchases count:", product.recentPurchases ? product.recentPurchases.length : 0);
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.log("product controller error (getSingleProduct) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    console.log("📦 Product update request received for ID:", id);
    console.log("Update data:", JSON.stringify(data, null, 2));

    if (!data || !data.name || !data.price) {
      console.log("❌ Validation failed - Missing required fields");
      return res.status(400).json({ message: "Name and price are required" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle image updates
    let updatedImages = [];
    let updatedCoverImage = product.coverImage;

    // Process images - separate new uploads (base64) from existing URLs
    const newImagesToUpload = [];
    const existingImages = [];

    if (data.images && Array.isArray(data.images)) {
      data.images.forEach((img) => {
        // Check if it's a new base64 upload or existing URL
        if (typeof img === 'string' && img.startsWith('data:image/')) {
          // New base64 image - needs upload
          newImagesToUpload.push(img);
        } else if (typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://'))) {
          // Existing URL - keep as is
          existingImages.push({ url: img });
        } else if (typeof img === 'object' && img && img.url) {
          // Existing image object
          existingImages.push(img);
        }
      });
    }

    // Upload new images if any
    if (newImagesToUpload.length > 0) {
      console.log("🖼️ Uploading", newImagesToUpload.length, "new images...");
      const uploadedImgsData = await uploadProductImageService(newImagesToUpload, res);
      updatedImages = [...existingImages, ...uploadedImgsData];
    } else {
      updatedImages = existingImages;
    }

    // Handle cover image
    if (data.coverImage) {
      if (typeof data.coverImage === 'string' && data.coverImage.startsWith('data:image/')) {
        // New cover image upload
        console.log("🖼️ Uploading new cover image...");
        const uploadedCoverImgs = await uploadProductImageService([data.coverImage], res);
        if (uploadedCoverImgs.length > 0) {
          updatedCoverImage = uploadedCoverImgs[0].url;
        }
      } else if (typeof data.coverImage === 'string' && (data.coverImage.startsWith('http://') || data.coverImage.startsWith('https://'))) {
        // Existing cover image URL
        updatedCoverImage = data.coverImage;
      }
    }

    // If no cover image specified, use first image
    if (!updatedCoverImage && updatedImages.length > 0) {
      const firstImage = updatedImages[0];
      updatedCoverImage = typeof firstImage === 'string' 
        ? firstImage 
        : (firstImage && firstImage.url ? firstImage.url : product.coverImage);
    }

    // Prepare update data
    // Ensure discountPrice is properly handled (can be 0 or any positive number)
    const discountPriceValue = data.discountPrice !== undefined && data.discountPrice !== null 
      ? Number(data.discountPrice) 
      : 0;

    const updateData = {
      name: data.name,
      description: data.description || '',
      price: data.price,
      discountPrice: discountPriceValue >= 0 ? discountPriceValue : 0,
      points: data.points || 0,
      category: data.category,
      info: data.info || product.info,
      newArrival: data.newArrival !== undefined ? data.newArrival : product.newArrival,
      isScheduled: data.isScheduled !== undefined ? data.isScheduled : product.isScheduled,
      releaseDate: data.releaseDate || null,
      images: updatedImages.length > 0 ? updatedImages : product.images,
      coverImage: updatedCoverImage,
    };

    console.log("📊 Update data prepared:", {
      name: updateData.name,
      price: updateData.price,
      discountPrice: updateData.discountPrice,
      hasImages: updateData.images.length > 0
    });

    // Update product
    console.log("💾 Updating product in database...");
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("✅ Product updated successfully");
    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("❌ Product controller error (updateProduct):", error.message);
    console.error("❌ Full error:", error);
    res.status(500).json({ 
      message: error.message || "Internal Server Error"
    });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Decrement category productsCount
    await Category.findByIdAndUpdate(product.category, {
      $inc: { products: -1 },
    });

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("product controller error (deleteProduct) :", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET BESTSELLING PRODUCTS
export const getBestsellingProducts = async (req, res) => {
  try {
    console.log("📊 [Bestsellers] Starting to fetch bestsellers...");
    
    // Get all paid orders
    const orders = await Order.find({
      $or: [
        { 'paymentMethod.status': 'paid' },
        { orderStatus: { $in: ['Complete', 'Delivered', 'Confirmed', 'Shipped'] } }
      ]
    });

    console.log(`📊 [Bestsellers] Found ${orders.length} paid orders`);

    // Calculate product sales statistics
    const productStats = {};
    
    orders.forEach(order => {
      if (order.orderItems && Array.isArray(order.orderItems)) {
        order.orderItems.forEach(item => {
          // Use item.id as unique identifier (same as analytics controller)
          const productId = item.id || item.productId || item._id;
          
          if (productId) {
            if (!productStats[productId]) {
              productStats[productId] = {
                productId: productId,
                totalQuantity: 0,
                totalSales: 0
              };
            }
            productStats[productId].totalQuantity += item.quantity || 1;
            productStats[productId].totalSales += (item.price || 0) * (item.quantity || 1);
          }
        });
      }
    });

    console.log(`📊 [Bestsellers] Calculated stats for ${Object.keys(productStats).length} products`);

    // Sort products by total quantity sold (bestsellers)
    const sortedProductIds = Object.keys(productStats)
      .sort((a, b) => productStats[b].totalQuantity - productStats[a].totalQuantity)
      .slice(0, 20); // Get top 20 bestsellers

    console.log(`📊 [Bestsellers] Top ${sortedProductIds.length} bestseller IDs:`, sortedProductIds.slice(0, 5));

    // Fetch full product details
    const bestsellerProducts = [];
    
    for (const productId of sortedProductIds) {
      try {
        const product = await Product.findById(productId)
          .populate("category", "name");
        
        if (product) {
          bestsellerProducts.push(product);
        }
      } catch (err) {
        console.log(`⚠️ [Bestsellers] Product ${productId} not found, skipping...`);
      }
    }

    // If no bestsellers found based on orders, return empty array or some default products
    if (bestsellerProducts.length === 0) {
      console.log("📊 [Bestsellers] No bestsellers found, using fallback (recent products)");
      // Optionally: return products with highest ratings or most recent
      const fallbackProducts = await Product.find()
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .limit(10);
      
      console.log(`✅ [Bestsellers] Returning ${fallbackProducts.length} fallback products`);
      return res.status(200).json(fallbackProducts);
    }

    console.log(`✅ [Bestsellers] Returning ${bestsellerProducts.length} bestseller products`);
    res.status(200).json(bestsellerProducts);
  } catch (error) {
    console.error("❌ [Bestsellers] Error:", error.message);
    console.error("❌ [Bestsellers] Stack:", error.stack);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// ADD PRODUCT RATING
export const addProductRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review, userName, userId } = req.body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    if (!userName || !userName.trim()) {
      return res.status(400).json({ message: "User name is required" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already rated this product (if userId provided)
    if (userId) {
      const existingRating = product.ratings.find(
        (r) => r.userId && r.userId.toString() === userId.toString()
      );
      if (existingRating) {
        // Update existing rating
        existingRating.rating = rating;
        existingRating.review = review || "";
        existingRating.userName = userName.trim();
      } else {
        // Add new rating
        product.ratings.push({
          userId: userId,
          userName: userName.trim(),
          rating: rating,
          review: review || "",
        });
      }
    } else {
      // Guest rating (no userId)
      product.ratings.push({
        userName: userName.trim(),
        rating: rating,
        review: review || "",
      });
    }

    // Calculate average rating
    const totalRatings = product.ratings.length;
    const sumRatings = product.ratings.reduce((sum, r) => sum + r.rating, 0);
    product.averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
    product.totalRatings = totalRatings;

    await product.save();

    res.status(200).json({
      message: "Rating added successfully",
      product: {
        _id: product._id,
        averageRating: product.averageRating,
        totalRatings: product.totalRatings,
        ratings: product.ratings,
      },
    });
  } catch (error) {
    console.error("❌ Product controller error (addProductRating):", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};