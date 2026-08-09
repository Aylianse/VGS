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

  const [products, posts, testimonials, unusedCount] = await Promise.all([
    prisma.product.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } }),
    prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.verificationCode.count({
      where: { status: "Active", validationCount: { lt: 1 } },
    }),
  ]);

  return (
    <AdminDashboard
      email={session.email}
      initialTab={tab}
      products={products}
      posts={posts}
      testimonials={testimonials}
      unusedCount={unusedCount}
    />
  );
}
