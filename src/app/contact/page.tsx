import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { FAQ_ITEMS, SITE, telUrl, whatsappUrl } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `Contact Us | ${SITE.name}`,
  description: `Contact ${SITE.legalName} via form, WhatsApp, phone, or email.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:gap-12 sm:py-16 lg:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-muted">Get in touch</p>
        <h1 className="mt-3 font-display text-3xl text-ink sm:text-5xl">Contact Us</h1>
        <p className="mt-4 text-muted">
          Questions about products, authenticity, or orders? Reach us anytime.
        </p>
        <ul className="mt-8 space-y-3 text-sm">
          <li>
            <a href={`mailto:${SITE.email}`} className="text-ink hover:underline">
              {SITE.email}
            </a>
          </li>
          <li>
            <a href={telUrl()} className="hover:underline">
              {SITE.phoneDisplay}
            </a>
          </li>
          <li>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="hover:underline">
              WhatsApp
            </a>
          </li>
        </ul>

        <div className="mt-12">
          <h2 className="font-display text-2xl">FAQ</h2>
          <div className="mt-4 space-y-4">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.q}
                className="rounded-xl border border-border bg-card px-4 py-3"
              >
                <summary className="cursor-pointer font-medium text-ink">{item.q}</summary>
                <p className="mt-2 text-sm text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
