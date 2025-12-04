import React from 'react';
import Link from 'next/link';

const giftCategories = [
  {
    name: 'For Her',
    description: 'Elegant pieces for the special woman in your life.',
    href: '#',
  },
  {
    name: 'For Him',
    description: 'Sophisticated jewelry for the modern gentleman.',
    href: '#',
  },
  {
    name: 'Anniversary Gifts',
    description: 'Celebrate love with timeless pieces.',
    href: '#',
  },
  {
    name: 'Birthday Gifts',
    description: 'Make their day extra special.',
    href: '#',
  },
];

const priceRanges = [
  { name: 'Under $100', href: '#' },
  { name: '$100 - $250', href: '#' },
  { name: '$250 - $500', href: '#' },
  { name: 'Over $500', href: '#' },
];

export default function GiftsPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light tracking-tight text-gray-900 sm:text-4xl mb-4">
            The Perfect Gift Awaits
          </h1>
          <p className="max-w-2xl mx-auto text-base text-gray-500">
            Thoughtful jewelry gifts for every occasion and budget.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-xl font-light text-gray-900 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            {giftCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-black"
              >
                <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100 group-hover:opacity-75 h-48">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">{category.name} Image</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <h2 className="text-xl font-light text-gray-900 mb-6">Gift Guide</h2>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help Choosing?</h3>
              <p className="text-gray-600 mb-6">
                Our expert team has curated these gift collections to help you find the perfect piece 
                for any occasion. Whether you're celebrating a birthday, anniversary, or just because, 
                we have something special for everyone.
              </p>
              <div className="space-y-4">
                {[
                  'Personalized jewelry recommendations',
                  'Complimentary gift wrapping',
                  'Free shipping on all orders',
                  'Hassle-free returns',
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-light text-gray-900 mb-6">Shop by Price</h2>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {priceRanges.map((range) => (
                  <li key={range.name} className="p-4 hover:bg-gray-50">
                    <Link href={range.href} className="flex items-center justify-between">
                      <span className="text-gray-900">{range.name}</span>
                      <svg
                        className="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Gift Cards</h3>
              <p className="text-gray-600 mb-4">
                Let them choose exactly what they love with a gift card.
              </p>
              <Link
                href="/gift-cards"
                className="inline-flex items-center text-black font-medium hover:underline"
              >
                Shop Gift Cards
                <svg
                  className="ml-1 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-200 pt-12">
          <div className="text-center">
            <h2 className="text-2xl font-light text-gray-900 mb-4">Still Unsure?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Our personal shoppers are here to help you find the perfect gift. Contact us for 
              personalized recommendations and styling advice.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Contact a Stylist
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
