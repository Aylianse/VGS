import type { Metadata } from "next";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { getPublishedTestimonials } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Customer testimonials for Vita Glow skin whitening products.",
};

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const testimonials = await getPublishedTestimonials();

  return (
    <div className="pt-8">
      <TestimonialsSection testimonials={testimonials} />
    </div>
  );
}
