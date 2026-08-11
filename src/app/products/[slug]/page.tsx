import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductJsonLd } from "@/components/seo/JsonLd";
import { RichContent } from "@/components/content/RichContent";
import { plainTextPreview } from "@/lib/sanitize-html";
import { buttonVariants } from "@/components/ui/button";
import { getProductBySlug, getPublishedProducts } from "@/lib/queries";
import { SITE, whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  const title = product.metaTitle || product.name;
  const description = product.metaDescription || plainTextPreview(product.description, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.imageUrls[0] ? [{ url: product.imageUrls[0] }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const others = (await getPublishedProducts()).filter((p) => p.id !== product.id).slice(0, 3);
  const image = product.imageUrls[0] || "/products/placeholder.svg";

  return (
    <>
      <ProductJsonLd
        name={product.name}
        description={product.description}
        image={product.imageUrls[0]}
        slug={product.slug}
      />
      <article className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-border bg-cream">
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-contain p-10"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-rose-deep">{SITE.name}</p>
            <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">{product.name}</h1>
            <RichContent content={product.description} className="mt-6 text-base leading-relaxed text-muted" />
            {product.usageInstructions && (
              <div className="mt-8 rounded-2xl border border-border bg-card p-6">
                <h2 className="font-display text-2xl text-ink">How to use</h2>
                <RichContent
                  content={product.usageInstructions}
                  className="mt-3 text-sm leading-relaxed text-muted"
                />
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappUrl(`Hi, I'm interested in ${product.name}`)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "whatsapp", size: "lg" }))}
              >
                Enquire on WhatsApp
              </a>
              <Link href="/verify" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                Verify product
              </Link>
            </div>
          </div>
        </div>

        {others.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-3xl text-ink">You may also like</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {others.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="rounded-2xl border border-border bg-card p-4 transition hover:border-rose/30"
                >
                  <p className="font-display text-lg">{p.name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
