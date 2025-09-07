"use client";

import { useState, useEffect } from "react";

const AnimatedPromoBanner = () => {
  const promoItems = [
    {
      icon: "🏪",
      text: "OUR STORES"
    },
    {
      icon: "🚚",
      text: "DELIVERY IS HERE!"
    },
    {
      icon: "📦",
      text: "SIGN UP & UNLOCK FREE SHIPPING"
    },
    {
      icon: "🏷️",
      text: "USE WELC15 FOR 15% OFF!"
    },
    {
      icon: "⚡",
      text: "NEED IT NOW? SAME/NEXT DAY DELIVERY IS HERE!"
    },
    {
      icon: "📦",
      text: "NEW PRODUCTS"
    }
  ];

  return (
    <div className="bg-black text-white py-2 overflow-hidden relative">
      {/* Scrolling text effect */}
      <div className="flex items-center">
        <div className="flex space-x-12 animate-scroll whitespace-nowrap">
          {[...promoItems, ...promoItems, ...promoItems].map((item, index) => (
            <div key={index} className="flex items-center space-x-2 text-white">
              <span className="text-sm">{item.icon}</span>
              <span className="text-xs font-medium uppercase tracking-wider">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedPromoBanner;
