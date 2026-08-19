import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  height?: number;
  showTagline?: boolean;
  priority?: boolean;
};

export function BrandLogo({
  className,
  height = 52,
  showTagline = false,
  priority = false,
}: BrandLogoProps) {
  return (
    <Link href="/" className={cn("group inline-flex min-w-0 max-w-[min(100%,13rem)] flex-col gap-1 sm:max-w-none", className)}>
      <Image
        src={SITE.logoUrl}
        alt={`${SITE.name} logo`}
        width={280}
        height={100}
        className="h-auto max-w-full object-contain transition group-hover:opacity-90"
        style={{ height, width: "auto", maxHeight: height }}
        priority={priority}
      />
      {showTagline && (
        <span className="hidden text-[10px] uppercase tracking-[0.22em] text-muted sm:inline">
          {SITE.tagline}
        </span>
      )}
    </Link>
  );
}
