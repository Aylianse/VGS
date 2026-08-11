"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { generateCodesAction, searchCodeAction, updateCodeStatusAction } from "@/lib/actions/admin";
import {
  downloadCodesExcel,
  downloadCodesPdf,
  downloadCodesTxt,
  type CodeExportMeta,
} from "@/lib/code-exports";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

type ProductOption = { id: string; name: string };

type DownloadFormat = "txt" | "pdf" | "excel";

export function CodesAdmin({
  products,
  unusedCount,
}: {
  products: ProductOption[];
  unusedCount: number;
}) {
  const [pending, startTransition] = useTransition();
  const [exportMeta, setExportMeta] = useState<CodeExportMeta | null>(null);
  const [downloadedFormats, setDownloadedFormats] = useState<DownloadFormat[]>([]);
  const [searchResult, setSearchResult] = useState<{
    id: string;
    code: string;
    status: string;
    validationCount: number;
    maxValidations: number;
    customerName: string | null;
    productName?: string;
  } | null>(null);

  function onGenerate(formData: FormData) {
    startTransition(async () => {
      const res = await generateCodesAction(formData);
      if ("error" in res && res.error) {
        toast.error(res.error);
        return;
      }
      if ("codes" in res && res.codes) {
        setExportMeta({
          codes: res.codes,
          productName: res.productName ?? "Product",
          customerName: res.customerName ?? "Batch",
          generatedAt: new Date(),
        });
        setDownloadedFormats([]);
        toast.success(`Generated ${res.count} codes — download as PDF, Excel, or TXT`);
      }
    });
  }

  function onSearch(formData: FormData) {
    startTransition(async () => {
      const res = await searchCodeAction(formData);
      if ("error" in res && res.error) {
        toast.error(res.error);
        setSearchResult(null);
        return;
      }
      if ("result" in res && res.result) {
        setSearchResult({
          id: res.result.id,
          code: res.result.code,
          status: res.result.status,
          validationCount: res.result.validationCount,
          maxValidations: res.result.maxValidations,
          customerName: res.result.customerName,
          productName: res.result.product?.name,
        });
      }
    });
  }

  function handleDownload(format: DownloadFormat) {
    if (!exportMeta) return;

    if (format === "txt") downloadCodesTxt(exportMeta);
    if (format === "pdf") downloadCodesPdf(exportMeta);
    if (format === "excel") downloadCodesExcel(exportMeta);

    setDownloadedFormats((current) =>
      current.includes(format) ? current : [...current, format],
    );
    toast.success(`Downloaded ${format.toUpperCase()} file`);
  }

  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <form action={onGenerate} className="space-y-3 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-2xl">Generate codes</h2>
        <p className="text-sm text-muted">Unused active codes: {unusedCount}</p>
        <div>
          <Label htmlFor="productId">Product</Label>
          <select
            id="productId"
            name="productId"
            required
            className="flex h-11 w-full rounded-xl border border-border bg-card px-4 text-sm"
          >
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="customerName">Customer / batch name</Label>
          <Input id="customerName" name="customerName" required />
        </div>
        <div>
          <Label htmlFor="count">Count</Label>
          <Input id="count" name="count" type="number" defaultValue={10} min={1} max={20000} />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Working…" : "Generate"}
        </Button>

        {exportMeta && exportMeta.codes.length > 0 && (
          <div className="rounded-xl bg-cream p-4">
            <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{exportMeta.codes.length} codes ready</p>
                <p className="text-xs text-muted">
                  {exportMeta.productName} · {exportMeta.customerName}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => handleDownload("pdf")}>
                  {downloadedFormats.includes("pdf") ? "PDF ✓" : "PDF"}
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => handleDownload("excel")}>
                  {downloadedFormats.includes("excel") ? "Excel ✓" : "Excel"}
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => handleDownload("txt")}>
                  {downloadedFormats.includes("txt") ? "TXT ✓" : "TXT"}
                </Button>
              </div>
            </div>
            <pre className="max-h-48 overflow-auto rounded-lg border border-border bg-card p-3 text-xs">
              {exportMeta.codes.join("\n")}
            </pre>
            {downloadedFormats.length > 0 && (
              <p className="mt-2 text-xs text-muted">
                Downloaded: {downloadedFormats.map((f) => f.toUpperCase()).join(", ")} — you can
                download again anytime.
              </p>
            )}
          </div>
        )}
      </form>

      <div className="space-y-6">
        <form action={onSearch} className="space-y-3 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-2xl">Search code</h2>
          <Input name="code" placeholder="CODE" required className="font-mono" />
          <Button type="submit" variant="outline" disabled={pending}>
            Search
          </Button>
        </form>

        {searchResult && (
          <div className="rounded-2xl border border-border bg-card p-5 text-sm">
            <p className="font-mono text-lg">{searchResult.code}</p>
            <p className="mt-2">Status: {searchResult.status}</p>
            <p>
              Validations: {searchResult.validationCount}/{searchResult.maxValidations}
            </p>
            <p>Customer: {searchResult.customerName || "—"}</p>
            <p>Product: {searchResult.productName || "—"}</p>
            <form
              action={(fd) => {
                startTransition(async () => {
                  const res = await updateCodeStatusAction(fd);
                  if ("error" in res && res.error) toast.error(res.error);
                  else toast.success("Status updated");
                });
              }}
              className="mt-4 flex gap-2"
            >
              <input type="hidden" name="id" value={searchResult.id} />
              <select
                name="status"
                defaultValue={searchResult.status}
                className="h-10 rounded-xl border border-border px-3 text-sm"
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
              </select>
              <Button type="submit" size="sm" variant="outline">
                Update
              </Button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
