/**
 * Media URLs Configuration
 * 
 * This file contains Cloudinary URLs for all media assets.
 * After uploading files to Cloudinary, replace the placeholder URLs with actual public IDs.
 * 
 * How to get the public ID after uploading:
 * 1. Upload file to Cloudinary dashboard
 * 2. Copy the public ID (e.g., "loza-media/video-one" or "loza-media/banner")
 * 3. Use the helper functions from @/lib/cloudinary to generate URLs
 */

import { getCloudinaryImageUrl, getCloudinaryVideoUrl } from '@/lib/cloudinary';

/**
 * Fallback URLs - These are the current local files
 * Keep them as fallback until all files are uploaded to Cloudinary
 */
const FALLBACK_URLS = {
  videoOne: '/VIDEO ONE.mp4',
  headerVideo: '/header.mp4',
  banner: '/bann.png',
  adsImage: '/adsimage.jpg',
  ads2: '/ads2.png',
  product1: '/proudct1.jpg',
  product2: '/proudct2.jpg',
  product3: '/proudct3.jpg',
  product4: '/proudct4.jpg',
  intro2: '/intro2.jpg',
  intro3: '/intro3.jpg',
  intro4: '/intro4.jpg',
};

/**
 * Cloudinary Public IDs
 * 
 * TODO: Replace these placeholder public IDs with actual ones after uploading to Cloudinary
 * Format: "folder-name/file-name" (without extension)
 */
const CLOUDINARY_IDS = {
  // Videos
  videoOne: 'VIDEO_ONE_z9xoei', // Public ID extracted from Cloudinary URL
  headerVideo: 'header_pmuotn', // Public ID extracted from Cloudinary URL
  
  // Images
  banner: '', // e.g., "loza-media/banner"
  adsImage: '', // e.g., "loza-media/ads-image"
  ads2: '', // e.g., "loza-media/ads-2"
  product1: '', // e.g., "loza-media/product-1"
  product2: '', // e.g., "loza-media/product-2"
  product3: '', // e.g., "loza-media/product-3"
  product4: '', // e.g., "loza-media/product-4"
  intro2: '', // e.g., "loza-media/intro-2"
  intro3: '', // e.g., "loza-media/intro-3"
  intro4: '', // e.g., "loza-media/intro-4"
};

/**
 * Helper function to get media URL
 * Returns Cloudinary URL if public ID exists, otherwise returns fallback
 */
const getMediaUrl = (
  cloudinaryId: string,
  fallback: string,
  type: 'image' | 'video' = 'image',
  options?: any
): string => {
  if (cloudinaryId && cloudinaryId.trim() !== '') {
    return type === 'video'
      ? getCloudinaryVideoUrl(cloudinaryId, options)
      : getCloudinaryImageUrl(cloudinaryId, options);
  }
  return fallback;
};

/**
 * Media URLs - Automatically uses Cloudinary if configured, otherwise falls back to local files
 * 
 * Usage:
 * import { mediaUrls } from '@/config/mediaUrls';
 * 
 * <video src={mediaUrls.videoOne} />
 * <img src={mediaUrls.banner} />
 */
export const mediaUrls = {
  // Videos
  videoOne: getMediaUrl(CLOUDINARY_IDS.videoOne, FALLBACK_URLS.videoOne, 'video', {
    quality: 'auto',
    format: 'auto',
  }),
  
  headerVideo: getMediaUrl(CLOUDINARY_IDS.headerVideo, FALLBACK_URLS.headerVideo, 'video', {
    quality: 'auto',
    format: 'auto',
  }),

  // Images
  banner: getMediaUrl(CLOUDINARY_IDS.banner, FALLBACK_URLS.banner, 'image', {
    width: 1920,
    quality: 'auto',
    format: 'auto',
  }),

  adsImage: getMediaUrl(CLOUDINARY_IDS.adsImage, FALLBACK_URLS.adsImage, 'image', {
    quality: 'auto',
    format: 'auto',
  }),

  ads2: getMediaUrl(CLOUDINARY_IDS.ads2, FALLBACK_URLS.ads2, 'image', {
    quality: 'auto',
    format: 'auto',
  }),

  product1: getMediaUrl(CLOUDINARY_IDS.product1, FALLBACK_URLS.product1, 'image', {
    width: 800,
    quality: 'auto',
    format: 'auto',
  }),

  product2: getMediaUrl(CLOUDINARY_IDS.product2, FALLBACK_URLS.product2, 'image', {
    width: 800,
    quality: 'auto',
    format: 'auto',
  }),

  product3: getMediaUrl(CLOUDINARY_IDS.product3, FALLBACK_URLS.product3, 'image', {
    width: 800,
    quality: 'auto',
    format: 'auto',
  }),

  product4: getMediaUrl(CLOUDINARY_IDS.product4, FALLBACK_URLS.product4, 'image', {
    width: 800,
    quality: 'auto',
    format: 'auto',
  }),

  intro2: getMediaUrl(CLOUDINARY_IDS.intro2, FALLBACK_URLS.intro2, 'image', {
    width: 1920,
    quality: 'auto',
    format: 'auto',
  }),

  intro3: getMediaUrl(CLOUDINARY_IDS.intro3, FALLBACK_URLS.intro3, 'image', {
    width: 1920,
    quality: 'auto',
    format: 'auto',
  }),

  intro4: getMediaUrl(CLOUDINARY_IDS.intro4, FALLBACK_URLS.intro4, 'image', {
    width: 1920,
    quality: 'auto',
    format: 'auto',
  }),
};

/**
 * Export Cloudinary IDs for easy updates
 */
export { CLOUDINARY_IDS, FALLBACK_URLS };

