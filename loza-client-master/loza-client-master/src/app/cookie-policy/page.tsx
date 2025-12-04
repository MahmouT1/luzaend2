'use client';

import React from 'react';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-xl text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">1. What Are Cookies?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Cookies are small text files that are placed on your computer or mobile device when you 
              visit a website. They are widely used to make websites work more efficiently and provide 
              information to website owners.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Cookies allow a website to recognize your device and store some information about your 
              preferences or past actions. This helps us provide you with a better browsing experience 
              and allows us to improve our website.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2. How We Use Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              LUZA'S CULTURE uses cookies for various purposes to enhance your experience on our website:
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.1 Essential Cookies</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              These cookies are necessary for the website to function properly. They enable basic 
              functions like page navigation and access to secure areas of the website. The website 
              cannot function properly without these cookies.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.2 Performance Cookies</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              These cookies collect information about how visitors use our website, such as which 
              pages are visited most often. This helps us improve the website's performance and user 
              experience.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.3 Functionality Cookies</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              These cookies allow the website to remember choices you make (such as your username, 
              language, or region) and provide enhanced, personalized features.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.4 Targeting/Advertising Cookies</h3>
            <p className="text-gray-700 leading-relaxed">
              These cookies are used to deliver advertisements that are relevant to you and your 
              interests. They also help measure the effectiveness of advertising campaigns.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">3. Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Session Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  These are temporary cookies that are deleted when you close your browser. They help 
                  us remember your actions during a browsing session, such as items in your shopping cart.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Persistent Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  These cookies remain on your device for a set period or until you delete them. 
                  They help us remember your preferences and improve your experience across multiple visits.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">First-Party Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  These cookies are set directly by our website and are used to provide core functionality 
                  and improve user experience.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  These cookies are set by third-party services that appear on our pages, such as 
                  analytics providers or advertising networks. We use these to understand website 
                  usage and deliver relevant advertisements.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">4. Specific Cookies We Use</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Below are examples of specific cookies we may use on our website:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Authentication Cookies:</strong> To keep you logged in and maintain your session</li>
              <li><strong>Shopping Cart Cookies:</strong> To remember items in your shopping cart</li>
              <li><strong>Preference Cookies:</strong> To remember your language and region preferences</li>
              <li><strong>Analytics Cookies:</strong> To analyze website traffic and user behavior</li>
              <li><strong>Marketing Cookies:</strong> To track the effectiveness of our marketing campaigns</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">5. Managing Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to decide whether to accept or reject cookies. You can control and 
              manage cookies in various ways:
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.1 Browser Settings</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Most web browsers allow you to control cookies through their settings. You can set your 
              browser to refuse cookies or to alert you when cookies are being sent. However, if you 
              disable cookies, some parts of our website may not function properly.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Here are links to instructions for managing cookies in popular browsers:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-black underline">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-black underline">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-black underline">Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-black underline">Microsoft Edge</a></li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.2 Cookie Consent</h3>
            <p className="text-gray-700 leading-relaxed">
              When you first visit our website, you may see a cookie consent banner. You can choose 
              to accept or reject non-essential cookies. You can also change your preferences at any 
              time through your browser settings or by contacting us.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">6. Third-Party Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In addition to our own cookies, we may also use various third-party cookies to report 
              usage statistics of the website and deliver advertisements. These third parties may 
              include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Analytics providers (e.g., Google Analytics)</li>
              <li>Advertising networks</li>
              <li>Social media platforms</li>
              <li>Payment processors</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              These third parties may use cookies to collect information about your online activities 
              across different websites. We do not control these third-party cookies, and you should 
              review their privacy policies to understand how they use cookies.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">7. Do Not Track Signals</h2>
            <p className="text-gray-700 leading-relaxed">
              Some browsers include a "Do Not Track" (DNT) feature that signals to websites you visit 
              that you do not want to have your online activity tracked. Currently, there is no 
              standard for how DNT signals should be interpreted. As a result, our website does not 
              currently respond to DNT browser signals or mechanisms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">8. Updates to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices 
              or for other operational, legal, or regulatory reasons. We will notify you of any 
              material changes by posting the new policy on this page and updating the "Last updated" 
              date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">9. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
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

