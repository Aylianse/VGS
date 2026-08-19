import type { Testimonial } from "@prisma/client";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const items =
    testimonials.length > 0
      ? testimonials
      : [
          {
            id: "1",
            author: "Kenjii",
            body: "I have ordered this product and I have got amazing results. Thank you for this product — it's really good.",
          },
          {
            id: "2",
            author: "Anthe",
            body: "It's a great change in our life when we started. We feel the change on our skin and look attractive.",
          },
          {
            id: "3",
            author: "Anthena",
            body: "The product gives desirable outcomes and is really effective within a short period.",
          },
        ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">Testimonials</p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Loved by real customers</h2>
        </div>
        <Link href="/reviews" className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}>
          All reviews
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <blockquote
            key={item.id}
            className="rounded-[1.5rem] border border-border bg-card p-6 shadow-sm"
          >
            <p className="text-sm leading-relaxed text-ink/80">&ldquo;{item.body}&rdquo;</p>
            <footer className="mt-5 font-display text-lg text-ink">
              {item.author}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
