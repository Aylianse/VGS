"use client";

import { useEffect, useRef, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  type EditorState,
  type LexicalEditor,
} from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
} from "@lexical/list";
import { $createHeadingNode, $createQuoteNode, HeadingNode, QuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $isLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const theme = {
  paragraph: "lexical-paragraph",
  heading: {
    h2: "lexical-h2",
    h3: "lexical-h3",
  },
  list: {
    ul: "lexical-ul",
    ol: "lexical-ol",
    listitem: "lexical-li",
  },
  link: "lexical-link",
  quote: "lexical-quote",
  text: {
    bold: "lexical-bold",
    italic: "lexical-italic",
    underline: "lexical-underline",
  },
};

function syncHiddenField(editor: LexicalEditor, hiddenRef: React.RefObject<HTMLInputElement | null>) {
  if (!hiddenRef.current) return;
  editor.read(() => {
    hiddenRef.current!.value = $generateHtmlFromNodes(editor, null);
  });
}

function InitialHtmlPlugin({
  html,
  hiddenRef,
}: {
  html: string;
  hiddenRef: React.RefObject<HTMLInputElement | null>;
}) {
  const [editor] = useLexicalComposerContext();
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !html) return;
    loaded.current = true;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      $getRoot().clear();
      $getRoot().append(...nodes);
    });

    syncHiddenField(editor, hiddenRef);
  }, [editor, html, hiddenRef]);

  return null;
}

function HiddenFieldPlugin({ hiddenRef }: { hiddenRef: React.RefObject<HTMLInputElement | null> }) {
  return (
    <OnChangePlugin
      onChange={(_editorState: EditorState, editor: LexicalEditor) => {
        syncHiddenField(editor, hiddenRef);
      }}
    />
  );
}

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "rounded-md px-2 py-1 text-xs font-medium transition-colors",
        active ? "bg-rose text-white" : "bg-cream text-ink hover:bg-blush/50",
      )}
    >
      {children}
    </button>
  );
}

function useFormatActive(format: "bold" | "italic" | "underline") {
  const [editor] = useLexicalComposerContext();
  const [active, setActive] = useState(false);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        editor.getEditorState().read(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            setActive(false);
            return;
          }
          setActive(selection.hasFormat(format));
        });
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor, format]);

  return active;
}

function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const isBold = useFormatActive("bold");
  const isItalic = useFormatActive("italic");
  const isUnderline = useFormatActive("underline");

  function setHeading(tag: "h2" | "h3") {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  }

  function setQuote() {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  }

  function toggleLink() {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const node = selection.getNodes()[0];
      const parent = node?.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        return;
      }

      const url = window.prompt("Enter link URL");
      if (url) editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    });
  }

  return (
    <div className="flex flex-wrap gap-1 border-b border-border bg-ivory/80 p-2">
      <ToolbarButton title="Bold" active={isBold} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}>
        B
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        active={isItalic}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        I
      </ToolbarButton>
      <ToolbarButton
        title="Underline"
        active={isUnderline}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      >
        U
      </ToolbarButton>
      <span className="mx-1 w-px self-stretch bg-border" />
      <ToolbarButton title="Heading 2" onClick={() => setHeading("h2")}>
        H2
      </ToolbarButton>
      <ToolbarButton title="Heading 3" onClick={() => setHeading("h3")}>
        H3
      </ToolbarButton>
      <ToolbarButton title="Quote" onClick={setQuote}>
        Quote
      </ToolbarButton>
      <span className="mx-1 w-px self-stretch bg-border" />
      <ToolbarButton
        title="Bullet list"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
      >
        • List
      </ToolbarButton>
      <ToolbarButton
        title="Numbered list"
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
      >
        1. List
      </ToolbarButton>
      <ToolbarButton title="Link" onClick={toggleLink}>
        Link
      </ToolbarButton>
      <span className="mx-1 w-px self-stretch bg-border" />
      <ToolbarButton title="Undo" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
        Undo
      </ToolbarButton>
      <ToolbarButton title="Redo" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
        Redo
      </ToolbarButton>
    </div>
  );
}

type LexicalEditorFieldProps = {
  name: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  minHeight?: string;
  required?: boolean;
};

export function LexicalEditorField({
  name,
  label,
  defaultValue = "",
  placeholder = "Write content…",
  minHeight = "220px",
  required = false,
}: LexicalEditorFieldProps) {
  const hiddenRef = useRef<HTMLInputElement>(null);
  const editorKey = `${name}-${defaultValue.slice(0, 24)}`;

  const initialConfig = {
    namespace: `LexicalEditor-${name}`,
    theme,
    onError(error: Error) {
      console.error(error);
    },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <input ref={hiddenRef} type="hidden" name={name} defaultValue={defaultValue} required={required} />
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <LexicalComposer key={editorKey} initialConfig={initialConfig}>
          <Toolbar />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="lexical-editor px-4 py-3 outline-none"
                  style={{ minHeight }}
                  aria-placeholder={placeholder}
                  placeholder={
                    <div className="pointer-events-none absolute left-4 top-3 text-sm text-muted">
                      {placeholder}
                    </div>
                  }
                />
              }
              placeholder={null}
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <InitialHtmlPlugin html={defaultValue} hiddenRef={hiddenRef} />
          <HiddenFieldPlugin hiddenRef={hiddenRef} />
        </LexicalComposer>
      </div>
    </div>
  );
}
