import React from 'react';
import Image from 'next/image';

const BrandBanner = () => {
  return (
    <section className="w-full bg-white py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Image Section */}
        <div className="relative w-full mb-6 sm:mb-8 md:mb-10 flex justify-center">
          <div className="relative w-full max-w-4xl h-[150px] sm:h-[200px] md:h-[280px] lg:h-[350px] rounded-lg overflow-hidden">
            <Image
              src="/bann.png"
              alt="LUZA'S CULTURE - The best way to stand out and be different"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            />
          </div>
        </div>

        {/* Brand Text Section */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed font-light tracking-wide">
            At <span className="font-semibold text-gray-800">LUZA'S CULTURE</span>, we believe in the power of individuality and self-expression. 
            Our carefully curated collection represents more than just fashion—it's a statement of distinction, 
            a celebration of uniqueness, and a commitment to excellence. Every piece is designed to help you 
            stand out, embrace your authentic self, and make a lasting impression. 
            <span className="block mt-3 sm:mt-4">
              The best way to stand out and be different.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default BrandBanner;

