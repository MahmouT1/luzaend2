'use client';

import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-gray-900 mb-4 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Our Story</h1>
          <p className="text-xl text-gray-600 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Discover the essence of LUZA'S CULTURE</p>
        </div>

        {/* Main Content */}
        <div className="prose prose-lg max-w-none" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <section className="mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-6 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Who We Are</h2>
            <p className="text-gray-700 leading-relaxed mb-4 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              LUZA'S CULTURE is more than just a fashion brand—it's a celebration of elegance, 
              sophistication, and timeless style. Founded with a vision to bring luxury fashion 
              to discerning customers, we curate collections that reflect the finest in contemporary 
              design and craftsmanship.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Our mission is to empower individuals to express their unique style through carefully 
              selected pieces that blend modern aesthetics with classic elegance. Every garment in 
              our collection is chosen for its quality, design, and ability to make a statement.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-6 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Our Vision</h2>
            <p className="text-gray-700 leading-relaxed mb-4 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              We envision a world where fashion is accessible, sustainable, and empowering. 
              LUZA'S CULTURE strives to be at the forefront of the luxury fashion industry, 
              offering our customers not just clothing, but an experience that reflects their 
              values and aspirations.
            </p>
            <p className="text-gray-700 leading-relaxed font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Our commitment extends beyond fashion—we aim to create a community of style-conscious 
              individuals who appreciate quality, authenticity, and the art of dressing well.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-6 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>What Sets Us Apart</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-light text-gray-900 mb-2 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Curated Collections</h3>
                <p className="text-gray-700 leading-relaxed font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Each piece in our collection is carefully selected to ensure it meets our high 
                  standards for quality, design, and style. We work with trusted designers and 
                  manufacturers to bring you the best in luxury fashion.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-light text-gray-900 mb-2 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Customer-Centric Approach</h3>
                <p className="text-gray-700 leading-relaxed font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Your satisfaction is our priority. We provide exceptional customer service, 
                  easy returns, and a seamless shopping experience from browsing to delivery.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-light text-gray-900 mb-2 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Quality Assurance</h3>
                <p className="text-gray-700 leading-relaxed font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  We stand behind every product we sell. Our quality assurance process ensures 
                  that every item meets our rigorous standards before it reaches you.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-6 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Our Commitment</h2>
            <p className="text-gray-700 leading-relaxed mb-4 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              At LUZA'S CULTURE, we are committed to providing you with an exceptional shopping 
              experience. We continuously strive to improve our services, expand our collections, 
              and maintain the highest standards of quality and customer care.
            </p>
            <p className="text-gray-700 leading-relaxed font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Thank you for being part of the LUZA'S CULTURE family. We look forward to helping 
              you discover your perfect style.
            </p>
          </section>
        </div>

        {/* Contact Section */}
        <div className="mt-16 p-8 bg-gray-50 rounded-lg">
          <h3 className="text-2xl font-light text-gray-900 mb-4 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Get in Touch</h3>
          <p className="text-gray-700 mb-4 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Have questions about our story or want to learn more? We'd love to hear from you.
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

