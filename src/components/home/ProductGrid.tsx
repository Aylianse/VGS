import Image from "next/image";
import Link from "next/link";
import type { Product } from "@prisma/client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const image = product.imageUrls[0] || "/products/placeholder.svg";

  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl hover:shadow-rose/10">
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/3] bg-cream">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-contain p-6 transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl leading-snug text-ink">
          <Link href={`/products/${product.slug}`} className="hover:text-rose-deep">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
          {product.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={`/products/${product.slug}`}
            className={cn(buttonVariants({ size: "sm" }))}
          >
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
}: {
  products: Product[];
  title?: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.25em] text-rose-deep">Collection</p>
        <h2 className="mt-3 font-display text-4xl text-ink sm:text-5xl">{title}</h2>
      </div>
      {products.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-cream/50 p-10 text-center text-muted">
          Products will appear here once the database is connected and seeded.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
