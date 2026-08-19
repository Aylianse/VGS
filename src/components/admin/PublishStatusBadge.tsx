import { cn } from "@/lib/utils";

export function PublishStatusBadge({
  published,
  compact = false,
}: {
  published: boolean;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium uppercase tracking-wide",
        compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        published
          ? "bg-success/10 text-success"
          : "bg-amber-500/10 text-amber-700",
      )}
    >
      {published ? "Live" : "Hidden"}
    </span>
  );
}
