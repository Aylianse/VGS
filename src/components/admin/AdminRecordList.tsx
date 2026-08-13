"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminRecordListProps<T extends { id: string }> = {
  items: T[];
  selectedId: string | null;
  onSelect: (item: T) => void;
  onNew: () => void;
  renderTitle: (item: T) => string;
  renderSubtitle?: (item: T) => string;
  emptyLabel?: string;
  newLabel?: string;
};

export function AdminRecordList<T extends { id: string }>({
  items,
  selectedId,
  onSelect,
  onNew,
  renderTitle,
  renderSubtitle,
  emptyLabel = "No items yet.",
  newLabel = "New item",
}: AdminRecordListProps<T>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-muted">Saved items</h3>
        <Button type="button" variant="outline" size="sm" onClick={onNew}>
          {newLabel}
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card/50 p-6 text-sm text-muted">
          {emptyLabel}
        </p>
      ) : (
        <div className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className={cn(
                "w-full rounded-2xl border p-4 text-left transition-colors",
                selectedId === item.id
                  ? "border-ink bg-zinc-50"
                  : "border-border bg-card hover:border-zinc-300 hover:bg-zinc-50",
              )}
            >
              <p className="font-medium text-ink">{renderTitle(item)}</p>
              {renderSubtitle && <p className="mt-1 text-xs text-muted">{renderSubtitle(item)}</p>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
