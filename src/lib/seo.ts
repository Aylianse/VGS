import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export function absoluteUrl(path = "") {
  const normalized = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `${SITE.url}${normalized}`;
}

type PageSeoOptions = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noIndex = false,
}: PageSeoOptions): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image || SITE.logoUrl;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: SITE.legalName,
      locale: "en_US",
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export function buildHomeMetadata(): Metadata {
  return buildPageMetadata({
    title: `${SITE.name} Night Cream For Skin Whitening — Official Website`,
    description: SITE.description,
    path: "/",
    image: SITE.logoUrl,
  });
}
