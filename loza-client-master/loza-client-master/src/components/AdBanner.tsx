'use client';

import Image from 'next/image';

export default function AdBanner() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* First Ad Image Section */}
          <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
            <div className="aspect-[4/3] relative">
              <Image
                src="/adsimage.jpg"
                alt="Rare and Luxurious Fashion Collection"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          
          {/* Second Ad Image Section */}
          <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
            <div className="aspect-[4/3] relative">
              <Image
                src="/ads2.png"
                alt="Exclusive Designer Collection"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
        
        {/* Text Content Section - Now below the images */}
        <div className="mt-12 space-y-6 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 text-center">
            The Art of Rare Luxury
          </h2>
          
          <div className="space-y-4 text-gray-700 leading-relaxed text-center">
            <p>
              In the world of haute couture, rarity defines true luxury. Each piece in our exclusive collection represents the pinnacle of craftsmanship, where master artisans dedicate countless hours to create garments that transcend mere fashion to become wearable art.
            </p>
            
            <p>
              From the finest Italian leather that has been hand-selected for its exceptional grain and texture, to the rare Mongolian cashmere woven into impossibly soft fabrics, every material tells a story of uncompromising quality. Our limited-edition pieces feature intricate embroidery techniques passed down through generations, with some designs requiring over 200 hours of meticulous handwork by skilled craftspeople.
            </p>
            
            <p>
              These are not just clothes—they are heirlooms in the making. Each collection is produced in strictly limited quantities, ensuring that when you invest in one of our rare pieces, you join an exclusive circle of discerning individuals who understand that true luxury lies not in ostentation, but in the quiet confidence of wearing something genuinely extraordinary.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
