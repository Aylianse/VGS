import type { Metadata } from "next";
import { VerifyForm } from "@/components/verify/VerifyForm";

export const metadata: Metadata = {
  title: "Verify Your Product",
  description:
    "Enter your Vita Glow packaging code to confirm authenticity and protect against counterfeits.",
};

export default function VerifyPage() {
  return (
    <div className="soft-glow">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-rose-deep">Authenticity</p>
        <h1 className="mt-3 font-display text-5xl text-ink">Verify your product</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted">
          Find the unique code on your Vita Glow packaging and enter it below. Genuine
          products confirm instantly.
        </p>
        <div className="mt-10 text-left">
          <VerifyForm />
        </div>
      </div>
    </div>
  );
}
