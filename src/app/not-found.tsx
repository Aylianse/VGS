import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-muted">404</p>
      <h1 className="mt-3 font-display text-3xl text-ink sm:text-5xl">Page not found</h1>
      <p className="mt-4 text-muted">The page you’re looking for doesn’t exist.</p>
      <Link href="/" className={cn(buttonVariants({ size: "lg" }), "mt-8")}>
        Back home
      </Link>
    </div>
  );
}
