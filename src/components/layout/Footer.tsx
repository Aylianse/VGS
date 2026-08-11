import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { NAV_LINKS, SITE, telUrl, whatsappUrl } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-ink text-ivory">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <BrandLogo height={56} />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory/70">
            {SITE.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={telUrl()} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-ivory/20 text-ivory hover:bg-ivory/10")}>
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
          <p className="text-xs uppercase tracking-[0.2em] text-ivory/50">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-blush">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/verify" className="hover:text-blush">
                Verify Product
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ivory/50">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-blush">
                {SITE.email}
              </a>
            </li>
            <li>
              <a href={telUrl()} className="hover:text-blush">
                {SITE.phoneDisplay}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10 px-4 py-4 text-center text-xs text-ivory/45">
        © {new Date().getFullYear()} {SITE.copyright}. All Rights Reserved.
      </div>
    </footer>
  );
}
