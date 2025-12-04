'use client';

import Image from 'next/image';

export default function AdBanner() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-red-900/10" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* First Ad Image Section */}
          <div className="group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-700 hover:scale-105 hover:shadow-3xl">
            <div className="aspect-[4/3] relative">
              <Image
                src="/adsimage.jpg"
                alt="Rare and Luxurious Fashion Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 border border-white/20 rounded-2xl" />
            </div>
          </div>
          
          {/* Second Ad Image Section */}
          <div className="group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-700 hover:scale-105 hover:shadow-3xl">
            <div className="aspect-[4/3] relative">
              <Image
                src="/ads2.png"
                alt="Exclusive Designer Collection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 border border-white/20 rounded-2xl" />
            </div>
          </div>
        </div>
        
        {/* Text Content Section - Now below the images */}
        <div className="mt-16 space-y-8 max-w-5xl mx-auto">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-6">
            The Art of Rare Luxury
          </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-red-600 to-red-800 mx-auto rounded-full" />
          </div>
          
          <div className="space-y-6 text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
            <p className="text-lg md:text-xl font-light">
              In the world of haute couture, rarity defines true luxury. Each piece in our exclusive collection represents the pinnacle of craftsmanship, where master artisans dedicate countless hours to create garments that transcend mere fashion to become wearable art.
            </p>
            
            <p className="text-base md:text-lg">
              From the finest Italian leather that has been hand-selected for its exceptional grain and texture, to the rare Mongolian cashmere woven into impossibly soft fabrics, every material tells a story of uncompromising quality. Our limited-edition pieces feature intricate embroidery techniques passed down through generations, with some designs requiring over 200 hours of meticulous handwork by skilled craftspeople.
            </p>
            
            <p className="text-base md:text-lg font-medium text-gray-800">
              These are not just clothes—they are heirlooms in the making. Each collection is produced in strictly limited quantities, ensuring that when you invest in one of our rare pieces, you join an exclusive circle of discerning individuals who understand that true luxury lies not in ostentation, but in the quiet confidence of wearing something genuinely extraordinary.
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="flex justify-center space-x-4 mt-12">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
