import React from 'react';

export default function PersonalShoppingPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-6">
            Personal Shopping
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500">
            Experience the luxury of personalized attention from our expert stylists.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-6">Your Personal Styling Experience</h2>
            <p className="text-gray-600 mb-6">
              Our personal shopping service offers a curated, one-on-one experience with our expert stylists 
              who will help you discover pieces that perfectly match your style, occasion, and budget.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                'One-on-one virtual or in-store consultations',
                'Personalized style recommendations',
                'Exclusive access to new collections',
                'Complimentary alterations and styling advice',
                'After-hours appointments available'
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <button className="bg-black text-white px-8 py-3 rounded-md text-base font-medium hover:bg-gray-800 transition-colors">
              Book a Consultation
            </button>
          </div>
          <div className="bg-gray-100 aspect-[4/5] rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Personal Shopping Experience</span>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-xl mb-16">
          <h2 className="text-2xl font-light text-center text-gray-900 mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Book Your Appointment',
                description: 'Schedule a time that works for you for either an in-store or virtual consultation.'
              },
              {
                step: '2',
                title: 'Style Consultation',
                description: 'Share your style preferences, occasion, and budget with your personal stylist.'
              },
              {
                step: '3',
                title: 'Receive Recommendations',
                description: 'Get a curated selection of pieces tailored just for you.'
              }
            ].map((item) => (
              <div key={item.step} className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl font-medium mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-2xl font-light text-gray-900 mb-6">Gift Personal Shopping</h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8">
            Give the gift of a personalized shopping experience. Our gift certificates are perfect for 
            those who appreciate exceptional service and personalized attention.
          </p>
          <button className="bg-white border border-black text-black px-8 py-3 rounded-md text-base font-medium hover:bg-gray-50 transition-colors">
            Purchase a Gift Certificate
          </button>
        </div>

        <div className="border-t border-gray-200 pt-12">
          <div className="text-center">
            <h2 className="text-2xl font-light text-gray-900 mb-4">Ready to Begin?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              Contact our personal shopping team to schedule your appointment or learn more about our services.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-black text-white px-8 py-3 rounded-md text-base font-medium hover:bg-gray-800 transition-colors">
                Contact Us
              </button>
              <button className="bg-white border border-black text-black px-8 py-3 rounded-md text-base font-medium hover:bg-gray-50 transition-colors">
                Call: (555) 123-4567
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
