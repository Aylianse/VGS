import { SITE } from "@/lib/site";
import { absoluteMediaUrl } from "@/lib/media-url";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.legalName,
    url: SITE.url,
    email: SITE.email,
    telephone: SITE.phone,
    description: SITE.description,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  image,
  slug,
}: {
  name: string;
  description: string;
  image?: string | null;
  slug: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: absoluteMediaUrl(image),
    brand: { "@type": "Brand", name: SITE.name },
    url: `${SITE.url}/products/${slug}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BlogPostingJsonLd({
  title,
  description,
  slug,
  publishedAt,
  image,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt: Date | string;
  image?: string | null;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: new Date(publishedAt).toISOString(),
    image: absoluteMediaUrl(image),
    author: { "@type": "Organization", name: SITE.legalName },
    publisher: { "@type": "Organization", name: SITE.legalName },
    mainEntityOfPage: `${SITE.url}/blog/${slug}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
