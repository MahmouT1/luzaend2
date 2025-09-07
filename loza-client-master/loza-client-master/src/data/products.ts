import { Product } from "@/types/product";

export const products: any = [
  {
    id: "1",
    name: "Elegant Silk Evening Dress",
    price: 1299,
    originalPrice: 1599,
    category: "Dresses",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Luxurious silk evening dress with intricate beadwork and flowing silhouette. Perfect for special occasions.",
    inStock: true,
    featured: true,
  },
  {
    id: "2",
    name: "Tailored Wool Blazer",
    price: 899,
    category: "Suits",
    images: [
      "https://images.unsplash.com/photo-1593032465177-4d65d6f2ea2e?w=800",
      "https://images.unsplash.com/photo-1593032465177-4d65d6f2ea2e?w=800",
    ],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Premium wool blazer with gold-tone buttons and impeccable tailoring. A timeless investment piece.",
    inStock: true,
    newArrival: true,
  },
  {
    id: "3",
    name: "Cashmere Turtleneck Sweater",
    price: 599,
    category: "Knitwear",
    images: [
      "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800",
      "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800",
    ],
    sizes: ["XS", "S", "M", "L"],
    description:
      "Ultra-soft cashmere turtleneck in rich camel color. The epitome of luxury comfort.",
    inStock: true,
  },
  {
    id: "4",
    name: "Leather Ankle Boots",
    price: 799,
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
    ],
    sizes: ["36", "37", "38", "39", "40", "41"],
    description:
      "Italian leather ankle boots with gold hardware and comfortable block heel. Sophisticated and versatile.",
    inStock: true,
    featured: true,
  },
  {
    id: "5",
    name: "Silk Scarf Collection",
    price: 299,
    category: "Accessories",
    images: [
      "https://images.unsplash.com/photo-1601370552761-d129028bd833?w=800",
      "https://images.unsplash.com/photo-1601370552761-d129028bd833?w=800",
    ],
    sizes: ["One Size"],
    description:
      "Hand-printed silk scarves in exclusive Loza patterns. The perfect finishing touch to any outfit.",
    inStock: true,
    newArrival: true,
  },
  {
    id: "6",
    name: "Velvet Evening Jacket",
    price: 1099,
    originalPrice: 1399,
    category: "Suits",
    images: [
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800",
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=800",
    ],
    sizes: ["S", "M", "L"],
    description:
      "Luxurious velvet evening jacket with satin lapels. Perfect for formal events and special occasions.",
    inStock: true,
  },
];

export const categories = [
  {
    id: "1",
    name: "Dresses",
    slug: "dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
  },
  {
    id: "2",
    name: "Suits",
    slug: "suits",
    image: "https://images.unsplash.com/photo-1593032465177-4d65d6f2ea2e?w=400",
  },
  {
    id: "3",
    name: "Knitwear",
    slug: "knitwear",
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400",
  },
  {
    id: "4",
    name: "Shoes",
    slug: "shoes",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
  },
  {
    id: "5",
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1601370552761-d129028bd833?w=400",
  },
];
