"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

type ImageUploadFieldProps = {
  name: string;
  label: string;
  folder?: "products" | "blog" | "general";
  placeholder?: string;
  defaultValue?: string;
};

export function ImageUploadField({
  name,
  label,
  folder = "general",
  placeholder = "https://res.cloudinary.com/...",
  defaultValue = "",
}: ImageUploadFieldProps) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setUrl(defaultValue);
  }, [defaultValue]);

  async function onFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        throw new Error(data.error || "Upload failed");
      }

      setUrl(data.url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder={placeholder}
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={onFileSelected}
          />
          <span className="inline-flex h-9 items-center rounded-full border border-border bg-cream px-4 text-sm hover:bg-blush/40">
            {uploading ? "Uploading…" : "Upload to Cloudinary"}
          </span>
        </label>
        {url && (
          <Button type="button" variant="outline" size="sm" onClick={() => setUrl("")}>
            Clear
          </Button>
        )}
      </div>
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Preview" className="mt-2 h-24 w-24 rounded-lg border border-border object-cover" />
      )}
    </div>
  );
}
