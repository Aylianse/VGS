"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { loginAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function LoginForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="w-full max-w-md space-y-4 rounded-[1.5rem] border border-border bg-card p-8 shadow-sm"
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const res = await loginAction(formData);
          if (res?.error) {
            setError(res.error);
            toast.error(res.error);
          }
        });
      }}
    >
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-rose-deep">Admin</p>
        <h1 className="mt-2 font-display text-3xl">Sign in</h1>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="username" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Login"}
      </Button>
    </form>
  );
}
