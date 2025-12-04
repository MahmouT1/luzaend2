'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PackageIcon, PlusIcon, PencilIcon, TrashIcon, ImageIcon } from 'lucide-react';
import { productService } from '@/lib/admin/productService';

interface SiteProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: string[];
  category: string;
  inStock: boolean;
  stock: number;
}

export default function SiteProductsPage() {
  const [products, setProducts] = useState<SiteProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    // Load products from centralized service
    const allProducts = productService.getAllProducts();
    setProducts(allProducts);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const success = productService.deleteProduct(productId);
      if (success) {
        setProducts(productService.getAllProducts());
      }
    }
  };

  const getStatusColor = (inStock: boolean, stock: number) => {
    if (!inStock || stock === 0) return 'bg-red-100 text-red-800';
    if (stock <= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (inStock: boolean, stock: number) => {
    if (!inStock || stock === 0) return 'Out of Stock';
    if (stock <= 5) return 'Low Stock';
    return 'In Stock';
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    const updatedProduct = productService.updateProduct(productId, { stock: newStock, inStock: newStock > 0 });
    if (updatedProduct) {
      setProducts(productService.getAllProducts());
    }
  };

  const categories = productService.getCategories();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Site Products Management</h1>
          <Link
            href="/admin-panel/products/add"
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
            {categories.map(category => (
              <option key={category} value={category}>{category.replace('-', ' ').toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-gray-800">${product.price}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.inStock, product.stock)}`}>
                    {getStatusText(product.inStock, product.stock)}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  <p>Stock: {product.stock} units</p>
                  <p>Sizes: {product.sizes.join(', ')}</p>
                  <p>Colors: {product.colors.join(', ')}</p>
                  <p>Category: {product.category.replace('-', ' ').toUpperCase()}</p>
                </div>

                {/* Stock Management */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Update Stock</label>
                  <input
                    type="number"
                    value={product.stock}
                    onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    min="0"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    href={`/admin-panel/products/${product.id}/edit`}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 text-sm text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <PackageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first product'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
