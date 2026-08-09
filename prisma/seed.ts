import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  {
    name: "Vita Glow Skin Whitening Night Cream",
    slug: "vita-glow-skin-whitening-night-cream",
    description:
      "This skin whitening cream is for those who prefer an external solution. It is a complete skincare product for men and women. It works on oily, dry, and normal skin, and helps with dark spots, age spots, acne scars, and dark circles. Natural ingredients remove dead skin cells and leave a fair, pink, glowing complexion.",
    usageInstructions:
      "Cleanse your face before bed. Apply a thin layer of Vita Glow Night Cream evenly on the face and neck. Massage gently until absorbed. Use consistently for best results. Avoid daytime sun exposure without SPF.",
    imageUrls: ["/products/night-cream.svg"],
    metaTitle: "Vita Glow Skin Whitening Night Cream | Official",
    metaDescription:
      "Shop Vita Glow Skin Whitening Night Cream — natural herbs for a fair, pink glow. Works on all skin types.",
    sortOrder: 1,
  },
  {
    name: "Vita Glow Skin Whitening Capsules",
    slug: "vita-glow-skin-whitening-capsules",
    description:
      "For those who prefer an internal approach, Vita Glow Skin Whitening Capsules deliver Glutathione, Ascorbic Acid, and Grapeseed Extracts. They work from the inside out through the bloodstream for faster, longer-lasting transformation.",
    usageInstructions:
      "Take as directed on the packaging or by your healthcare provider. Stay hydrated and pair with a gentle skincare routine. Consult a doctor if pregnant, breastfeeding, or under medical care.",
    imageUrls: ["/products/capsules.svg"],
    metaTitle: "Vita Glow Glutathione Skin Whitening Capsules",
    metaDescription:
      "Vita Glow capsules with Glutathione, Vitamin C, and Grapeseed Extract for lasting skin brightening from within.",
    sortOrder: 2,
  },
  {
    name: "Vita Glow Glutathione Skin Whitening Soap",
    slug: "vita-glow-glutathione-skin-whitening-soap",
    description:
      "Fold whitening care into your bath with Vita Glow Glutathione Skin Whitening Soap. Made from natural ingredients, it penetrates the skin during cleansing, removes dead cells, and leaves skin looking fresh and young.",
    usageInstructions:
      "Lather on damp skin during your bath or shower. Massage gently for 30–60 seconds, then rinse thoroughly. Use daily morning and evening.",
    imageUrls: ["/products/soap.svg"],
    metaTitle: "Vita Glow Glutathione Skin Whitening Soap",
    metaDescription:
      "Natural Vita Glow Glutathione soap for brighter, fresher skin as part of your daily bath routine.",
    sortOrder: 3,
  },
  {
    name: "Advanced Vita Glow Skin Whitening Night Cream",
    slug: "advanced-vita-glow-skin-whitening-night-cream",
    description:
      "A quick-absorbing, non-greasy cream that targets tone irregularities and dark spots. With regular use it supports a brighter, more youthful complexion — ideal for your nightly regimen without oily residue.",
    usageInstructions:
      "Apply a pea-sized amount to cleansed face and neck at night. Pat until absorbed. Follow with moisturizer if needed. Use sunscreen during the day.",
    imageUrls: ["/products/advanced-cream.svg"],
    metaTitle: "Advanced Vita Glow Skin Whitening Night Cream",
    metaDescription:
      "Fast-absorbing Advanced Vita Glow Night Cream for evening skin tone and reducing dark spots.",
    sortOrder: 4,
  },
  {
    name: "Advanced Vita Glow Glutathione Skin Whitening Soap",
    slug: "advanced-vita-glow-glutathione-skin-whitening-soap",
    description:
      "Advanced Vita Glow soap helps brighten and even skin tone by supporting a healthier-looking complexion. Use it to reduce the look of scars, age spots, and uneven pigmentation. Formulated without mercury or hydroquinone.",
    usageInstructions:
      "Use on body and face as preferred. Lather, massage gently, rinse well. Patch test if you have sensitive skin.",
    imageUrls: ["/products/advanced-soap.svg"],
    metaTitle: "Advanced Vita Glow Glutathione Whitening Soap",
    metaDescription:
      "Advanced Vita Glow Glutathione soap to even tone and brighten — free from mercury and hydroquinone.",
    sortOrder: 5,
  },
  {
    name: "Pinkish Vita Glow Skin Whitening Night Cream",
    slug: "pinkish-vita-glow-skin-whitening-night-cream",
    description:
      "Pinkish Vita Glow Night Cream is designed for brighter, flawless-looking skin. It helps remove impurities, dark spots, and dullness for a fresh, even-toned complexion. Works while you sleep with potent natural ingredients that also fight signs of aging.",
    usageInstructions:
      "Apply at night on clean skin. Focus on areas with dullness or dark spots. Wake to smoother, more radiant-looking skin with consistent use.",
    imageUrls: ["/products/pinkish-cream.svg"],
    metaTitle: "Pinkish Vita Glow Skin Whitening Night Cream",
    metaDescription:
      "Pinkish Vita Glow Night Cream for visible brightening, even tone, and youthful glow while you sleep.",
    sortOrder: 6,
  },
];

