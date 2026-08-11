"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteCarouselSlideAction,
  saveCarouselSlideAction,
} from "@/lib/actions/admin";
import type { AdminCarouselSlide } from "@/lib/admin-types";
import { AdminRecordList } from "@/components/admin/AdminRecordList";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { runAdminAction } from "@/components/admin/admin-form-utils";

export function CarouselAdminPanel({ slides }: { slides: AdminCarouselSlide[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<AdminCarouselSlide | null>(null);

  function startNew() {
    setSelected(null);
  }

  return (
    <section className="grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
      <form
        key={selected?.id ?? "new-slide"}
        className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
        action={(formData) =>
          runAdminAction(saveCarouselSlideAction, formData, startTransition, router, "Slide saved")
        }
      >
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
          <div>
            <h2 className="font-display text-2xl">{selected ? "Edit slide" : "New slide"}</h2>
            <p className="mt-1 text-sm text-muted">
              {selected
                ? `Updating “${selected.title}”`
                : "Manage homepage hero carousel slides, text, buttons, and image."}
            </p>
          </div>
          {selected && (
            <Button type="button" variant="outline" size="sm" onClick={startNew}>
              Cancel edit
            </Button>
          )}
        </div>

        {selected && <input type="hidden" name="id" value={selected.id} />}

        <div>
          <Label htmlFor="title">Headline</Label>
          <Input id="title" name="title" required defaultValue={selected?.title ?? ""} />
        </div>

        <div>
          <Label htmlFor="subtitle">Subtitle</Label>
          <Textarea id="subtitle" name="subtitle" required defaultValue={selected?.subtitle ?? ""} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="ctaLabel">Primary button label</Label>
            <Input id="ctaLabel" name="ctaLabel" required defaultValue={selected?.ctaLabel ?? ""} />
          </div>
          <div>
            <Label htmlFor="ctaHref">Primary button link</Label>
            <Input
              id="ctaHref"
              name="ctaHref"
              required
              placeholder="/products"
              defaultValue={selected?.ctaHref ?? ""}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="secondaryCtaLabel">Secondary button label</Label>
            <Input
              id="secondaryCtaLabel"
              name="secondaryCtaLabel"
              placeholder="Know About Us"
              defaultValue={selected?.secondaryCtaLabel ?? "Know About Us"}
            />
          </div>
          <div>
            <Label htmlFor="secondaryCtaHref">Secondary button link</Label>
            <Input
              id="secondaryCtaHref"
              name="secondaryCtaHref"
              placeholder="/about"
              defaultValue={selected?.secondaryCtaHref ?? "/about"}
            />
          </div>
        </div>

        <ImageUploadField
          name="imageUrl"
          label="Hero image (right side)"
          folder="general"
          defaultValue={selected?.imageUrl ?? ""}
        />

        <div>
          <Label htmlFor="imageAlt">Image alt text (SEO)</Label>
          <Input
            id="imageAlt"
            name="imageAlt"
            placeholder="Vita Glow night cream product photo"
            defaultValue={selected?.imageAlt ?? ""}
          />
        </div>

        <div>
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={selected?.sortOrder ?? slides.length + 1}
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={selected?.published ?? true} />
          Published
        </label>

        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : selected ? "Update slide" : "Create slide"}
        </Button>
      </form>

      <div className="space-y-3">
        <AdminRecordList
          items={slides}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
          onNew={startNew}
          newLabel="New slide"
          emptyLabel="No carousel slides yet."
          renderTitle={(item) => item.title}
          renderSubtitle={(item) => `Order ${item.sortOrder} · ${item.published ? "Live" : "Hidden"}`}
        />
        {selected && (
          <form
            action={(formData) =>
              runAdminAction(
                deleteCarouselSlideAction,
                formData,
                startTransition,
                router,
                "Slide deleted",
                () => setSelected(null),
              )
            }
          >
            <input type="hidden" name="id" value={selected.id} />
            <Button type="submit" variant="outline" size="sm" disabled={pending} className="w-full">
              Delete selected slide
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
