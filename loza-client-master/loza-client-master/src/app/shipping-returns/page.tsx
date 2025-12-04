'use client';

import React from 'react';
import { Package, Truck, RefreshCw, Shield } from 'lucide-react';

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-gray-900 mb-4 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Shipping & Returns</h1>
          <p className="text-xl text-gray-600 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Everything you need to know about shipping and returns</p>
        </div>

        {/* Shipping Section */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Truck className="w-8 h-8 text-black mr-3" />
            <h2 className="text-3xl font-light text-gray-900 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Shipping Information</h2>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-light text-gray-900 mb-3 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Shipping Methods</h3>
              <p className="text-gray-700 mb-4 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                We offer various shipping options to ensure your order arrives safely and on time:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <li><strong className="font-medium">Standard Shipping:</strong> 5-7 business days</li>
                <li><strong className="font-medium">Express Shipping:</strong> 2-3 business days</li>
                <li><strong className="font-medium">Overnight Shipping:</strong> Next business day (available for select areas)</li>
              </ul>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-light text-gray-900 mb-3 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Shipping Costs</h3>
              <p className="text-gray-700 mb-4 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Shipping costs are calculated at checkout based on your location and selected shipping method. 
                Free shipping may be available for orders over a certain amount.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-light text-gray-900 mb-3 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Order Processing</h3>
              <p className="text-gray-700 mb-4 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Orders are typically processed within 1-2 business days. You will receive a confirmation 
                email with your order details and tracking information once your order ships.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-light text-gray-900 mb-3 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Tracking Your Order</h3>
              <p className="text-gray-700 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Once your order ships, you'll receive a tracking number via email. You can use this number 
                to track your package's journey to your doorstep.
              </p>
            </div>
          </div>
        </section>

        {/* Returns Section */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <RefreshCw className="w-8 h-8 text-black mr-3" />
            <h2 className="text-3xl font-light text-gray-900 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Returns & Exchanges</h2>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-light text-gray-900 mb-3 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Return Policy</h3>
              <p className="text-gray-700 mb-4 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                We want you to be completely satisfied with your purchase. If you're not happy with your 
                order, you can return it within 30 days of delivery for a full refund or exchange.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <li>Items must be unworn, unwashed, and in original condition with tags attached</li>
                <li>Original packaging should be included when possible</li>
                <li>Returns must be initiated within 30 days of delivery</li>
              </ul>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-light text-gray-900 mb-3 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>How to Return</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <li>Contact our customer service team to initiate a return</li>
                <li>Receive a return authorization and shipping label</li>
                <li>Package your items securely with the original packaging</li>
                <li>Ship the package using the provided return label</li>
                <li>Once received, we'll process your refund or exchange within 5-7 business days</li>
              </ol>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-light text-gray-900 mb-3 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Exchanges</h3>
              <p className="text-gray-700 mb-4 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Need a different size or color? We're happy to help with exchanges. Simply follow the 
                return process and specify your exchange preference when contacting customer service.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-light text-gray-900 mb-3 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Refund Processing</h3>
              <p className="text-gray-700 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Refunds will be processed to the original payment method within 5-7 business days 
                after we receive your returned items. You'll receive an email confirmation once 
                the refund has been processed.
              </p>
            </div>
          </div>
        </section>

        {/* Exceptions */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Shield className="w-8 h-8 text-black mr-3" />
            <h2 className="text-3xl font-light text-gray-900 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Important Notes</h2>
          </div>

          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-xl font-light text-gray-900 mb-3 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Non-Returnable Items</h3>
            <p className="text-gray-700 mb-4 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              For hygiene and safety reasons, the following items cannot be returned:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <li>Items that have been worn, washed, or damaged</li>
              <li>Items without original tags or packaging</li>
              <li>Personalized or customized items</li>
              <li>Items purchased on final sale</li>
            </ul>
          </div>
        </section>

        {/* Contact Section */}
        <div className="mt-16 p-8 bg-gray-50 rounded-lg text-center">
          <h3 className="text-2xl font-light text-gray-900 mb-4 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Need Help?</h3>
          <p className="text-gray-700 mb-6 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            If you have any questions about shipping or returns, our customer service team is here to help.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-light tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}

