'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { PencilIcon, UploadIcon, XIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useGetSingleProductQuery, useUpdateProductMutation } from '@/redux/features/products/productApi';
import { useGetCategoriesQuery } from '@/redux/features/categories/categoryApi';
import AddSize from '../../add/Sizes';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  // Fetch product data
  const { data: productData, isLoading: isLoadingProduct, error: productError } = useGetSingleProductQuery(productId);
  const { data: categoriesData } = useGetCategoriesQuery({});
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [categories, setCategories] = useState([]);
  const [productInfo, setProductInfo] = useState([
    {
      size: "",
      quantity: 0,
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    discountPrice: 0,
    stock: 0,
    points: 0,
    pointsCash: 0,
    category: '',
    sizes: [] as string[],
    images: [] as string[],
    coverImage: '',
    info: productInfo,
    newArrival: true,
    // Scheduled Release Feature
    isScheduled: false,
    releaseDate: '',
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');

  // Load product data when it's fetched
  useEffect(() => {
    if (productData) {
      console.log('Product data loaded:', productData);
      
      // Extract sizes from info array
      const sizes = productData.info?.map((item: any) => item.size).filter(Boolean) || [];
      
      // Extract images - handle both string URLs and objects with url property
      const images = productData.images?.map((img: any) => 
        typeof img === 'string' ? img : (img?.url || img)
      ) || [];
      
      // Get cover image
      const coverImg = productData.coverImage || (images.length > 0 ? images[0] : '');
      
      setFormData({
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price || 0,
        discountPrice: productData.discountPrice || 0,
        stock: productData.info?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0,
        points: productData.points || 0,
        pointsCash: productData.pointsCash || 0,
        category: productData.category?._id || productData.category || '',
        sizes: sizes,
        images: images,
        coverImage: coverImg,
        info: productData.info || productInfo,
        newArrival: productData.newArrival !== false, // Default to true if not set
        isScheduled: productData.isScheduled || false,
        releaseDate: productData.releaseDate ? new Date(productData.releaseDate).toISOString().slice(0, 16) : '',
      });
      
      setPreviewImages(images);
      setCoverImagePreview(coverImg);
      setProductInfo(productData.info || productInfo);
    }
  }, [productData]);

  // Load categories
  useEffect(() => {
    if (categoriesData?.categories) {
      setCategories(categoriesData.categories);
    }
  }, [categoriesData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;
    
    // Convert number inputs to numbers
    const processedValue = type === 'number' ? Number(value) || 0 : 
                          type === 'checkbox' ? target.checked : value;
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleSizeChange = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setCoverImagePreview(URL.createObjectURL(file));
        setFormData((prev: any) => ({
          ...prev,
          coverImage: reader.result,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAdditionalImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    fileArray.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (reader.result) {
          // add preview
          setPreviewImages((prev) => [...prev, URL.createObjectURL(file)]);

          // add base64 image to formData
          setFormData((prev: any) => ({
            ...prev,
            images: [...prev.images, reader.result], // here it's base64 string
          }));
        }
      };

      reader.readAsDataURL(file); // convert to base64
    });
  };

  const removeCoverImage = () => {
    setCoverImagePreview('');
    setFormData(prev => ({ ...prev, coverImage: '' }));
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.coverImage && formData.images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    if (productInfo.length === 0 || productInfo.every(item => !item.size || item.quantity === 0)) {
      toast.error('Please add at least one size with quantity');
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        discountPrice: formData.discountPrice,
        points: formData.points,
        category: formData.category,
        info: productInfo,
        newArrival: formData.newArrival,
        isScheduled: formData.isScheduled,
        releaseDate: formData.isScheduled && formData.releaseDate ? new Date(formData.releaseDate).toISOString() : null,
        // Always include images (both existing URLs and new base64 uploads)
        images: formData.images,
        // Only include coverImage if it's a new upload (base64), otherwise keep existing
        ...(formData.coverImage && formData.coverImage.startsWith('data:') ? { coverImage: formData.coverImage } : {}),
      };

      await updateProduct({ data: updateData, id: productId }).unwrap();
      toast.success('Product updated successfully!');
    router.push('/admin/products');
    } catch (error: any) {
      console.error('Update product error:', error);
      toast.error(error?.data?.message || 'Failed to update product');
    }
  };

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  if (isLoadingProduct) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  if (productError) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load product data</p>
          <button
            onClick={() => router.push('/admin/products')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-2">Update product details</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter product description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (EGP) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Price ($) <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">
                If set, original price will be shown crossed out with discount price below
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Earned Points Instapay/Credit or Debit</label>
              <input
                type="number"
                name="points"
                value={formData.points}
                onChange={handleInputChange}
                min="0"
                step="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Points customer earns when purchasing with Instapay or Visa (optional)
              </p>
            </div>
            <div className="flex items-end">
              <div className="bg-blue-50 p-3 rounded-lg w-full">
                <p className="text-sm text-blue-800">
                  <strong>Points Value:</strong> {formData.points * 10} EGP
                </p>
                <p className="text-xs text-blue-600">
                  1 point = 10 EGP
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Earned Points Cash</label>
              <input
                type="number"
                name="pointsCash"
                value={formData.pointsCash}
                onChange={handleInputChange}
                min="0"
                step="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Points customer earns when purchasing with cash on delivery (optional)
              </p>
            </div>
            <div className="flex items-end">
              <div className="bg-green-50 p-3 rounded-lg w-full">
                <p className="text-sm text-green-800">
                  <strong>Points Value:</strong> {formData.pointsCash * 10} EGP
                </p>
                <p className="text-xs text-green-600">
                  1 point = 10 EGP
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Arrival</label>
              <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                  name="newArrival"
                  checked={formData.newArrival}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                <label className="ml-2 text-sm text-gray-700">Mark as new arrival</label>
              </div>
            </div>
          </div>

          {/* Sizes and Quantities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes & Quantities *</label>
            <AddSize productInfo={productInfo} setProductInfo={setProductInfo} />
          </div>

          {/* Scheduled Release */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="isScheduled"
                checked={formData.isScheduled}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">Schedule Release</label>
            </div>
            {formData.isScheduled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Release Date & Time</label>
                <input
                  type="datetime-local"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
            {coverImagePreview && (
              <div className="mb-4 relative inline-block">
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removeCoverImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
                className="hidden"
                id="cover-image-upload"
              />
              <label
                htmlFor="cover-image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <UploadIcon className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {coverImagePreview ? 'Change cover image' : 'Upload cover image'}
                </span>
                <span className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</span>
              </label>
            </div>
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Product Images</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleAdditionalImagesUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <UploadIcon className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Click to upload additional images</span>
                <span className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</span>
              </label>
            </div>

            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Updating...
                </span>
              ) : (
                'Update Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
