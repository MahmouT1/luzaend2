import SingleProduct from "@/components/SingleProduct";

export default async function Page({ params }: any) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-white">
      <SingleProduct productId={id} />
    </div>
  );
}
