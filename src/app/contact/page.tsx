import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { FAQ_ITEMS, SITE, telUrl, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${SITE.legalName} via form, WhatsApp, phone, or email.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 lg:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-rose-deep">Get in touch</p>
        <h1 className="mt-3 font-display text-5xl text-ink">Contact Us</h1>
        <p className="mt-4 text-muted">
          Questions about products, authenticity, or orders? Reach us anytime.
        </p>
        <ul className="mt-8 space-y-3 text-sm">
          <li>
            <a href={`mailto:${SITE.email}`} className="text-rose-deep hover:underline">
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
