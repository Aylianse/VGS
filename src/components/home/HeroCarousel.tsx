"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { CarouselSlideView } from "@/lib/admin-types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

const AUTOPLAY_MS = 7000;

export function HeroCarousel({ slides }: { slides: CarouselSlideView[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const slideCount = slides.length;

  const goTo = useCallback(
    (next: number) => {
      setIndex((next + slideCount) % slideCount);
      setProgress(0);
    },
    [slideCount],
  );

  useEffect(() => {
    if (slideCount <= 1 || paused) return;

    const tick = 50;
    const id = window.setInterval(() => {
      setProgress((p) => {
        const next = p + tick / AUTOPLAY_MS;
        if (next >= 1) {
          goTo(index + 1);
          return 0;
        }
        return next;
      });
    }, tick);

    return () => window.clearInterval(id);
  }, [slideCount, paused, index, goTo]);

  if (slideCount === 0) return null;

  const slide = slides[index];

  return (
    <section
      className="hero-fullscreen relative -mt-[var(--site-header-h)] min-h-[100dvh] overflow-hidden"
      aria-label="Featured highlights"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Full-bleed backgrounds — crossfade */}
      <div className="absolute inset-0" aria-hidden>
        {slides.map((item, i) => (
          <div
            key={item.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-out",
              i === index ? "opacity-100" : "opacity-0",
            )}
          >
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt=""
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority={i === 0}
              />
            ) : (
              <div className="hero-fallback-bg absolute inset-0" />
            )}
            <div className="hero-scrim absolute inset-0" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-[2] flex min-h-[100dvh] flex-col justify-end px-4 pb-8 pt-[calc(var(--site-header-h)+2rem)] sm:justify-center sm:pb-16 lg:pb-20">
        <div className="mx-auto grid w-full max-w-6xl items-end gap-10 lg:grid-cols-12 lg:items-center">
          <div
            key={slide.id}
            className="hero-slide-content lg:col-span-7 xl:col-span-6"
            aria-live="polite"
          >
            <p className="hero-fade-up text-xs uppercase tracking-[0.32em] text-muted">
              {SITE.legalName}
            </p>
            <h1 className="hero-fade-up hero-fade-up-1 mt-4 max-w-2xl font-display text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] text-ink">
              {slide.title}
            </h1>
            <p className="hero-fade-up hero-fade-up-2 mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              {slide.subtitle}
            </p>
            <div className="hero-fade-up hero-fade-up-3 mt-8 flex flex-wrap gap-3">
              <Link href={slide.ctaHref} className={cn(buttonVariants({ size: "lg" }))}>
                {slide.ctaLabel}
              </Link>
              {slide.secondaryCtaLabel && slide.secondaryCtaHref && (
                <Link
                  href={slide.secondaryCtaHref}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "bg-white/80 backdrop-blur-sm")}
                >
                  {slide.secondaryCtaLabel}
                </Link>
              )}
            </div>
          </div>

          {/* Desktop: trust strip */}
          <div className="hidden lg:col-span-5 lg:col-start-8 lg:block xl:col-span-6 xl:col-start-7">
            <div className="ml-auto max-w-xs rounded-2xl border border-white/60 bg-white/70 p-6 shadow-lg shadow-black/5 backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.25em] text-muted">Why Vita Glow</p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink/80">
                <li className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ink" />
                  Glutathione &amp; botanical formulas
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ink" />
                  Verify every product code online
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ink" />
                  Trusted by customers worldwide
                </li>
              </ul>
              <Link
                href="/verify"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-5 w-full bg-white")}
              >
                Verify authenticity
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      {slideCount > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-[3] border-t border-white/40 bg-white/50 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
            <div className="flex items-center gap-3">
              <span className="font-display text-lg tabular-nums text-ink">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-muted">/</span>
              <span className="text-sm tabular-nums text-muted">
                {String(slideCount).padStart(2, "0")}
              </span>
            </div>

            <div className="hidden flex-1 px-6 sm:block">
              <div className="h-px w-full bg-border">
                <div
                  className="h-px bg-ink transition-[width] duration-75 ease-linear"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
                onClick={() => setPaused((p) => !p)}
                className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-white/80 text-ink transition hover:bg-white"
              >
                {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
              </button>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => goTo(index - 1)}
                className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-white/80 transition hover:bg-white"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => goTo(index + 1)}
                className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-white/80 transition hover:bg-white"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scroll cue */}
      <a
        href="#collection"
        className={cn(
          "hero-scroll-cue absolute left-1/2 z-[3] hidden -translate-x-1/2 flex-col items-center gap-1 text-xs uppercase tracking-[0.2em] text-muted transition hover:text-ink sm:flex",
          slideCount > 1 ? "bottom-28" : "bottom-8",
        )}
        aria-label="Scroll to products"
      >
        <span>Explore</span>
        <ChevronDown className="size-4 animate-bounce" />
      </a>
    </section>
  );
}
