"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  deleteBlogAction,
  deleteProductAction,
  deleteTestimonialAction,
  logoutAction,
  saveBlogAction,
  saveProductAction,
  saveTestimonialAction,
  type ActionResult,
} from "@/lib/actions/admin";
import { ADMIN_TABS, type AdminTabId } from "@/lib/admin-tabs";
import { CodesAdmin } from "@/components/admin/CodesAdmin";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

const TABS = ADMIN_TABS;

type TabId = AdminTabId;

type Product = {
  id: string;
  name: string;
  slug: string;
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
};

type Testimonial = {
  id: string;
  author: string;
  body: string;
};

type AdminDashboardProps = {
  email: string;
  initialTab: TabId;
  products: Product[];
  posts: BlogPost[];
  testimonials: Testimonial[];
  unusedCount: number;
};

function runAction(
  action: (formData: FormData) => Promise<ActionResult>,
  formData: FormData,
  startTransition: ReturnType<typeof useTransition>[1],
  successMessage: string,
) {
  startTransition(async () => {
    const result = await action(formData);
    if (result?.error) {
      toast.error(result.error);
      if (result.error.includes("log in")) {
        window.location.assign("/admin/login");
      }
      return;
    }
    toast.success(successMessage);
  });
}

export function AdminDashboard({
  email,
  initialTab,
  products,
  posts,
  testimonials,
  unusedCount,
}: AdminDashboardProps) {
  const [tab, setTab] = useState<TabId>(initialTab);
  const [pending, startTransition] = useTransition();

  function switchTab(nextTab: TabId) {
    setTab(nextTab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", nextTab);
    window.history.replaceState(null, "", url);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
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
            className={`rounded-full px-4 py-2 text-sm ${
              tab === item.id ? "bg-rose text-white" : "bg-cream text-ink hover:bg-blush/40"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "products" && (
        <section className="grid gap-8 lg:grid-cols-2">
          <form
            className="space-y-3 rounded-2xl border border-border bg-card p-5"
            action={(formData) =>
              runAction(saveProductAction, formData, startTransition, "Product saved")
            }
          >
            <h2 className="font-display text-2xl">Add / update product</h2>
            <p className="text-xs text-muted">Leave ID empty to create. Paste existing ID to update.</p>
            <div>
              <Label htmlFor="id">ID (optional, for update)</Label>
              <Input id="id" name="id" />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="slug">Slug (optional)</Label>
              <Input id="slug" name="slug" />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required />
            </div>
            <div>
              <Label htmlFor="usageInstructions">Usage instructions</Label>
              <Textarea id="usageInstructions" name="usageInstructions" />
            </div>
            <ImageUploadField
              name="imageUrl"
              label="Product image"
              folder="products"
              placeholder="/uploads/products/your-image.jpg"
            />
            <div>
              <Label htmlFor="metaTitle">SEO title</Label>
              <Input id="metaTitle" name="metaTitle" />
            </div>
            <div>
              <Label htmlFor="metaDescription">SEO description</Label>
              <Textarea id="metaDescription" name="metaDescription" />
            </div>
            <div>
              <Label htmlFor="sortOrder">Sort order</Label>
              <Input id="sortOrder" name="sortOrder" type="number" defaultValue={0} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked />
              Published
            </label>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save product"}
            </Button>
          </form>

          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="rounded-2xl border border-border bg-card p-4">
                <p className="font-medium">{product.name}</p>
                <p className="text-xs text-muted">
                  {product.slug} · {product.id}
                </p>
                <form
                  className="mt-3"
                  action={(formData) =>
                    runAction(deleteProductAction, formData, startTransition, "Product deleted")
                  }
                >
                  <input type="hidden" name="id" value={product.id} />
                  <Button type="submit" variant="outline" size="sm" disabled={pending}>
                    Delete
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "codes" && (
        <CodesAdmin
          products={products.map((product) => ({ id: product.id, name: product.name }))}
          unusedCount={unusedCount}
        />
      )}

      {tab === "blog" && (
        <section className="grid gap-8 lg:grid-cols-2">
          <form
            className="space-y-3 rounded-2xl border border-border bg-card p-5"
            action={(formData) =>
              runAction(saveBlogAction, formData, startTransition, "Post saved")
            }
          >
            <h2 className="font-display text-2xl">Add / update post</h2>
            <Input name="id" placeholder="ID to update (optional)" />
            <Input name="title" placeholder="Title" required />
            <Input name="slug" placeholder="Slug (optional)" />
            <Textarea name="excerpt" placeholder="Excerpt" required />
            <Textarea name="body" placeholder="Body" required className="min-h-40" />
            <ImageUploadField
              name="coverImageUrl"
              label="Cover image"
              folder="blog"
              placeholder="/uploads/blog/your-cover.jpg"
            />
            <Input name="metaTitle" placeholder="SEO title" />
            <Textarea name="metaDescription" placeholder="SEO description" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked />
              Published
            </label>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save post"}
            </Button>
          </form>
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="rounded-2xl border border-border bg-card p-4">
                <p className="font-medium">{post.title}</p>
                <p className="text-xs text-muted">{post.slug}</p>
                <form
                  className="mt-3"
                  action={(formData) =>
                    runAction(deleteBlogAction, formData, startTransition, "Post deleted")
                  }
                >
                  <input type="hidden" name="id" value={post.id} />
                  <Button type="submit" variant="outline" size="sm" disabled={pending}>
                    Delete
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "testimonials" && (
        <section className="grid gap-8 lg:grid-cols-2">
          <form
            className="space-y-3 rounded-2xl border border-border bg-card p-5"
            action={(formData) =>
              runAction(saveTestimonialAction, formData, startTransition, "Testimonial saved")
            }
          >
            <h2 className="font-display text-2xl">Add / update testimonial</h2>
            <Input name="id" placeholder="ID to update (optional)" />
            <Input name="author" placeholder="Author" required />
            <Textarea name="body" placeholder="Review text" required />
            <Input name="sortOrder" type="number" defaultValue={0} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked />
              Published
            </label>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save testimonial"}
            </Button>
          </form>
          <div className="space-y-3">
            {testimonials.map((item) => (
              <div key={item.id} className="rounded-2xl border border-border bg-card p-4">
                <p className="font-medium">{item.author}</p>
                <p className="mt-1 text-sm text-muted">{item.body}</p>
                <form
                  className="mt-3"
                  action={(formData) =>
                    runAction(
                      deleteTestimonialAction,
                      formData,
                      startTransition,
                      "Testimonial deleted",
                    )
                  }
                >
                  <input type="hidden" name="id" value={item.id} />
                  <Button type="submit" variant="outline" size="sm" disabled={pending}>
                    Delete
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
