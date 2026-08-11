"use client";

import { useEffect, useRef } from "react";
import { LexicalEditor } from "@/components/lexical-editor/lexical-editor";
import { Label } from "@/components/ui/input";
import "@/components/lexical-editor/lexical-editor.scss";

type LexicalEditorFieldProps = {
  name: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  minHeight?: string;
  required?: boolean;
  uploadFolder?: "products" | "blog" | "general";
};

export function LexicalEditorField({
  name,
  label,
  defaultValue = "",
  placeholder = "Type '/' for commands…",
  required = false,
  uploadFolder = "blog",
}: LexicalEditorFieldProps) {
  const hiddenRef = useRef<HTMLInputElement>(null);
  const editorKey = `${name}-${defaultValue.slice(0, 32)}`;

  useEffect(() => {
    if (hiddenRef.current) {
      hiddenRef.current.value = defaultValue;
    }
  }, [defaultValue, editorKey]);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <input
        ref={hiddenRef}
        type="hidden"
        name={name}
        defaultValue={defaultValue}
        required={required}
      />
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <LexicalEditor
          key={editorKey}
          content={defaultValue}
          placeholder={placeholder}
          uploadContainer={uploadFolder}
          onChange={(html) => {
            if (hiddenRef.current) hiddenRef.current.value = html;
          }}
        />
      </div>
    </div>
  );
}
