import { prisma } from "@/lib/prisma";
import type { CarouselSlideView } from "@/lib/admin-types";

const DEFAULT_CAROUSEL_SLIDES: CarouselSlideView[] = [
  {
    id: "default-1",
    title: "Glow that feels natural",
    subtitle: "Night creams, capsules & soaps crafted with glutathione and botanicals.",
    ctaLabel: "Shop Our Range",
    ctaHref: "/products",
    secondaryCtaLabel: "Know About Us",
    secondaryCtaHref: "/about",
    imageUrl: null,
    imageAlt: null,
    sortOrder: 1,
    published: true,
  },
  {
    id: "default-2",
    title: "Verify every purchase",
    subtitle: "Authentic Vita Glow products carry a code. Check yours in seconds.",
    ctaLabel: "Verify Product",
    ctaHref: "/verify",
    secondaryCtaLabel: "Know About Us",
    secondaryCtaHref: "/about",
    imageUrl: null,
    imageAlt: null,
    sortOrder: 2,
    published: true,
  },
  {
    id: "default-3",
    title: "Talk to us on WhatsApp",
    subtitle: "Questions about routine or authenticity? We're one message away.",
    ctaLabel: "Message Us",
    ctaHref: "/contact",
    secondaryCtaLabel: "Know About Us",
    secondaryCtaHref: "/about",
    imageUrl: null,
    imageAlt: null,
    sortOrder: 3,
    published: true,
  },
];

export async function getPublishedCarouselSlides(): Promise<CarouselSlideView[]> {
  try {
    const slides = await prisma.carouselSlide.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    });
    if (slides.length === 0) return DEFAULT_CAROUSEL_SLIDES;
    return slides;
  } catch {
    return DEFAULT_CAROUSEL_SLIDES;
  }
}

export async function getPublishedProducts() {
  try {
    return await prisma.product.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrls: true,
        sortOrder: true,
        published: true,
      },
    });
  } catch {
    return [];
  }
}

export async function getRelatedProducts(excludeId: string, limit = 3) {
  try {
    return await prisma.product.findMany({
      where: { published: true, id: { not: excludeId } },
      orderBy: { sortOrder: "asc" },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrls: true,
      },
    });
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await prisma.product.findFirst({
      where: { slug, published: true },
    });
  } catch {
    return null;
  }
}

export async function getPublishedPosts(limit?: number) {
  try {
    return await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImageUrl: true,
        publishedAt: true,
        published: true,
      },
    });
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    return await prisma.blogPost.findFirst({
      where: { slug, published: true },
    });
  } catch {
    return null;
  }
}

export async function getPublishedTestimonials() {
  try {
    return await prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        author: true,
        body: true,
        sortOrder: true,
        published: true,
      },
    });
  } catch {
    return [];
  }
}
