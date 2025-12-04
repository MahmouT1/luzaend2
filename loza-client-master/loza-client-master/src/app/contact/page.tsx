'use client';

import React, { useState } from 'react';
import { Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-gray-900 mb-4 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Contact Us</h1>
          <p className="text-xl text-gray-600 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>We're here to help. Get in touch with us.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-light text-gray-900 mb-8 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Get in Touch</h2>
            <p className="text-gray-700 mb-8 leading-relaxed font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Have a question, comment, or concern? We'd love to hear from you. 
              Our customer service team is ready to assist you with any inquiries 
              about our products, orders, or services.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-gray-900 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-light text-gray-900 mb-1 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Email</h3>
                  <a href="mailto:luzasculture90@gmail.com" className="text-gray-600 hover:text-gray-900 transition-colors font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    luzasculture90@gmail.com
                  </a>
                  <p className="text-sm text-gray-500 mt-1 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>We respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-gray-900 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-light text-gray-900 mb-1 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Online Store</h3>
                  <p className="text-gray-600 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Available 24/7</p>
                  <p className="text-sm text-gray-500 mt-1 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Shop anytime, anywhere</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-light text-gray-900 mb-8 tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <div>
                <label htmlFor="name" className="block text-sm font-light text-gray-700 mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-light text-gray-700 mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-light text-gray-700 mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent font-light"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  <option value="">Select a subject</option>
                  <option value="order">Order Inquiry</option>
                  <option value="product">Product Question</option>
                  <option value="return">Returns & Exchanges</option>
                  <option value="shipping">Shipping Information</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-light text-gray-700 mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none font-light"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  placeholder="Tell us how we can help..."
                />
              </div>

              {submitStatus === 'success' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-light" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Something went wrong. Please try again later.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-light tracking-wide"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

