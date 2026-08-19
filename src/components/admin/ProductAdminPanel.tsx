"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import {
  deleteProductAction,
  saveProductAction,
  toggleProductPublishedAction,
} from "@/lib/actions/admin";
import type { AdminProduct } from "@/lib/admin-types";
import { AdminRecordList } from "@/components/admin/AdminRecordList";
import { PublishStatusBadge } from "@/components/admin/PublishStatusBadge";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { LexicalEditorField } from "@/components/admin/LexicalEditorField";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { runAdminAction } from "@/components/admin/admin-form-utils";
import { cn } from "@/lib/utils";

export function ProductAdminPanel({ products }: { products: AdminProduct[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<AdminProduct | null>(null);

  function startNew() {
    setSelected(null);
  }

  function toggleVisibility() {
    if (!selected) return;

    const formData = new FormData();
    formData.set("id", selected.id);
    const willPublish = !selected.published;

    runAdminAction(
      toggleProductPublishedAction,
      formData,
      startTransition,
      router,
      willPublish ? "Product is now live on the website" : "Product hidden from the website",
      () => setSelected((prev) => (prev ? { ...prev, published: willPublish } : null)),
    );
  }

  return (
    <section className="grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
      <form
        key={selected?.id ?? "new-product"}
        className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
        action={(formData) =>
          runAdminAction(saveProductAction, formData, startTransition, router, "Product saved")
        }
      >
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl">{selected ? "Edit product" : "New product"}</h2>
              {selected && <PublishStatusBadge published={selected.published} />}
            </div>
            <p className="mt-1 text-sm text-muted">
              {selected
                ? selected.published
                  ? "This product is visible on the home page, products page, and its detail page."
                  : "This product is saved but hidden from the public website."
                : "Create a product with rich description and Cloudinary image."}
            </p>
          </div>
          {selected && (
            <Button type="button" variant="outline" size="sm" onClick={startNew}>
              Cancel edit
            </Button>
          )}
        </div>

        {selected && (
          <div
            className={cn(
              "flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3",
              selected.published
                ? "border-success/30 bg-success/5"
                : "border-amber-500/30 bg-amber-500/5",
            )}
          >
            <div>
              <p className="text-sm font-medium text-ink">
                {selected.published ? "Published on website" : "Unpublished (draft)"}
              </p>
              <p className="text-xs text-muted">
                {selected.published
                  ? "Visitors can browse and open this product."
                  : "Only you can see this in admin until you publish again."}
              </p>
            </div>
            <Button
              type="button"
              variant={selected.published ? "outline" : "primary"}
              size="sm"
              disabled={pending}
              onClick={toggleVisibility}
              className="shrink-0"
            >
              {selected.published ? (
                <>
                  <EyeOff className="size-4" />
                  Unpublish
                </>
              ) : (
                <>
                  <Eye className="size-4" />
                  Publish
                </>
              )}
            </Button>
          </div>
        )}

        {selected && <input type="hidden" name="id" value={selected.id} />}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required defaultValue={selected?.name ?? ""} />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" placeholder="auto-generated from name" defaultValue={selected?.slug ?? ""} />
          </div>
        </div>

        <LexicalEditorField
          name="description"
          label="Description"
          defaultValue={selected?.description ?? ""}
          required
          uploadFolder="products"
        />

        <LexicalEditorField
          name="usageInstructions"
          label="Usage instructions"
          defaultValue={selected?.usageInstructions ?? ""}
          uploadFolder="products"
        />

        <ImageUploadField
          name="imageUrl"
          label="Product image"
          folder="products"
          defaultValue={selected?.imageUrls[0] ?? ""}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="metaTitle">SEO title</Label>
            <Input id="metaTitle" name="metaTitle" defaultValue={selected?.metaTitle ?? ""} />
          </div>
          <div>
            <Label htmlFor="sortOrder">Sort order</Label>
            <Input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={selected?.sortOrder ?? 0}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="metaDescription">SEO description</Label>
          <Textarea
            id="metaDescription"
            name="metaDescription"
            defaultValue={selected?.metaDescription ?? ""}
          />
        </div>

        <label className="flex items-start gap-2 rounded-xl border border-border bg-cream/50 p-3 text-sm">
          <input
            type="checkbox"
            name="published"
            className="mt-0.5"
            defaultChecked={selected?.published ?? true}
          />
          <span>
            <span className="font-medium text-ink">Published on website</span>
            <span className="mt-0.5 block text-muted">
              Uncheck to save as draft, or use the Publish / Unpublish button above for instant changes.
            </span>
          </span>
        </label>

        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : selected ? "Update product" : "Create product"}
        </Button>
      </form>

      <div className="space-y-3">
        <AdminRecordList
          items={products}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
          onNew={startNew}
          newLabel="New product"
          emptyLabel="No products yet. Create your first one."
          renderTitle={(item) => item.name}
          renderSubtitle={(item) => item.slug}
          renderBadge={(item) => <PublishStatusBadge published={item.published} compact />}
        />
        {selected && (
          <form
            action={(formData) =>
              runAdminAction(
                deleteProductAction,
                formData,
                startTransition,
                router,
                "Product deleted",
                () => setSelected(null),
              )
            }
          >
            <input type="hidden" name="id" value={selected.id} />
            <Button type="submit" variant="outline" size="sm" disabled={pending} className="w-full">
              Delete selected product
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
