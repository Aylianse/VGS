import { AdminDashboard, resolveAdminTab } from "@/components/admin/AdminDashboard";
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

  let products: Awaited<ReturnType<typeof prisma.product.findMany>> = [];
  let posts: Awaited<ReturnType<typeof prisma.blogPost.findMany>> = [];
  let testimonials: Awaited<ReturnType<typeof prisma.testimonial.findMany>> = [];
  let unusedCount = 0;
  let dbError: string | null = null;

  try {
    [products, posts, testimonials, unusedCount] = await Promise.all([
      prisma.product.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } }),
      prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.verificationCode.count({
        where: { status: "Active", validationCount: { lt: 1 } },
      }),
    ]);
  } catch (error) {
    console.error("Admin DB error:", error);
    dbError =
      "Could not load data from the database. Check DATABASE_URL / Neon connection.";
  }

  return (
    <>
      {dbError && (
        <div className="mx-auto max-w-6xl px-4 pt-6">
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {dbError}
          </p>
        </div>
      )}
      <AdminDashboard
        email={session.email}
        initialTab={tab}
        products={products}
        posts={posts}
        testimonials={testimonials}
        unusedCount={unusedCount}
      />
    </>
  );
}
