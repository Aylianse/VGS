"use client";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { loginFormAction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Signing in…" : "Login"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginFormAction, undefined);

  useEffect(() => {
    if (state?.success) {
      // Full navigation so the auth cookie is included on the next request
      window.location.assign("/admin");
    }
  }, [state?.success]);

  return (
    <form
      action={formAction}
      className="w-full max-w-md space-y-4 rounded-[1.5rem] border border-border bg-card p-8 shadow-sm"
    >
      <div className="flex flex-col items-center text-center">
        <BrandLogo height={64} className="mb-4" />
        <p className="text-xs uppercase tracking-[0.25em] text-rose-deep">Admin</p>
        <h1 className="mt-2 font-display text-3xl">Sign in</h1>
      </div>
      {state?.error && <p className="text-sm text-danger">{state.error}</p>}
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
      <SubmitButton />
    </form>
  );
}
