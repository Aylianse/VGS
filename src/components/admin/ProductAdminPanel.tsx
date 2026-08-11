"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteProductAction,
  saveProductAction,
} from "@/lib/actions/admin";
import type { AdminProduct } from "@/lib/admin-types";
import { AdminRecordList } from "@/components/admin/AdminRecordList";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { LexicalEditorField } from "@/components/admin/LexicalEditorField";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { runAdminAction } from "@/components/admin/admin-form-utils";

export function ProductAdminPanel({ products }: { products: AdminProduct[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<AdminProduct | null>(null);

  function startNew() {
    setSelected(null);
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
            <h2 className="font-display text-2xl">{selected ? "Edit product" : "New product"}</h2>
            <p className="mt-1 text-sm text-muted">
              {selected ? `Updating ${selected.name}` : "Create a product with rich description and Cloudinary image."}
            </p>
          </div>
          {selected && (
            <Button type="button" variant="outline" size="sm" onClick={startNew}>
              Cancel edit
            </Button>
          )}
        </div>

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

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={selected?.published ?? true} />
          Published
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
