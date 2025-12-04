'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'How do I place an order?',
    answer: 'Placing an order is easy! Simply browse our collection, select your desired items, add them to your cart, and proceed to checkout. You\'ll need to create an account or sign in, provide your shipping information, and complete the payment.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and secure online payment methods. All transactions are processed securely through our encrypted payment gateway.'
  },
  {
    question: 'How long does shipping take?',
    answer: 'Shipping times vary based on your location and selected shipping method. Standard shipping typically takes 5-7 business days, express shipping takes 2-3 business days, and overnight shipping is available for next business day delivery in select areas.'
  },
  {
    question: 'Can I track my order?',
    answer: 'Yes! Once your order ships, you\'ll receive a confirmation email with a tracking number. You can use this number to track your package\'s journey in real-time through our website or the carrier\'s website.'
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy. Items must be unworn, unwashed, and in original condition with tags attached. Simply contact our customer service team to initiate a return, and we\'ll provide you with a return authorization and shipping label.'
  },
  {
    question: 'How do I exchange an item?',
    answer: 'To exchange an item, follow the same process as a return. When contacting customer service, specify that you\'d like to exchange the item and mention your preferred size or color. We\'ll process the exchange once we receive your returned item.'
  },
  {
    question: 'What if my item arrives damaged or defective?',
    answer: 'We\'re sorry to hear that! Please contact our customer service team immediately with photos of the damaged item and your order number. We\'ll arrange for a replacement or full refund at no cost to you.'
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Currently, we ship within our primary service area. For international shipping inquiries, please contact our customer service team, and we\'ll do our best to accommodate your needs.'
  },
  {
    question: 'How do I know what size to order?',
    answer: 'Each product page includes a detailed size guide with measurements. We recommend reviewing the size guide before placing your order. If you\'re still unsure, our customer service team can help you find the perfect fit.'
  },
  {
    question: 'Can I cancel or modify my order?',
    answer: 'Orders can be cancelled or modified within 24 hours of placement, provided they haven\'t been shipped yet. Contact our customer service team as soon as possible to make changes to your order.'
  },
  {
    question: 'Do you offer gift wrapping?',
    answer: 'Yes! We offer gift wrapping services for an additional fee. You can select this option during checkout and include a personalized message for the recipient.'
  },
  {
    question: 'How do I care for my items?',
    answer: 'Care instructions are provided on each product page and on the garment\'s care label. We recommend following these instructions to maintain the quality and longevity of your items. For specific care questions, feel free to contact us.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-gray-900 mb-4 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Find answers to common questions about shopping with us</p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                <span className="text-lg font-light text-gray-900 pr-4 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 p-8 bg-gray-50 rounded-lg text-center">
          <h3 className="text-2xl font-light text-gray-900 mb-4 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Still have questions?</h3>
          <p className="text-gray-700 mb-6 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Can't find what you're looking for? Our customer service team is ready to help.
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

