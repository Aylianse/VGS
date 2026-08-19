import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { NAV_LINKS, SITE, telUrl, whatsappUrl } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-cream text-ink">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:gap-10 sm:py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <BrandLogo height={56} />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{SITE.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={telUrl()} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              Call Now
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "whatsapp", size: "sm" }))}
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-ink/80">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/verify" className="hover:text-ink">
                Verify Product
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-ink/80">
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-ink">
                {SITE.email}
              </a>
            </li>
            <li>
              <a href={telUrl()} className="hover:text-ink">
                {SITE.phoneDisplay}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {SITE.copyright}. All Rights Reserved.
      </div>
    </footer>
  );
}
