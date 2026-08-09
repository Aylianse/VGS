import type { Metadata } from "next";
import { ProductGrid } from "@/components/home/ProductGrid";
import { getPublishedProducts } from "@/lib/queries";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Products",
  description: `Browse ${SITE.name} night creams, glutathione capsules, and whitening soaps.`,
};

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getPublishedProducts();

  return (
    <div className="pt-8">
      <ProductGrid products={products} title="All Products" />
    </div>
  );
}
