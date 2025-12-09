import * as cloudinary from "cloudinary";

export const uploadProductImageService = async (images, res) => {
  let uploadedImages = [];

  try {
    console.log("🖼️ Image upload service called with:", images?.length || 0, "images");
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      console.log("❌ No images provided to upload service");
      throw new Error("No images provided for upload");
    }

    // Check if Cloudinary is properly configured
    const cloudName = process.env.CLOUD_NAME;
    const apiKey = process.env.CLOUD_API_KEY;
    const apiSecret = process.env.CLOUD_SECRET_KEY;
    
    if (!cloudName || !apiKey || !apiSecret || 
        cloudName === 'development-cloud-name' || 
        apiKey === 'development-api-key' || 
        apiSecret === 'development-secret-key') {
      console.log("⚠️ Cloudinary not properly configured, using uploaded images directly");
      
      // Return the uploaded images directly (they're already base64 data URLs)
      uploadedImages = images.map((image, index) => {
        // Ensure the image is a valid base64 data URL
        if (typeof image === 'string' && image.startsWith('data:image/')) {
          return {
            url: image, // Use the base64 data URL directly
            public_id: `local_${Date.now()}_${index}`
          };
        } else {
          console.log("⚠️ Invalid image format, skipping:", typeof image);
          return null;
        }
      }).filter(img => img !== null);
      
      console.log("✅ Using uploaded images directly:", uploadedImages.length);
      return uploadedImages;
    }

    const uploadPromises = images.map(async (image, index) => {
      console.log(`📸 Uploading image ${index + 1}:`, typeof image, image?.substring(0, 50) + "...");
      const result = await cloudinary.v2.uploader.upload(image, {
        folder: "products",
      });
      console.log(`✅ Image ${index + 1} uploaded successfully`);
      return { url: result.secure_url, public_id: result.public_id };
    });

    uploadedImages = await Promise.all(uploadPromises); // Wait for all uploads to finish
    console.log("✅ All images uploaded successfully:", uploadedImages.length);
  } catch (error) {
    console.error("❌ Product Service Error (uploadImageService):", error.message);
    console.error("❌ Full error:", error);
    
    // If Cloudinary fails, use uploaded images directly as fallback
    console.log("⚠️ Cloudinary upload failed, using uploaded images directly as fallback");
    uploadedImages = images.map((image, index) => {
      // Ensure the image is a valid base64 data URL
      if (typeof image === 'string' && image.startsWith('data:image/')) {
        return {
          url: image, // Use the base64 data URL directly
          public_id: `fallback_${Date.now()}_${index}`
        };
      } else {
        console.log("⚠️ Invalid image format in fallback, skipping:", typeof image);
        return null;
      }
    }).filter(img => img !== null);
    
    console.log("✅ Using fallback placeholder images:", uploadedImages.length);
  }

  return uploadedImages;
};

// export const uploadProductImageService = async (images, res) => {
//   let uploadedImages = [];

//   try {
//     for (const image of images) {
//       const result = await cloudinary.v2.uploader.upload(image, {
//         folder: "products",
//       });

//       const data = {
//         url: result.secure_url,
//         public_id: result.public_id,
//       };

//       uploadedImages.push(data);
//     }
//   } catch (error) {
//     console.error("Product Service Error (uploadImageService):", error.message);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }

//   return uploadedImages;
// };

export const updateProductImageService = async (images, product, res) => {
  let updatedImages = [];
  try {
    await Promise.all(
      images.map(async (imgData, index) => {
        if (imgData.url) {
          updatedImages.push(imgData);
        } else {
          if (product.images[index]) {
            await cloudinary.v2.uploader.destroy(
              product.images[index].public_id
            );
          }

          const result = await cloudinary.v2.uploader.upload(imgData, {
            folder: "products",
          });

          const data = {
            url: result.secure_url,
            public_id: result.public_id,
          };

          updatedImages.push(data);
        }
      })
    );
  } catch (error) {
    console.error("Product Service Error (updateImageService):", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  return updatedImages;
};

export const deleteProductImageService = async (product) => {
  try {
    const productImages = product.images.map((image) => image.public_id);
    await cloudinary.v2.api.delete_resources(productImages);
  } catch (error) {
    console.error("Product Service Error (deleteImageService):", error.message);
  }
};
