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
const CONTROLS_HEIGHT = "4.25rem";

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
  const hasControls = slideCount > 1;

  return (
    <section
      className="hero-fullscreen relative -mt-[var(--site-header-h)] min-h-[100svh] overflow-hidden"
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
                className="object-cover object-[center_30%] sm:object-center"
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
      <div
        className="relative z-[2] flex min-h-[100svh] flex-col justify-end px-4 pt-[calc(var(--site-header-h)+1.25rem)] sm:justify-center sm:px-6"
        style={{
          paddingBottom: hasControls
            ? `calc(${CONTROLS_HEIGHT} + env(safe-area-inset-bottom, 0px) + 1.25rem)`
            : "calc(env(safe-area-inset-bottom, 0px) + 2rem)",
        }}
      >
        <div className="mx-auto grid w-full max-w-6xl items-end gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div
            key={slide.id}
            className="hero-slide-content lg:col-span-7 xl:col-span-6"
            aria-live="polite"
          >
            <p className="hero-fade-up text-[11px] uppercase tracking-[0.2em] text-muted sm:text-xs sm:tracking-[0.32em]">
              {SITE.legalName}
            </p>
            <h1 className="hero-fade-up hero-fade-up-1 mt-3 max-w-2xl font-display text-[clamp(1.875rem,7.5vw,4.75rem)] leading-[1.05] text-ink sm:mt-4">
              {slide.title}
            </h1>
            <p className="hero-fade-up hero-fade-up-2 mt-4 max-w-lg text-sm leading-relaxed text-muted sm:mt-5 sm:text-lg">
              {slide.subtitle}
            </p>
            <div className="hero-fade-up hero-fade-up-3 mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Link
                href={slide.ctaHref}
                className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
              >
                {slide.ctaLabel}
              </Link>
              {slide.secondaryCtaLabel && slide.secondaryCtaHref && (
                <Link
                  href={slide.secondaryCtaHref}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "w-full bg-white/90 backdrop-blur-sm sm:w-auto",
                  )}
                >
                  {slide.secondaryCtaLabel}
                </Link>
              )}
            </div>

            {/* Mobile trust points */}
            <ul className="hero-fade-up hero-fade-up-3 mt-6 space-y-2 border-t border-border/60 pt-5 text-sm text-ink/80 lg:hidden">
              <li className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ink" />
                Glutathione &amp; botanical formulas
              </li>
              <li className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ink" />
                Verify every product code online
              </li>
            </ul>
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
      {hasControls && (
        <div
          className="absolute bottom-0 left-0 right-0 z-[3] border-t border-white/40 bg-white/80 backdrop-blur-md"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:py-4">
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <span className="font-display text-base tabular-nums text-ink sm:text-lg">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-muted">/</span>
              <span className="text-xs tabular-nums text-muted sm:text-sm">
                {String(slideCount).padStart(2, "0")}
              </span>
            </div>

            <div className="hidden min-w-0 flex-1 px-4 sm:block sm:px-6">
              <div className="h-px w-full bg-border">
                <div
                  className="h-px bg-ink transition-[width] duration-75 ease-linear"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
                onClick={() => setPaused((p) => !p)}
                className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-white text-ink transition hover:bg-cream"
              >
                {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
              </button>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => goTo(index - 1)}
                className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-white transition hover:bg-cream"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => goTo(index + 1)}
                className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-white transition hover:bg-cream"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scroll cue — tablet+ only */}
      <a
        href="#collection"
        className={cn(
          "hero-scroll-cue absolute left-1/2 z-[3] hidden -translate-x-1/2 flex-col items-center gap-1 text-xs uppercase tracking-[0.2em] text-muted transition hover:text-ink md:flex",
          hasControls ? "bottom-[calc(4.25rem+1rem)]" : "bottom-8",
        )}
        aria-label="Scroll to products"
      >
        <span>Explore</span>
        <ChevronDown className="size-4 animate-bounce" />
      </a>
    </section>
  );
}
