import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { uploadProductImageService } from "../services/product.service.js";

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
