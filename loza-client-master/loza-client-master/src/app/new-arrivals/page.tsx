import React from 'react';

export default function NewArrivalsPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-8">New Arrivals</h1>
        
        <div className="mb-12">
          <p className="text-gray-600 mb-6">
            Discover our latest collection of handcrafted jewelry pieces. Each item is meticulously designed 
            to bring out the beauty of traditional craftsmanship with a modern twist.
          </p>
          
          {/* Placeholder for product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="border rounded-lg overflow-hidden">
                <div className="aspect-square bg-gray-100"></div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900">New Collection {item}</h3>
                  <p className="text-gray-500">$99.99</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-light text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-4">
            Sign up for our newsletter to be the first to know about new arrivals and exclusive offers.
          </p>
          <div className="flex max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button className="bg-black text-white px-6 py-2 rounded-r-md hover:bg-gray-800 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
