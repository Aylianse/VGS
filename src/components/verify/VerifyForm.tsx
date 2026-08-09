"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { whatsappUrl } from "@/lib/site";

type Result =
  | {
      valid: true;
      product_name: string;
      customer_name: string;
      validation_count: number;
      max_validations: number;
      status: string;
    }
  | {
      valid: false;
      reason?: string;
      product_name?: string | null;
      error?: string;
    };

export function VerifyForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });
      const data = (await res.json()) as Result;
      setResult(data);
    } catch {
      setResult({ valid: false, error: "Verification failed. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <form onSubmit={onSubmit} className="space-y-4 rounded-[1.5rem] border border-border bg-card p-6 shadow-sm">
        <div>
          <Label htmlFor="code">Verification code</Label>
          <Input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. AB12CD34"
            required
            autoComplete="off"
            className="font-mono tracking-widest"
          />
        </div>
        <Button type="submit" disabled={loading || !code.trim()} className="w-full">
          {loading ? "Checking…" : "Verify product"}
        </Button>
      </form>

      {result && (
        <div
          className={`mt-6 rounded-[1.5rem] border p-6 ${
            result.valid
              ? "border-success/30 bg-success/5"
              : "border-danger/30 bg-danger/5"
          }`}
        >
          <div className="flex items-start gap-3">
            {result.valid ? (
              <CheckCircle2 className="mt-0.5 size-6 text-success" />
            ) : (
              <XCircle className="mt-0.5 size-6 text-danger" />
            )}
            <div>
              {result.valid ? (
                <>
                  <p className="font-display text-2xl text-success">Authentic product</p>
                  <p className="mt-2 text-sm text-ink/80">
                    Product: <strong>{result.product_name}</strong>
                  </p>
                  <p className="text-sm text-ink/80">
                    Customer: <strong>{result.customer_name}</strong>
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    Validation {result.validation_count} of {result.max_validations} · Status:{" "}
                    {result.status}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-display text-2xl text-danger">
                    {result.reason === "expired" ? "Code expired" : "Invalid code"}
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    {result.error ||
                      (result.reason === "expired"
                        ? "This code has reached its maximum validations."
                        : "We could not find this code. Check the packaging or contact support.")}
                  </p>
                  {result.product_name && (
                    <p className="mt-1 text-sm">Product: {result.product_name}</p>
                  )}
                </>
              )}
              <a
                href={whatsappUrl("Hi, I need help verifying my Vita Glow product.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-rose-deep underline"
              >
                Need help? WhatsApp us
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
