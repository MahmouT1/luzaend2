/**
 * Client-safe Cloudinary helper functions
 * These functions don't require the cloudinary SDK and can be used in client components
 */

/**
 * Get Cloudinary cloud name
 */
export const getCloudName = (): string => {
  return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dxptnzuri';
};

/**
 * Get base URL for Cloudinary resources
 */
export const getCloudinaryBaseUrl = (): string => {
  const cloudName = getCloudName();
  return `https://res.cloudinary.com/${cloudName}`;
};

/**
 * Generate Cloudinary URL for images with optimization
 * @param publicId - Cloudinary public ID of the image
 * @param options - Transformation options
 */
export const getCloudinaryImageUrl = (
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number | 'auto';
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale';
  }
): string => {
  const baseUrl = getCloudinaryBaseUrl();
  const transformations: string[] = [];

  if (options?.width) transformations.push(`w_${options.width}`);
  if (options?.height) transformations.push(`h_${options.height}`);
  if (options?.quality) transformations.push(`q_${options.quality}`);
  if (options?.format) transformations.push(`f_${options.format}`);
  if (options?.crop) transformations.push(`c_${options.crop}`);

  // Default optimizations
  if (!options?.format) transformations.push('f_auto'); // Auto format (webp when supported)
  if (!options?.quality) transformations.push('q_auto'); // Auto quality

  const transformString = transformations.length > 0 
    ? transformations.join(',') + '/' 
    : '';

  return `${baseUrl}/image/upload/${transformString}${publicId}`;
};

/**
 * Generate Cloudinary URL for videos
 * @param publicId - Cloudinary public ID of the video
 * @param options - Transformation options
 */
export const getCloudinaryVideoUrl = (
  publicId: string,
  options?: {
    quality?: number | 'auto';
    format?: 'auto' | 'mp4' | 'webm';
  }
): string => {
  const baseUrl = getCloudinaryBaseUrl();
  const transformations: string[] = [];

  if (options?.quality) transformations.push(`q_${options.quality}`);
  if (options?.format) transformations.push(`f_${options.format}`);

  // Default optimizations
  if (!options?.format) transformations.push('f_auto');
  if (!options?.quality) transformations.push('q_auto');

  const transformString = transformations.length > 0 
    ? transformations.join(',') + '/' 
    : '';

  return `${baseUrl}/video/upload/${transformString}${publicId}`;
};

