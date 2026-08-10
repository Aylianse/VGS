"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="max-w-md text-center text-sm text-neutral-600">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-black px-5 py-2 text-sm text-white"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
