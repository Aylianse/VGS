import type { Metadata } from "next";
import { ABOUT_CONTENT, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: ABOUT_CONTENT.intro,
  openGraph: {
    title: `About ${SITE.legalName}`,
    description: ABOUT_CONTENT.intro,
  },
};

export default function AboutPage() {
  return (
    <div className="soft-glow">
      <div className="mx-auto max-w-3xl px-4 py-20">
        <p className="text-xs uppercase tracking-[0.25em] text-rose-deep">Our story</p>
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
