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
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">Testimonials</p>
          <h2 className="mt-3 font-display text-4xl text-ink">Loved by real customers</h2>
        </div>
        <Link href="/reviews" className={cn(buttonVariants({ variant: "outline" }))}>
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
