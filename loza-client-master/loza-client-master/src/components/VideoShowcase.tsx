"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const VideoShowcase = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (!hasAnimated) {
              setHasAnimated(true);
            }
          }
        });
      },
      {
        threshold: [0, 0.1, 0.2, 0.5, 1.0],
        rootMargin: "0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-white py-12 sm:py-16 md:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 tracking-wide">
            Our Collection
          </h2>
        </div>

        {/* Three Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Panel 1 - Left */}
          <div
            className={`relative aspect-[3/4] overflow-hidden group transition-all duration-1000 ease-out hidden md:block ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
            style={{
              transitionDelay: isVisible ? "200ms" : "0ms",
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src="/intro4.jpg"
                alt="Fashion Collection 1"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          </div>

          {/* Panel 2 - Middle - Show on mobile */}
          <div
            className={`relative aspect-[3/4] overflow-hidden group transition-all duration-1000 ease-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
            style={{
              transitionDelay: isVisible ? "400ms" : "0ms",
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src="/intro3.jpg"
                alt="Fashion Collection 2"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          </div>

          {/* Panel 3 - Right */}
          <div
            className={`relative aspect-[3/4] overflow-hidden group transition-all duration-1000 ease-out hidden md:block ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
            style={{
              transitionDelay: isVisible ? "600ms" : "0ms",
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src="/intro2.jpg"
                alt="Fashion Collection 3"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;

