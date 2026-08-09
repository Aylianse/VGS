import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function VerifyCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-10">
      <div className="overflow-hidden rounded-[2rem] bg-ink px-8 py-12 text-ivory sm:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-blush">
              <ShieldCheck className="size-4" />
              Authenticity
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              How to verify the products
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ivory/70">
              Enter the code on your packaging to confirm you received a genuine Vita Glow
              product. Protect yourself from counterfeits.
            </p>
          </div>
          <Link href="/verify" className={cn(buttonVariants({ size: "lg" }), "shrink-0")}>
            Verify your product
          </Link>
        </div>
      </div>
    </section>
  );
}
