import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { resolveAdminTab } from "@/lib/admin-tabs";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ tab?: string }>;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { tab: tabParam } = await searchParams;
  const tab = resolveAdminTab(tabParam);

  let carouselSlides: Awaited<ReturnType<typeof prisma.carouselSlide.findMany>> = [];
  let products: Awaited<ReturnType<typeof prisma.product.findMany>> = [];
  let posts: Awaited<ReturnType<typeof prisma.blogPost.findMany>> = [];
  let testimonials: Awaited<ReturnType<typeof prisma.testimonial.findMany>> = [];
  let unusedCount = 0;
  let dbError: string | null = null;

  try {
    const [carouselRows, productRows, postRows, testimonialRows, codeCount] = await Promise.all([
      prisma.carouselSlide.findMany({
        orderBy: { sortOrder: "asc" },
      }),
      prisma.product.findMany({
        orderBy: { sortOrder: "asc" },
      }),
      prisma.blogPost.findMany({
        orderBy: { publishedAt: "desc" },
      }),
      prisma.testimonial.findMany({
        orderBy: { sortOrder: "asc" },
      }),
      prisma.verificationCode.count({
        where: { status: "Active", validationCount: { lt: 1 } },
      }),
    ]);
    carouselSlides = carouselRows;
    products = productRows;
    posts = postRows;
    testimonials = testimonialRows;
    unusedCount = codeCount;
  } catch (error) {
    console.error("Admin DB error:", error);
    dbError =
      "Could not load data from the database. Check DATABASE_URL / Neon connection.";
  }

  return (
    <>
      {dbError && (
        <div className="mx-auto max-w-7xl px-4 pt-6">
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {dbError}
          </p>
        </div>
      )}
      <AdminDashboard
        email={session.email}
        initialTab={tab}
        carouselSlides={carouselSlides.map(({ createdAt: _c, updatedAt: _u, ...slide }) => slide)}
        products={products.map(({ createdAt: _c, updatedAt: _u, ...product }) => product)}
        posts={posts.map(({ createdAt: _c, updatedAt: _u, publishedAt: _p, ...post }) => post)}
        testimonials={testimonials.map(({ createdAt: _c, updatedAt: _u, ...item }) => item)}
        unusedCount={unusedCount}
      />
    </>
  );
}
