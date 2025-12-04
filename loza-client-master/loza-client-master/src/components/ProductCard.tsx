import { Product } from '@/types/product'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group">
<Link href={`/admin/products/${product.id}`}>
        <div className="relative overflow-hidden rounded-lg bg-gray-50">
          <div className="aspect-w-3 aspect-h-4">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={400}
              height={500}
              className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          {product.featured && (
            <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs font-medium rounded">
              FEATURED
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-black transition-colors">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
          
          <div className="mt-2 flex items-center space-x-2">
            <p className="text-lg font-medium text-gray-900">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
