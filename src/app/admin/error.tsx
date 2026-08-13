"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-display text-3xl">Admin error</h1>
      <p className="text-sm text-muted">
        {error.message || "Something went wrong loading the admin panel."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-full bg-ink px-5 py-2 text-sm text-white"
      >
        Try again
      </button>
    </div>
  );
}
