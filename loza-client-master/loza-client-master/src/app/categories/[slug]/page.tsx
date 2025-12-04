import Products from "@/components/Products";
import AnimatedPromoBanner from "@/components/AnimatedPromoBanner";

export default async function CategoryPage({ params }: any) {
  const { slug } = await params;
  const isNewArrival = slug === "new-arrival";

  return (
    <div className="min-h-screen bg-white category-page">
      <AnimatedPromoBanner />
      <Products name={slug} />
      
      {/* Video Section - Above Footer (Only for new-arrival page) */}
      {isNewArrival && (
        <section className="w-full bg-white py-8 sm:py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-start">
              <div className="relative w-full max-w-2xl ml-0 sm:ml-4 md:ml-8">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="w-full h-auto"
                  style={{ maxHeight: '500px' }}
                >
                  <source src="/bann4.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
