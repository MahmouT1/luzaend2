import React from 'react';

const giftCards = [
  {
    id: 1,
    name: 'Classic Gift Card',
    price: 100,
    description: 'The perfect gift for any occasion',
    image: '/gift-card-classic.jpg',
  },
  {
    id: 2,
    name: 'Luxury Gift Card',
    price: 250,
    description: 'For those who appreciate the finer things',
    image: '/gift-card-luxury.jpg',
  },
  {
    id: 3,
    name: 'Premium Gift Card',
    price: 500,
    description: 'The ultimate jewelry shopping experience',
    image: '/gift-card-premium.jpg',
  },
  {
    id: 4,
    name: 'Custom Amount',
    price: 0,
    description: 'Choose your own amount',
    image: '/gift-card-custom.jpg',
  },
];

export default function GiftCardsPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light tracking-tight text-gray-900 sm:text-5xl mb-4">Gift Cards</h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500">
            The perfect present for any occasion
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {giftCards.map((card) => (
            <div key={card.id} className="group relative">
              <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-lg overflow-hidden group-hover:opacity-75">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">{card.name}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {card.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{card.description}</p>
                </div>
                <p className="text-lg font-medium text-gray-900">
                  {card.price > 0 ? `$${card.price}` : 'Custom'}
                </p>
              </div>
              <button className="mt-4 w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors">
                Purchase
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-8 rounded-xl mb-16">
          <h2 className="text-2xl font-light text-center text-gray-900 mb-8">Gift Card Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">How to Use</h3>
              <ul className="space-y-3">
                {[
                  'Gift cards can be redeemed online or in-store',
                  'No expiration date',
                  'Not redeemable for cash',
                  'Can be used for multiple purchases until balance is depleted'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {[
                  {
                    question: 'How do I check my gift card balance?',
                    answer: 'You can check your balance online or by contacting our customer service.'
                  },
                  {
                    question: 'Can I use multiple gift cards for one purchase?',
                    answer: 'Yes, you can use multiple gift cards for a single purchase.'
                  },
                  {
                    question: 'What if my gift card is lost or stolen?',
                    answer: 'Please contact us immediately. We can help protect your balance with proof of purchase.'
                  }
                ].map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <h4 className="font-medium text-gray-900">{faq.question}</h4>
                    <p className="mt-1 text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Our customer service team is here to help with any questions about gift cards or your purchase.
          </p>
          <button className="bg-black text-white px-8 py-3 rounded-md text-base font-medium hover:bg-gray-800 transition-colors">
            Contact Customer Service
          </button>
        </div>
      </div>
    </div>
  );
}
