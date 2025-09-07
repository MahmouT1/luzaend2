import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm text-gray-400">© 2023 Loza's Culture. All rights reserved.</p>
        <p className="text-sm text-gray-600 mt-2">For help, call: 035438384, 01254486347</p>
        <div className="hover:visible">
          <Link href="/invoice" className="text-blue-600">Help Center</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
