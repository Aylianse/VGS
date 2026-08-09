"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { generateCodesAction, searchCodeAction, updateCodeStatusAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

type ProductOption = { id: string; name: string };

export function CodesAdmin({
  products,
  unusedCount,
}: {
  products: ProductOption[];
  unusedCount: number;
}) {
  const [pending, startTransition] = useTransition();
  const [codes, setCodes] = useState<string[]>([]);
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
        setCodes(res.codes);
        toast.success(`Generated ${res.count} codes`);
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

  function downloadCodes() {
    const blob = new Blob([codes.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vita-glow-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
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
        {codes.length > 0 && (
          <div className="rounded-xl bg-cream p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium">{codes.length} codes</p>
              <Button type="button" size="sm" variant="outline" onClick={downloadCodes}>
                Download
              </Button>
            </div>
            <pre className="max-h-48 overflow-auto text-xs">{codes.join("\n")}</pre>
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
