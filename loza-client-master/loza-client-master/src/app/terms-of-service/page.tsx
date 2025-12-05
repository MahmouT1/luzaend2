'use client';

import React from 'react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing and using the LUZA'S CULTURE website, you accept and agree to be bound by 
              the terms and provision of this agreement. If you do not agree to abide by the above, 
              please do not use this service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service ("Terms") govern your access to and use of our website, products, 
              and services. Please read these Terms carefully before using our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. Use of Website</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.1 Eligibility</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You must be at least 18 years old to use our website and make purchases. By using our 
              services, you represent and warrant that you are of legal age to form a binding contract.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.2 Account Registration</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              To make purchases, you may be required to create an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.3 Prohibited Uses</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to use our website:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, or laws</li>
              <li>To infringe upon or violate our intellectual property rights or the rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
              <li>To upload or transmit viruses or any other type of malicious code</li>
              <li>To collect or track the personal information of others</li>
              <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Products and Pricing</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.1 Product Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We strive to provide accurate product descriptions, images, and pricing. However, 
              we do not warrant that product descriptions or other content on our website is accurate, 
              complete, reliable, current, or error-free.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.2 Pricing</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              All prices are displayed in the currency specified and are subject to change without 
              notice. We reserve the right to modify prices at any time. Prices do not include taxes, 
              shipping, or handling charges unless otherwise stated.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.3 Availability</h3>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to limit the quantities of any products or services that we offer. 
              All descriptions of products or product pricing are subject to change at any time without 
              notice, at our sole discretion.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Orders and Payment</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.1 Order Acceptance</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your order is an offer to purchase products from us. We reserve the right to accept or 
              reject your order for any reason, including product availability, errors in pricing or 
              product information, or fraud prevention.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.2 Payment Terms</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Payment must be received by us before we ship your order. We accept various payment 
              methods as displayed during checkout. You represent and warrant that you have the legal 
              right to use any payment method you provide.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.3 Order Cancellation</h3>
            <p className="text-gray-700 leading-relaxed">
              You may cancel your order within 24 hours of placement, provided it has not been shipped. 
              Once an order has been shipped, it cannot be cancelled, but you may return it in accordance 
              with our return policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Shipping and Delivery</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Shipping terms, costs, and delivery times are provided during checkout. We are not 
              responsible for delays caused by shipping carriers or customs. Risk of loss and title 
              for products pass to you upon delivery to the carrier.
            </p>
            <p className="text-gray-700 leading-relaxed">
              For detailed shipping information, please refer to our 
              <a href="/shipping-returns" className="text-black underline"> Shipping & Returns</a> page.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Returns and Refunds</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our return policy is detailed on our Shipping & Returns page. Returns must be made 
              within 30 days of delivery, and items must be in original condition with tags attached.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Refunds will be processed to the original payment method within 5-7 business days after 
              we receive and inspect the returned items.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All content on our website, including text, graphics, logos, images, and software, is the 
              property of LUZA'S CULTURE or its content suppliers and is protected by copyright, 
              trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You may not reproduce, distribute, modify, create derivative works of, publicly display, 
              or otherwise use our content without our prior written permission.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To the fullest extent permitted by law, LUZA'S CULTURE shall not be liable for any 
              indirect, incidental, special, consequential, or punitive damages, or any loss of profits 
              or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, 
              or other intangible losses resulting from your use of our services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our total liability to you for all claims arising from or related to the use of our 
              services shall not exceed the amount you paid to us in the 12 months preceding the claim.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify, defend, and hold harmless LUZA'S CULTURE and its officers, 
              directors, employees, and agents from and against any claims, liabilities, damages, 
              losses, and expenses arising out of or in any way connected with your use of our 
              services or violation of these Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">10. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the 
              jurisdiction in which LUZA'S CULTURE operates, without regard to its conflict of law 
              provisions.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">11. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify you of any 
              material changes by posting the new Terms on this page and updating the "Last updated" 
              date. Your continued use of our services after such modifications constitutes acceptance 
              of the updated Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">12. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>Email:</strong> support@luzasculture.com</p>
              <p className="text-gray-700 mb-2"><strong>Phone:</strong> 035438384, 01254486347</p>
              <p className="text-gray-700"><strong>Address:</strong> LUZA'S CULTURE Customer Service</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

