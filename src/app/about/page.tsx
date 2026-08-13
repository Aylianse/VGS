import type { Metadata } from "next";
import { ABOUT_CONTENT, SITE } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `About Us | ${SITE.name}`,
  description: ABOUT_CONTENT.intro,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="soft-glow">
      <div className="mx-auto max-w-3xl px-4 py-20">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">Our story</p>
        <h1 className="mt-3 font-display text-5xl text-ink">{ABOUT_CONTENT.title}</h1>
        <p className="mt-6 text-xl leading-relaxed text-muted">{ABOUT_CONTENT.intro}</p>
        <div className="mt-10 space-y-6 text-base leading-relaxed text-ink/85">
          {ABOUT_CONTENT.body.map((para) => (
            <p key={para.slice(0, 32)}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
