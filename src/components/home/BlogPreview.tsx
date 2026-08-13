import Image from "next/image";
import Link from "next/link";
import { plainTextPreview } from "@/lib/sanitize-html";
import type { BlogPost } from "@prisma/client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BlogPreview({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="border-t border-border bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted">Blogs</p>
            <h2 className="mt-3 font-display text-4xl text-ink">From the journal</h2>
          </div>
          <Link href="/blog" className={cn(buttonVariants({ variant: "outline" }))}>
            View more
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-muted">Blog posts will appear after seeding.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-[1.5rem] border border-border bg-card"
              >
                <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] bg-zinc-50">
                  {post.coverImageUrl && (
                    <Image
                      src={post.coverImageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                </Link>
                <div className="p-5">
                  <time className="text-xs uppercase tracking-wider text-muted">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                  <h3 className="mt-2 font-display text-xl leading-snug">
                    <Link href={`/blog/${post.slug}`} className="hover:text-ink">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-muted">
                    {plainTextPreview(post.excerpt, 140)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
