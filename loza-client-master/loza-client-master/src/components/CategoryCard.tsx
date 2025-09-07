import Image from 'next/image'
import Link from 'next/link'

interface CategoryCardProps {
  name: string
  slug: string
  image: string
}

export function CategoryCard({ name, slug, image }: CategoryCardProps) {
  return (
    <Link href={`/categories/${slug}`} className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={image}
          alt={name}
          width={400}
          height={500}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-end p-6">
          <h3 className="text-white text-xl font-light tracking-tight">{name}</h3>
        </div>
      </div>
    </Link>
  )
}
