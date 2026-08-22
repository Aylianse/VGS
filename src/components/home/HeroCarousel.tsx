"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { CarouselSlideView } from "@/lib/admin-types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

const AUTOPLAY_MS = 7000;
const MOBILE_VERIFY_BAR = "calc(4.75rem + env(safe-area-inset-bottom, 0px))";
const CONTROLS_HEIGHT = "3.25rem";

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
      className="hero-fullscreen relative -mt-[var(--site-header-h)] min-h-[100svh] overflow-hidden max-sm:pb-[var(--mobile-verify-bar-h)] sm:pb-0"
      aria-label="Featured highlights"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ "--mobile-verify-bar-h": MOBILE_VERIFY_BAR } as CSSProperties}
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

      {/* Mobile: title-only overlay — image stays dominant */}
      <div
        className="relative z-[2] flex min-h-[100svh] flex-col justify-end px-4 pt-[calc(var(--site-header-h)+0.5rem)] sm:hidden"
        style={{
          paddingBottom: hasControls
            ? `calc(${CONTROLS_HEIGHT} + ${MOBILE_VERIFY_BAR} + 0.5rem)`
            : `calc(${MOBILE_VERIFY_BAR} + 0.5rem)`,
        }}
      >
        <div key={slide.id} className="mx-auto w-full max-w-6xl pb-1" aria-live="polite">
          <p className="hero-fade-up text-xs uppercase tracking-[0.24em] text-muted">
            {SITE.name}
          </p>
          <h1 className="hero-fade-up hero-fade-up-1 mt-1.5 line-clamp-2 font-display text-2xl leading-tight text-ink">
            {slide.title}
          </h1>
        </div>
      </div>

      {/* Desktop / tablet: full content */}
      <div
        className="relative z-[2] hidden min-h-[100svh] flex-col justify-center px-6 pt-[calc(var(--site-header-h)+1.25rem)] sm:flex"
        style={{
          paddingBottom: hasControls
            ? `calc(${CONTROLS_HEIGHT} + env(safe-area-inset-bottom, 0px) + 1.25rem)`
            : "calc(env(safe-area-inset-bottom, 0px) + 2rem)",
        }}
      >
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-12">
          <div key={`${slide.id}-desktop`} className="hero-slide-content lg:col-span-7 xl:col-span-6" aria-live="polite">
            <p className="hero-fade-up text-xs uppercase tracking-[0.32em] text-muted">{SITE.legalName}</p>
            <h1 className="hero-fade-up hero-fade-up-1 mt-4 max-w-2xl font-display text-[clamp(2.25rem,5vw,4.75rem)] leading-[1.05] text-ink">
              {slide.title}
            </h1>
            <p className="hero-fade-up hero-fade-up-2 mt-5 max-w-lg text-lg leading-relaxed text-muted">
              {slide.subtitle}
            </p>
            <div className="hero-fade-up hero-fade-up-3 mt-8">
              <Link href={slide.ctaHref} className={cn(buttonVariants({ size: "lg" }))}>
                {slide.ctaLabel}
              </Link>
            </div>
          </div>

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

      {/* Bottom controls — sit above mobile verify bar */}
      {hasControls && (
        <div
          className="absolute left-0 right-0 z-[3] border-t border-white/40 bg-white/80 backdrop-blur-md max-sm:bottom-[var(--mobile-verify-bar-h)] sm:bottom-0"
          style={
            {
              "--mobile-verify-bar-h": MOBILE_VERIFY_BAR,
              paddingBottom: "max(0px, env(safe-area-inset-bottom, 0px))",
            } as CSSProperties
          }
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:gap-4 sm:py-4">
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
