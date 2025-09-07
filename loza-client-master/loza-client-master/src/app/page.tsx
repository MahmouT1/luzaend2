import Link from "next/link";
import AdBanner from "@/components/AdBanner";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Full Page Background Video */}
      <section className="relative h-screen bg-black">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="fixed top-0 left-0 w-full h-full object-cover opacity-70 z-0"
          src="/backgroundved.webm"
        />
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 z-1" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-4">
              LOZA's Culture
            </h1>
            <p className="text-xl md:text-2xl font-light tracking-wide mb-8">
              Luxury Clothing Store
            </p>
            <Link href="/categories/new-arrival">
              <button className="bg-white text-black px-8 py-3 text-sm font-medium tracking-wider hover:bg-gray-100 transition-colors">
                EXPLORE COLLECTION
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Content that appears when scrolling */}
      <div className="relative z-20 bg-white">
        {/* Advertisement Image */}
        <AdBanner />
        
        {/* Additional content can be added here that will appear when scrolling down */}
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-light mb-6">Discover Our Collection</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our exclusive range of luxury clothing and accessories. 
              From casual wear to formal attire, we have something for every occasion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
