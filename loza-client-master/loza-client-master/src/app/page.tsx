"use client";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import dynamic from "next/dynamic";

// Lazy load heavy components
const ProfessionalLanding = dynamic(() => import("@/components/ProfessionalLanding"), {
  loading: () => <div className="h-screen w-full bg-gray-100 animate-pulse" />,
  ssr: false,
});

const VideoShowcase = dynamic(() => import("@/components/VideoShowcase"), {
  loading: () => <div className="h-screen w-full bg-white animate-pulse" />,
  ssr: false,
});

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;
    
    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY || window.pageYOffset;
        const windowHeight = window.innerHeight;
        const scrollPercentage = Math.min(Math.max(scrollTop / windowHeight, 0), 1);
        setScrollProgress(scrollPercentage);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Smooth easing function for better animation
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const smoothProgress = easeInOutCubic(scrollProgress);

  return (
    <div className="relative w-full">
      <div ref={containerRef} className="home-landing min-h-[200vh] w-full relative">
        {/* Fixed Landing Section - Moves up on scroll */}
        <div 
          className="fixed inset-0 w-full h-screen transition-transform duration-75 ease-out"
          style={{
            transform: `translateY(${-smoothProgress * 100}%)`,
            opacity: Math.max(0, 1 - smoothProgress * 1.2),
            willChange: 'transform, opacity',
          }}
        >
          <ProfessionalLanding />
        </div>
        
        {/* Video Section - Slides up from bottom */}
        <div 
          className="fixed inset-0 w-full h-screen transition-transform duration-75 ease-out"
          style={{
            transform: `translateY(${(1 - smoothProgress) * 100}%)`,
            opacity: Math.min(1, smoothProgress * 1.2),
            willChange: 'transform, opacity',
          }}
        >
          <VideoShowcase />
        </div>
      </div>
      {/* Small spacer to separate "Our Collection" from Footer */}
      <div className="relative w-full bg-white" style={{ height: '40px' }}></div>
    </div>
  );
}
