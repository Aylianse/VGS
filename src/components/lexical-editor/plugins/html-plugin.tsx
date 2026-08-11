import * as React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot } from "lexical";

interface HtmlPluginProps {
  initialHtml?: string;
  onChange?: (html: string) => void;
}

/** Strip OllAdmin fidelity blob if present in legacy content. */
function stripLexicalStateBlob(html: string) {
  return html.replace(
    /<span[^>]*data-lexical-state="[^"]*"[^>]*>\s*<\/span>/gi,
    "",
  ).trim();
}

export function HtmlPlugin({ initialHtml, onChange }: HtmlPluginProps): null {
  const [editor] = useLexicalComposerContext();
  const hasInitialized = React.useRef(false);
  const lastHtml = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (hasInitialized.current) return;

    const html = stripLexicalStateBlob(initialHtml ?? "");
    if (!html) {
      hasInitialized.current = true;
      return;
    }

    editor.update(() => {
      const root = $getRoot();
      root.clear();
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      if (nodes.length > 0) {
        root.append(...nodes);
      }
      lastHtml.current = html;
      hasInitialized.current = true;
    });
  }, [editor, initialHtml]);

  React.useEffect(() => {
    if (!onChange) return;

    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        // HTML only — do not embed full Lexical JSON (payload gets huge and
        // breaks create/update form submissions in admin).
        const html = $generateHtmlFromNodes(editor, null);
        if (html !== lastHtml.current) {
          lastHtml.current = html;
          onChange(html);
        }
      });
    });
  }, [editor, onChange]);

  return null;
}
