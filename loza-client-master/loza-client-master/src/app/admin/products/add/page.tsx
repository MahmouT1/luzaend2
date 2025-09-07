"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, UploadIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateProductMutation } from "@/redux/features/products/productApi";
import { useGetCategoriesQuery } from "@/redux/features/categories/categoryApi";
import AddSize from "./Sizes";

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [createProduct, { isLoading: createLoading, isSuccess, error }] =
    useCreateProductMutation();
  const { data } = useGetCategoriesQuery({});
  const [productInfo, setProductInfo] = useState([
    {
      size: "",
      quantity: 0,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    discountPrice: 0,
    points: 0,
    category: "",
    images: [] as string[],
    coverImage: "",
    info: productInfo,
    // Scheduled Release Feature
    isScheduled: false,
    releaseDate: "",
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target;
    
    // Convert number inputs to numbers
    const processedValue = type === 'number' ? Number(value) || 0 : 
                          type === 'checkbox' ? checked : value;
    
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
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
    setCoverImagePreview("");
    setFormData((prev) => ({
      ...prev,
      coverImage: "",
    }));
  };

  const removeAdditionalImage = (index: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      info: productInfo,
    }));
  }, [productInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || !formData.price || !formData.coverImage) {
      toast.error("Please fill all required fields including cover image");
    } else {
      if (!createLoading) {
        await createProduct({ data: formData });
      }
    }
  };

  useEffect(() => {
    if (data) {
      setCategories(data.categories);
    }
    if (isSuccess) {
      toast.success("Product created Successfully!");
      router.push("/admin/products");
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [error, isSuccess, createLoading, data]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">Add a new product to your store</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border p-6 space-y-6"
        >
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter product description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($)
              </label>
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
                Discount Price ($)
              </label>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points Earned
              </label>
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
                Points customer earns when purchasing this product (optional)
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

          {/* Scheduled Release Feature */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Scheduled Release</h3>
                <p className="text-sm text-gray-600">Set a release date for this product (optional)</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="isScheduled"
                  checked={formData.isScheduled}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Schedule this product for future release
                </label>
              </div>

              {formData.isScheduled && (
                <div className="ml-8 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Release Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      name="releaseDate"
                      value={formData.releaseDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Product will be locked until this date and time
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Scheduled Product Behavior</p>
                        <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                          <li>• Product will appear with a lock icon and transparent overlay</li>
                          <li>• Release date will be displayed to customers</li>
                          <li>• Product will automatically unlock at the specified date/time</li>
                          <li>• Customers cannot purchase until release date</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-left"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <AddSize
              productInfo={productInfo}
              setProductInfo={setProductInfo}
            />
          </div>
          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image <span className="text-red-500">*</span>
            </label>
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
                  Click to upload cover image
                </span>
                <span className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </span>
              </label>
            </div>

            {coverImagePreview && (
              <div className="mt-4">
                <div className="relative inline-block">
                  <img
                    src={coverImagePreview}
                    alt="Cover Preview"
                    className="w-32 h-40 object-cover rounded-lg border-2 border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={removeCoverImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-blue-600 mt-1">✓ Cover image selected</p>
              </div>
            )}
          </div>

          {/* Additional Images Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Images (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleAdditionalImagesUpload}
                className="hidden"
                id="additional-images-upload"
              />
              <label
                htmlFor="additional-images-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <UploadIcon className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload additional images
                </span>
                <span className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB each
                </span>
              </label>
            </div>

            {previewImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  Additional Images ({previewImages.length})
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {previewImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Additional ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeAdditionalImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => router.push("/admin/products")}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition duration-200"
            >
              {!createLoading ? "Add Product" : "Creating..."}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
