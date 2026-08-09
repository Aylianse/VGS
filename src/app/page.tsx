import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ProductGrid } from "@/components/home/ProductGrid";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { VerifyCta } from "@/components/home/VerifyCta";
import { BlogPreview } from "@/components/home/BlogPreview";
import {
  getPublishedPosts,
  getPublishedProducts,
  getPublishedTestimonials,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, testimonials, posts] = await Promise.all([
    getPublishedProducts(),
    getPublishedTestimonials(),
    getPublishedPosts(3),
  ]);

  return (
    <>
      <HeroCarousel />
      <ProductGrid products={products} />
      <AboutTeaser />
      <TestimonialsSection testimonials={testimonials} />
      <VerifyCta />
      <BlogPreview posts={posts} />
    </>
  );
}
