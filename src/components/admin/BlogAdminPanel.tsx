"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteBlogAction,
  saveBlogAction,
} from "@/lib/actions/admin";
import type { AdminBlogPost } from "@/lib/admin-types";
import { AdminRecordList } from "@/components/admin/AdminRecordList";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { LexicalEditorField } from "@/components/admin/LexicalEditorField";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { runAdminAction } from "@/components/admin/admin-form-utils";

export function BlogAdminPanel({ posts }: { posts: AdminBlogPost[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<AdminBlogPost | null>(null);

  function startNew() {
    setSelected(null);
  }

  return (
    <section className="grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
      <form
        key={selected?.id ?? "new-post"}
        className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
        action={(formData) =>
          runAdminAction(saveBlogAction, formData, startTransition, router, "Post saved")
        }
      >
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
          <div>
            <h2 className="font-display text-2xl">{selected ? "Edit post" : "New post"}</h2>
            <p className="mt-1 text-sm text-muted">
              {selected ? `Updating ${selected.title}` : "Write with the Lexical rich-text editor."}
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
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required defaultValue={selected?.title ?? ""} />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" placeholder="auto-generated from title" defaultValue={selected?.slug ?? ""} />
          </div>
        </div>

        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" name="excerpt" required defaultValue={selected?.excerpt ?? ""} />
        </div>

        <LexicalEditorField
          name="body"
          label="Body"
          defaultValue={selected?.body ?? ""}
          minHeight="320px"
          required
        />

        <ImageUploadField
          name="coverImageUrl"
          label="Cover image"
          folder="blog"
          defaultValue={selected?.coverImageUrl ?? ""}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="metaTitle">SEO title</Label>
            <Input id="metaTitle" name="metaTitle" defaultValue={selected?.metaTitle ?? ""} />
          </div>
          <div>
            <Label htmlFor="metaDescription">SEO description</Label>
            <Textarea
              id="metaDescription"
              name="metaDescription"
              defaultValue={selected?.metaDescription ?? ""}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={selected?.published ?? true} />
          Published
        </label>

        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : selected ? "Update post" : "Create post"}
        </Button>
      </form>

      <div className="space-y-3">
        <AdminRecordList
          items={posts}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
          onNew={startNew}
          newLabel="New post"
          emptyLabel="No blog posts yet."
          renderTitle={(item) => item.title}
          renderSubtitle={(item) => item.slug}
        />
        {selected && (
          <form
            action={(formData) =>
              runAdminAction(
                deleteBlogAction,
                formData,
                startTransition,
                router,
                "Post deleted",
                () => setSelected(null),
              )
            }
          >
            <input type="hidden" name="id" value={selected.id} />
            <Button type="submit" variant="outline" size="sm" disabled={pending} className="w-full">
              Delete selected post
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
