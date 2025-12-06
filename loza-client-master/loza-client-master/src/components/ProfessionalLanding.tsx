"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGetProductsByCategoryQuery } from "@/redux/features/products/productApi";

const ProfessionalLanding = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Prefetch products data when component mounts
  useGetProductsByCategoryQuery("new-arrival");

  useEffect(() => {
    // Play video
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Video autoplay prevented:', error);
      });
    }

    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background - Original full screen background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full z-[0] object-cover sm:object-cover md:object-cover"
        style={{ 
          objectFit: 'cover',
          objectPosition: 'center center',
          minWidth: '100%',
          minHeight: '100%',
          width: '100%',
          height: '100%'
        }}
      >
        <source src="/VIDEO ONE.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Subtle dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 z-[1]" />

      {/* Main Content - Bottom like Louis Vuitton */}
      <div className="relative z-10 h-full flex flex-col items-center justify-end px-4 pb-16 sm:pb-20 md:pb-24 lg:pb-32">
        {/* Small "DISCOVER" text */}
        <div 
          className={`mb-3 sm:mb-4 transition-all duration-1000 ease-out ${
            isLoaded 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <p className="text-white text-xs sm:text-sm font-light tracking-[0.2em] uppercase text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '0.15em' }}>
            DISCOVER
          </p>
        </div>

        {/* Main Headline - Like Louis Vuitton (Sans-serif font, exact size) */}
        <div 
          className={`mb-4 sm:mb-5 transition-all duration-1000 ease-out ${
            isLoaded 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <h1 className="text-white text-3xl sm:text-4xl md:text-4xl lg:text-4xl xl:text-4xl font-light tracking-wide text-center leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 300 }}>
            The Path to Excellence<br />with Culture For The Rare
          </h1>
        </div>

        {/* SHOP HERE Link - Like "Gifts for Him" */}
        <div 
          className={`transition-all duration-1000 ease-out ${
            isLoaded 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <Link 
            href="/categories/new-arrival"
            prefetch={true}
            className="group relative inline-block"
          >
            <span className="text-white text-base sm:text-lg md:text-lg lg:text-lg xl:text-lg font-light tracking-wide uppercase underline underline-offset-4 decoration-white/80 hover:decoration-white transition-all duration-300" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 300 }}>
              SHOP HERE
            </span>
          </Link>
        </div>
      </div>

      {/* Pause/Play indicator (optional) */}
      <div className="absolute bottom-4 left-4 z-10 opacity-50">
        <div className="w-2 h-4 border-l-2 border-r-2 border-white"></div>
      </div>
    </div>
  );
};

export default ProfessionalLanding;