const blogPosts = [
  {
    title: "Vita Glow Products: In-depth Review and Comparison",
    slug: "vita-glow-products-in-depth-review-and-comparison",
    excerpt:
      "In the vast world of skincare, few brands stand out like Vita Glow — recognized for products designed to promote healthier, lighter-looking skin.",
    body: `Vita Glow has built a reputation around glutathione-forward formulas, natural herbs, and results-focused routines for both men and women.

Our night creams, capsules, and soaps each serve a different preference — topical, internal, or bath-time care — so you can choose the path that fits your lifestyle.

When comparing Vita Glow to generic brightening products, look for clear ingredient stories (Glutathione, Vitamin C, botanical extracts), authenticity verification, and consistent customer feedback.

Always buy from official channels and verify your product code to ensure you receive a genuine Vita Glow item.`,
    coverImageUrl: "/blog/review.svg",
    metaTitle: "Vita Glow Products Review & Comparison",
    metaDescription:
      "An in-depth look at Vita Glow night creams, capsules, and soaps — ingredients, use cases, and how to buy authentic products.",
    publishedAt: new Date("2024-03-22"),
  },
  {
    title: "Vita Glow's Most Popular Products and Why They're Loved",
    slug: "vita-glows-most-popular-products-and-why-theyre-loved",
    excerpt:
      "Certain skincare brands stand out for quality, efficacy, and skin-loving ingredients. Vita Glow is one of them.",
    body: `Customers repeatedly return to Vita Glow Night Cream for its comprehensive topical care, and to our Glutathione capsules for inside-out brightening.

The soap range makes whitening care effortless by folding into a daily bath. Advanced and Pinkish variants offer faster-absorbing and pinkish-glow focused options.

What keeps people coming back: natural herb bases, visible tone improvement with consistent use, and the confidence of product authenticity checks.`,
    coverImageUrl: "/blog/popular.svg",
    metaTitle: "Most Popular Vita Glow Products",
    metaDescription:
      "Discover why Vita Glow night cream, capsules, and glutathione soap are favorites among long-term customers.",
    publishedAt: new Date("2023-08-28"),
  },
  {
    title: "The Difference Between Vita Glow and Other Skincare Brands",
    slug: "the-difference-between-vita-glow-and-other-skincare-brands",
    excerpt:
      "It can be challenging to distinguish one skincare brand from another. Here's what sets Vita Glow apart.",
    body: `Many brands promise glow. Vita Glow pairs that promise with a clear product family — cream, capsules, and soap — and an authenticity verification system so customers know they received the real product.

Our formulas center on Glutathione and complementary naturals rather than harsh shortcuts. We explicitly advise avoiding mercury and hydroquinone in whitening products.

International reach, repeat customers, and transparent verify-your-product tooling define the Vita Glow experience beyond packaging claims alone.`,
    coverImageUrl: "/blog/difference.svg",
    metaTitle: "Vita Glow vs Other Skincare Brands",
    metaDescription:
      "What makes Vita Glow different: natural glutathione formulas, authenticity codes, and a complete cream–capsule–soap range.",
    publishedAt: new Date("2023-08-28"),
  },
];

const testimonials = [
  {
    author: "Kenjii",
    body: "I have ordered this product and I have got amazing results. Thank you for this product — it's really good.",
    sortOrder: 1,
  },
  {
    author: "Anthe",
    body: "It's a great change in our life when we started to take it. We feel the change on our skin and look attractive. Keep supporting.",
    sortOrder: 2,
  },
  {
    author: "Anthena",
    body: "The product gives desirable outcomes and is really effective within a short period. Thanks for your product.",
    sortOrder: 3,
  },
];

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@vitaglowproducts.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "changeme123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, name: "Vita Glow Admin" },
    create: { email, passwordHash, name: "Vita Glow Admin" },
  });

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  const existingTestimonials = await prisma.testimonial.count();
  if (existingTestimonials === 0) {
    await prisma.testimonial.createMany({ data: testimonials });
  }

  console.log("Seed complete.");
  console.log(`Admin: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
