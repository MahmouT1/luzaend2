import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

// Re-export client-safe functions from cloudinary-client for backward compatibility
export { 
  getCloudName, 
  getCloudinaryBaseUrl, 
  getCloudinaryImageUrl, 
  getCloudinaryVideoUrl 
} from './cloudinary-client';

/**
 * Upload file to Cloudinary (server-side only)
 * @param filePath - Path to file or buffer
 * @param folder - Folder path in Cloudinary
 * @param resourceType - Type of resource (image, video, auto)
 */
export const uploadToCloudinary = async (
  filePath: string | Buffer,
  folder: string = 'loza-media',
  resourceType: 'image' | 'video' | 'auto' = 'auto'
): Promise<{ url: string; publicId: string }> => {
  try {
    // Handle Buffer type - convert to base64 or use as-is for Cloudinary
    const uploadSource = typeof filePath === 'string' 
      ? filePath 
      : `data:image/jpeg;base64,${filePath.toString('base64')}`;
    
    const result = await cloudinary.uploader.upload(uploadSource as any, {
      folder: folder,
      resource_type: resourceType,
      quality: 'auto',
      fetch_format: 'auto',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Export cloudinary instance for advanced usage
export { cloudinary };

