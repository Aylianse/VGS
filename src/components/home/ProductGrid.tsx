import Image from "next/image";
import Link from "next/link";
import type { Product } from "@prisma/client";
import { plainTextPreview } from "@/lib/sanitize-html";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ProductImage({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 33vw",
  className,
  cover = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  cover?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full overflow-hidden",
        cover ? "bg-zinc-100" : "product-image-frame bg-white",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={cn(
          "transition duration-300 group-hover:scale-[1.03]",
          cover ? "object-cover" : "object-contain p-1 sm:p-2",
        )}
        sizes={sizes}
        priority={priority}
      />
    </div>
  );
}

export function ProductCard({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const image = product.imageUrls[0] || "/products/placeholder.svg";

  if (compact) {
    return (
      <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:shadow-md">
        <Link href={`/products/${product.slug}`} className="block">
          <ProductImage src={image} alt={product.name} cover />
        </Link>
        <div className="border-t border-border px-4 py-3">
          <h3 className="font-display text-lg leading-snug text-ink">
            <Link href={`/products/${product.slug}`} className="hover:text-foreground/70">
              {product.name}
            </Link>
          </h3>
          <Link
            href="/verify"
            className={cn(buttonVariants({ size: "sm", variant: "outline" }), "mt-3 w-full")}
          >
            Verify product
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="block">
        <ProductImage src={image} alt={product.name} cover />
      </Link>
      <div className="flex flex-1 flex-col border-t border-border p-4">
        <h3 className="font-display text-xl leading-snug text-ink">
          <Link href={`/products/${product.slug}`} className="hover:text-foreground/70">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
          {plainTextPreview(product.description, 120)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={`/products/${product.slug}`} className={cn(buttonVariants({ size: "sm" }))}>
            Know more
          </Link>
          <Link
            href="/verify"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Verify
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  title = "Our Products",
  compact = false,
}: {
  products: Product[];
  title?: string;
  compact?: boolean;
}) {
  return (
    <section id="collection" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:py-20">
      <div className="mb-8 max-w-2xl sm:mb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-muted">Collection</p>
        <h2 className="mt-3 font-display text-3xl text-ink sm:text-5xl">{title}</h2>
      </div>
      {products.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-cream p-10 text-center text-muted">
          Products will appear here once the database is connected and seeded.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} compact={compact} />
          ))}
        </div>
      )}
    </section>
  );
}
