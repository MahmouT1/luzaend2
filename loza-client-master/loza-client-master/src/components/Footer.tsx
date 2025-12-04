import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'SHOP',
      links: [
        { name: 'Bestsellers', href: '/bestsellers' },
      ],
    },
    {
      title: 'ABOUT',
      links: [
        { name: 'Our Story', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
      ],
    },
    {
      title: 'HELP',
      links: [
        { name: 'Shipping & Returns', href: '/shipping-returns' },
        { name: 'FAQ', href: '/faq' },
      ],
    },
  ];

  const socialMedia = [
    { 
      name: 'Facebook', 
      href: '#', 
      icon: Facebook,
      color: 'hover:bg-blue-600 hover:text-white',
      bgColor: 'bg-gray-100'
    },
    { 
      name: 'Instagram', 
      href: 'https://www.instagram.com/luzasculture?igsh=cXZicTI0aGJlM3l1', 
      icon: Instagram,
      color: 'hover:bg-gradient-to-r hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 hover:text-white',
      bgColor: 'bg-gray-100'
    },
  ];

  return (
    <footer className="bg-white text-black pt-16 pb-8 px-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Link href="/" className="text-2xl font-light tracking-wide" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                LUZA'S CULTURE
              </Link>
            </div>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-medium uppercase tracking-widest mb-4 text-gray-700" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.15em' }}>
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              {socialMedia.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative flex items-center justify-center w-10 h-10 rounded-full ${item.bgColor} ${item.color} transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-md`}
                    aria-label={item.name}
                  >
                    <IconComponent className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors duration-300" />
                  </a>
                );
              })}
            </div>
            <div className="text-sm text-gray-600" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {currentYear} Luza's Culture, powered by Ruutech@
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <div className="flex flex-wrap justify-center space-x-6">
              <Link href="/privacy-policy" className="hover:text-gray-900 transition-colors duration-200">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-gray-900 transition-colors duration-200">Terms of Service</Link>
            </div>
          </div>

          {/* Payment Methods Icons */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
              <div className="flex items-center gap-4">
                <Image
                  src="/visa (1).png"
                  alt="Visa"
                  width={50}
                  height={30}
                  className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
                <Image
                  src="/mastercard (2).png"
                  alt="Mastercard"
                  width={50}
                  height={30}
                  className="object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
