"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Always-visible Verify CTA on mobile screens. */
export function MobileVerifyBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 backdrop-blur-md sm:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="px-4 pt-3">
        <Link href="/verify" className={cn(buttonVariants({ size: "lg" }), "w-full shadow-sm")}>
          <ShieldCheck className="size-4" />
          Verify your product
        </Link>
      </div>
    </div>
  );
}
