export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  usageInstructions: string;
  imageUrls: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  sortOrder: number;
  published: boolean;
};

export type AdminBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImageUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  published: boolean;
};

export type AdminTestimonial = {
  id: string;
  author: string;
  body: string;
  sortOrder: number;
  published: boolean;
};
