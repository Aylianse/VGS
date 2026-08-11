"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteTestimonialAction,
  saveTestimonialAction,
} from "@/lib/actions/admin";
import type { AdminTestimonial } from "@/lib/admin-types";
import { AdminRecordList } from "@/components/admin/AdminRecordList";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { runAdminAction } from "@/components/admin/admin-form-utils";

export function TestimonialAdminPanel({ testimonials }: { testimonials: AdminTestimonial[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<AdminTestimonial | null>(null);

  function startNew() {
    setSelected(null);
  }

  return (
    <section className="grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
      <form
        key={selected?.id ?? "new-testimonial"}
        className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
        action={(formData) =>
          runAdminAction(saveTestimonialAction, formData, startTransition, router, "Testimonial saved")
        }
      >
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
          <div>
            <h2 className="font-display text-2xl">
              {selected ? "Edit testimonial" : "New testimonial"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {selected ? `Updating review by ${selected.author}` : "Add a customer review."}
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
          <Label htmlFor="author">Author</Label>
          <Input id="author" name="author" required defaultValue={selected?.author ?? ""} />
        </div>

        <div>
          <Label htmlFor="body">Review text</Label>
          <Textarea id="body" name="body" required defaultValue={selected?.body ?? ""} className="min-h-32" />
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

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={selected?.published ?? true} />
          Published
        </label>

        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : selected ? "Update testimonial" : "Create testimonial"}
        </Button>
      </form>

      <div className="space-y-3">
        <AdminRecordList
          items={testimonials}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
          onNew={startNew}
          newLabel="New testimonial"
          emptyLabel="No testimonials yet."
          renderTitle={(item) => item.author}
          renderSubtitle={(item) => item.body.slice(0, 80)}
        />
        {selected && (
          <form
            action={(formData) =>
              runAdminAction(
                deleteTestimonialAction,
                formData,
                startTransition,
                router,
                "Testimonial deleted",
                () => setSelected(null),
              )
            }
          >
            <input type="hidden" name="id" value={selected.id} />
            <Button type="submit" variant="outline" size="sm" disabled={pending} className="w-full">
              Delete selected testimonial
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
