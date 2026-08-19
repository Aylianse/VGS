import Link from "next/link";
import { ABOUT_CONTENT } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AboutTeaser() {
  return (
    <section className="border-y border-border bg-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:gap-10 sm:py-20 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">VitaGlow</p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-5xl">
            {ABOUT_CONTENT.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">{ABOUT_CONTENT.intro}</p>
          <Link href="/about" className={cn(buttonVariants({ size: "lg" }), "mt-8")}>
            Read more
          </Link>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-8">
          <ul className="space-y-5 text-sm leading-relaxed text-ink/80">
            {ABOUT_CONTENT.body.map((para) => (
              <li key={para.slice(0, 24)} className="border-l-2 border-zinc-300 pl-4">
                {para}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
