"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

const slides = [
  {
    title: "Glow that feels natural",
    subtitle: "Night creams, capsules & soaps crafted with glutathione and botanicals.",
    cta: { label: "Shop Our Range", href: "/products" },
  },
  {
    title: "Verify every purchase",
    subtitle: "Authentic Vita Glow products carry a code. Check yours in seconds.",
    cta: { label: "Verify Product", href: "/verify" },
  },
  {
    title: "Talk to us on WhatsApp",
    subtitle: "Questions about routine or authenticity? We're one message away.",
    cta: { label: "Message Us", href: "/contact" },
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, []);

  const slide = slides[index];

  return (
    <section className="grain soft-glow relative overflow-hidden">
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
            <Link href={slide.cta.href} className={cn(buttonVariants({ size: "lg" }))}>
              {slide.cta.label}
            </Link>
            <Link
              href="/about"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Know About Us
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/70"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
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
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/70"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-blush via-cream to-gold/30 shadow-2xl shadow-rose/10" />
          <div className="absolute inset-4 rounded-[2rem] border border-white/50 bg-white/40 backdrop-blur-sm" />
          <div className="absolute inset-0 flex items-center justify-center p-10 text-center">
            <div>
              <p className="font-display text-4xl text-ink sm:text-5xl">Vita Glow</p>
              <p className="mt-3 text-sm uppercase tracking-[0.25em] text-rose-deep">
                Night Cream Collection
              </p>
              <p className="mx-auto mt-6 max-w-xs text-sm leading-relaxed text-muted">
                Fair. Pink. Naturally luminous — formulas with Glutathione, Vitamin C & botanicals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
