// import { categoryProducts } from "@/data/categoryProducts";
// import { notFound } from "next/navigation";
// import Image from "next/image";
// import { Button } from "@/components/ui/Buttonn";
// // import { formatPrice } from "@/lib/utils";

// interface ProductPageProps {
//   params: Promise<{
//     id: string;
//   }>;
// }

// export default async function ProductPage({ params }: ProductPageProps) {
//   const { id } = await params;

//   // Find product across all categories
//   let product = null;
//   for (const category of Object.values(categoryProducts)) {
//     const found = category.find((p: any) => p.id === id);
//     if (found) {
//       product = found;
//       break;
//     }
//   }

//   if (!product) {
//     notFound();
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
//           {/* Image Gallery */}
//           <div className="space-y-4">
//             <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
//               <Image
//                 src={product.images[0]}
//                 alt={product.name}
//                 width={800}
//                 height={1000}
//                 className="w-full h-full object-cover"
//                 priority
//               />
//             </div>
//             {product.images.length > 1 && (
//               <div className="grid grid-cols-4 gap-2">
//                 {product.images.map((image: string, index: number) => (
//                   <div
//                     key={index}
//                     className="aspect-[3/4] rounded-md overflow-hidden bg-gray-100"
//                   >
//                     <Image
//                       src={image}
//                       alt={`${product.name} ${index + 1}`}
//                       width={200}
//                       height={250}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Product Info */}
//           <div className="space-y-6">
//             {/* Title and Price */}
//             <div>
//               <h1 className="text-3xl font-light tracking-tight text-gray-900">
//                 {product.name}
//               </h1>
//               <div className="mt-4 flex items-baseline space-x-2">
//                 <span className="text-3xl font-light text-gray-900">
//                   {/* {formatPrice(product.price)} */}
//                   200
//                 </span>
//               </div>
//             </div>

//             {/* Description */}
//             <div>
//               <h3 className="text-sm font-medium text-gray-900">Description</h3>
//               <p className="mt-2 text-sm text-gray-600">
//                 {product.description}
//               </p>
//             </div>

//             {/* Color Selection */}
//             <div>
//               <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
//               <div className="flex flex-wrap gap-2">
//                 {product.colors.map((color: string) => (
//                   <button
//                     key={color}
//                     className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:border-gray-400"
//                   >
//                     {color}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Size Selection */}
//             <div>
//               <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
//               <div className="flex flex-wrap gap-2">
//                 {product.sizes.map((size: string) => (
//                   <button
//                     key={size}
//                     className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:border-gray-400"
//                   >
//                     {size}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="space-y-4">
//               <Button className="w-full bg-black text-white hover:bg-gray-800">
//                 Add to Cart
//               </Button>
//               <Button className="w-full bg-white text-black border border-black hover:bg-gray-100">
//                 Buy Now
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Generate static params for all products
// export async function generateStaticParams() {
//   const allProducts = Object.values(categoryProducts).flat();
//   return allProducts.map((product: any) => ({
//     id: product.id,
//   }));
// }
