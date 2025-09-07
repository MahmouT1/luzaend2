// Centralized product management service
import { products } from '@/data/products';
import { categoryProducts } from '@/data/categoryProducts';

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  stock: number;
  featured?: boolean;
  newArrival?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

class ProductService {
  private products: AdminProduct[] = [];

  constructor() {
    this.initializeProducts();
  }

  private initializeProducts() {
    // Initialize with actual products data
    this.products = [
      ...products.map(p => ({
        ...p,
        stock: 20,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      ...Object.entries(categoryProducts).flatMap(([category, items]) =>
        items.map(item => ({
          ...item,
          category,
          stock: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
      )
    ];
  }

  getAllProducts(): AdminProduct[] {
    return this.products;
  }

  getProductById(id: string): AdminProduct | undefined {
    return this.products.find(p => p.id === id);
  }

  addProduct(product: Omit<AdminProduct, 'id' | 'createdAt' | 'updatedAt'>): AdminProduct {
    const newProduct: AdminProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<AdminProduct>): AdminProduct | undefined {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.products[index];
  }

  deleteProduct(id: string): boolean {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.products.splice(index, 1);
    return true;
  }

  searchProducts(query: string): AdminProduct[] {
    const lowerQuery = query.toLowerCase();
    return this.products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );
  }

  filterByCategory(category: string): AdminProduct[] {
    if (category === 'all') return this.products;
    return this.products.filter(p => p.category === category);
  }

  getCategories(): string[] {
    return [...new Set(this.products.map(p => p.category))];
  }
}

export const productService = new ProductService();
