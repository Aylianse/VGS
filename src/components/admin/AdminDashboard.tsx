"use client";

import { useState } from "react";
import { logoutAction } from "@/lib/actions/admin";
import { ADMIN_TABS, type AdminTabId } from "@/lib/admin-tabs";
import type { AdminBlogPost, AdminCarouselSlide, AdminProduct, AdminTestimonial } from "@/lib/admin-types";
import { BlogAdminPanel } from "@/components/admin/BlogAdminPanel";
import { CarouselAdminPanel } from "@/components/admin/CarouselAdminPanel";
import { CodesAdmin } from "@/components/admin/CodesAdmin";
import { ProductAdminPanel } from "@/components/admin/ProductAdminPanel";
import { TestimonialAdminPanel } from "@/components/admin/TestimonialAdminPanel";
import { Button } from "@/components/ui/button";

const TABS = ADMIN_TABS;

type AdminDashboardProps = {
  email: string;
  initialTab: AdminTabId;
  products: AdminProduct[];
  posts: AdminBlogPost[];
  testimonials: AdminTestimonial[];
  carouselSlides: AdminCarouselSlide[];
  unusedCount: number;
};

export function AdminDashboard({
  email,
  initialTab,
  products,
  posts,
  testimonials,
  carouselSlides,
  unusedCount,
}: AdminDashboardProps) {
  const [tab, setTab] = useState<AdminTabId>(initialTab);

  function switchTab(nextTab: AdminTabId) {
    setTab(nextTab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", nextTab);
    window.history.replaceState(null, "", url);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card/80 p-6 shadow-sm">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-rose-deep">Dashboard</p>
          <h1 className="font-display text-4xl">Admin</h1>
          <p className="text-sm text-muted">{email}</p>
        </div>
        <form action={logoutAction}>
          <Button type="submit" variant="outline">
            Log out
          </Button>
        </form>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => switchTab(item.id)}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              tab === item.id ? "bg-rose text-white" : "bg-cream text-ink hover:bg-blush/40"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "carousel" && <CarouselAdminPanel slides={carouselSlides} />}
      {tab === "products" && <ProductAdminPanel products={products} />}
      {tab === "codes" && (
        <CodesAdmin
          products={products.map((product) => ({ id: product.id, name: product.name }))}
          unusedCount={unusedCount}
        />
      )}
      {tab === "blog" && <BlogAdminPanel posts={posts} />}
      {tab === "testimonials" && <TestimonialAdminPanel testimonials={testimonials} />}
    </div>
  );
}
