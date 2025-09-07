"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PackageIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ImageIcon,
} from "lucide-react";
import { productService } from "@/lib/admin/productService";
import { useGetProductsQuery, useDeleteProductMutation } from "@/redux/features/products/productApi";
import { useGetCategoriesQuery } from "@/redux/features/categories/categoryApi";
import toast from "react-hot-toast";

export default function SiteProductsPage() {
  const [products, setProducts] = useState([]);
  const {
    isLoading: isProductLoading,
    data: productData,
    refetch: refetchProduct,
  } = useGetProductsQuery({}, { refetchOnMountOrArgChange: true });
  const {
    isLoading: isCategoryLoading,
    data: categoryData,
    refetch: refetchCategory,
  } = useGetCategoriesQuery({}, { refetchOnMountOrArgChange: true });
  const [deleteProductMutation] = useDeleteProductMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    if (productData) setProducts(productData);
    if (categoryData) setCategories(categoryData.categories);
  }, [productData, categoryData]);

  // Filtered products based on search & category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" ||
      (product.category?.name && product.category.name === filterCategory);
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProductMutation(productId).unwrap();
        toast.success("Product deleted successfully");
        refetchProduct(); // Refresh the products list
      } catch (error) {
        toast.error("Failed to delete product");
        console.error("Delete product error:", error);
      }
    }
  };

  const getStatusColor = (inStock: boolean, stock: number) => {
    if (!inStock || stock === 0) return "bg-red-100 text-red-800";
    if (stock <= 5) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getStatusText = (inStock: boolean, stock: number) => {
    if (!inStock || stock === 0) return "Out of Stock";
    if (stock <= 5) return "Low Stock";
    return "In Stock";
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    const updatedProduct = productService.updateProduct(productId, {
      stock: newStock,
      inStock: newStock > 0,
    });
    if (updatedProduct) setProducts(productService.getAllProducts());
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Site Products Management
          </h1>
          <Link
            href="/admin/products/add"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200 flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add New Product
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories?.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name.replace("-", " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 col-span-full">
              <PackageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Get started by adding your first product"}
              </p>
            </div>
          ) : (
            filteredProducts.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border overflow-hidden"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={
                        typeof product.images[0] === 'string' 
                          ? product.images[0] 
                          : product.images[0]?.url || product.coverImage
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('Image failed to load:', e.currentTarget.src);
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-full h-full flex items-center justify-center"
                    style={{ display: product.images && product.images.length > 0 ? 'none' : 'flex' }}
                  >
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-gray-800">
                      price: ${product.price}
                    </span>
                    {/* <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        product.inStock,
                        product.quantity
                      )}`}
                    >
                      {getStatusText(product.inStock, product.quantity)}
                    </span> */}
                  </div>
                  <div>
                    <span className="text-[15px]  text-gray-800">
                      discountPrice: ${product.discountPrice}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    {/* <p>Stock: {product.quantity} units</p> */}
                    <p>
                      Category:{" "}
                      {product.category?.name?.replace("-", " ").toUpperCase()}
                    </p>
                  </div>

                  {/* Stock Management */}
                  {/* <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Update Stock
                    </label>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) =>
                        handleStockUpdate(
                          product.id,
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      min="0"
                    />
                  </div> */}

                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/products/${product._id}/edit`}
                      className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 text-sm text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
