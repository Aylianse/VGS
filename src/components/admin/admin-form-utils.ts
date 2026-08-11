"use client";

import { toast } from "sonner";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { useTransition } from "react";
import type { ActionResult } from "@/lib/actions/admin";

type StartTransition = ReturnType<typeof useTransition>[1];

export function runAdminAction(
  action: (formData: FormData) => Promise<ActionResult>,
  formData: FormData,
  startTransition: StartTransition,
  router: AppRouterInstance,
  successMessage: string,
  onSuccess?: () => void,
) {
  startTransition(async () => {
    const result = await action(formData);
    if (result?.error) {
      toast.error(result.error);
      if (result.error.includes("log in")) {
        window.location.assign("/admin/login");
      }
      return;
    }
    toast.success(successMessage);
    onSuccess?.();
    router.refresh();
  });
}
