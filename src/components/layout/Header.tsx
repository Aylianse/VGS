"use client";

import { BrandLogo } from "@/components/layout/BrandLogo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, ShieldCheck, X } from "lucide-react";
import { NAV_LINKS, telUrl, whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "hidden border-b border-border text-ink transition-colors sm:block",
          isHome ? "border-white/30 bg-white/60 backdrop-blur-md" : "bg-cream",
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 text-xs sm:text-sm">
          <p className="truncate text-muted">Official Vita Glow Products — verify authenticity</p>
          <div className="flex shrink-0 items-center gap-3">
            <a href={telUrl()} className="inline-flex items-center gap-1.5 text-ink hover:text-muted">
              <Phone className="size-3.5" />
              <span className="hidden sm:inline">Call Now</span>
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-ink hover:text-muted"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "border-b border-border backdrop-blur-md transition-colors",
          isHome ? "border-white/30 bg-white/85" : "border-border bg-white/95",
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:py-4">
          <BrandLogo showTagline priority height={48} className="min-w-0 shrink" />

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm transition",
                  pathname === link.href
                    ? "bg-zinc-100 text-ink"
                    : "text-ink/80 hover:bg-cream hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link href="/verify" className={cn(buttonVariants({ size: "sm" }), "inline-flex shrink-0")}>
              <ShieldCheck className="size-4" />
              Verify
            </Link>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full border border-border lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Toggle menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-border px-4 py-3 lg:hidden">
            <div className="flex max-h-[min(70dvh,28rem)] flex-col gap-1 overflow-y-auto pb-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-xl px-3 py-3.5 text-sm",
                    pathname === link.href ? "bg-zinc-100 text-ink" : "hover:bg-cream",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/verify"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-ink px-3 py-3.5 text-center text-sm text-white"
              >
                Verify Product
              </Link>
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-3">
                <a
                  href={telUrl()}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}
                >
                  <Phone className="size-3.5" />
                  Call
                </a>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "whatsapp", size: "sm" }), "w-full")}
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
