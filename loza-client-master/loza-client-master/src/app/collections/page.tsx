import React from 'react';
import Link from 'next/link';

const collections = [
  {
    name: 'Elegance Redefined',
    description: 'Timeless pieces that blend classic beauty with modern sophistication.',
    href: '#',
    imageSrc: '/placeholder-collection-1.jpg',
  },
  {
    name: 'Heritage Collection',
    description: 'Celebrating traditional craftsmanship with contemporary designs.',
    href: '#',
    imageSrc: '/placeholder-collection-2.jpg',
  },
  {
    name: 'Modern Minimalist',
    description: 'Clean lines and simple elegance for the contemporary woman.',
    href: '#',
    imageSrc: '/placeholder-collection-3.jpg',
  },
  {
    name: 'Statement Pieces',
    description: 'Bold designs that make a lasting impression.',
    href: '#',
    imageSrc: '/placeholder-collection-4.jpg',
  },
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light tracking-tight text-gray-900 sm:text-4xl">
            Our Collections
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Discover the perfect piece for every occasion and style.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {collections.map((collection, index) => (
            <Link key={collection.name} href={collection.href} className="group">
              <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Collection {index + 1}</span>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">{collection.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{collection.description}</p>
              <p className="mt-2 text-sm font-medium text-gray-900 group-hover:underline">
                View collection →
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-16 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-light text-gray-900 mb-6">The Art of Jewelry Making</h2>
          <div className="prose prose-lg text-gray-500 max-w-3xl">
            <p>
              Each of our collections is born from a passion for exceptional craftsmanship and timeless 
              design. We work with skilled artisans who bring decades of experience to every piece, 
              ensuring that each item meets our exacting standards of quality and beauty.
            </p>
            <p className="mt-4">
              From the initial sketch to the final polish, our process combines traditional techniques 
              with modern innovation, resulting in jewelry that tells a story and becomes a cherished 
              part of your personal collection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
