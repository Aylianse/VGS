"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CarouselSlideView } from "@/lib/admin-types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

export function HeroCarousel({ slides }: { slides: CarouselSlideView[] }) {
  const [index, setIndex] = useState(0);
  const slideCount = slides.length;

  useEffect(() => {
    if (slideCount <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slideCount), 6000);
    return () => clearInterval(id);
  }, [slideCount]);

  if (slideCount === 0) return null;

  const slide = slides[index];

  return (
    <section className="grain soft-glow relative overflow-hidden" aria-label="Featured highlights">
      <div className="relative z-[2] mx-auto grid min-h-[78vh] max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="animate-fade-up text-xs uppercase tracking-[0.28em] text-rose-deep">
            {SITE.legalName}
          </p>
          <h1 className="animate-fade-up delay-1 mt-4 font-display text-5xl leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
            {slide.title}
          </h1>
          <p className="animate-fade-up delay-2 mt-5 max-w-xl text-lg leading-relaxed text-muted">
            {slide.subtitle}
          </p>
          <div className="animate-fade-up delay-3 mt-8 flex flex-wrap gap-3">
            <Link href={slide.ctaHref} className={cn(buttonVariants({ size: "lg" }))}>
              {slide.ctaLabel}
            </Link>
            {slide.secondaryCtaLabel && slide.secondaryCtaHref && (
              <Link
                href={slide.secondaryCtaHref}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                {slide.secondaryCtaLabel}
              </Link>
            )}
          </div>

          {slideCount > 1 && (
            <div className="mt-10 flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => setIndex((i) => (i - 1 + slideCount) % slideCount)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/70"
              >
                <ChevronLeft className="size-4" />
              </button>
              <div className="flex gap-2">
                {slides.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === index ? "w-8 bg-rose" : "w-3 bg-border",
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => setIndex((i) => (i + 1) % slideCount)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/70"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2.5rem] border border-border bg-cream shadow-2xl shadow-rose/10">
          {slide.imageUrl ? (
            <Image
              src={slide.imageUrl}
              alt={slide.imageAlt || slide.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 420px"
              priority={index === 0}
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-blush via-cream to-gold/30" />
              <div className="absolute inset-4 rounded-[2rem] border border-white/50 bg-white/40 backdrop-blur-sm" />
              <div className="absolute inset-0 flex items-center justify-center p-10 text-center">
                <div>
                  <p className="font-display text-4xl text-ink sm:text-5xl">{SITE.name}</p>
                  <p className="mt-3 text-sm uppercase tracking-[0.25em] text-rose-deep">
                    Night Cream Collection
                  </p>
                  <p className="mx-auto mt-6 max-w-xs text-sm leading-relaxed text-muted">
                    Fair. Pink. Naturally luminous — formulas with Glutathione, Vitamin C & botanicals.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
