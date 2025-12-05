import Products from "@/components/Products";
import AnimatedPromoBanner from "@/components/AnimatedPromoBanner";

export default async function CategoryPage({ params }: any) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-white category-page">
      <AnimatedPromoBanner />
      <Products name={slug} />
    </div>
  );
}
