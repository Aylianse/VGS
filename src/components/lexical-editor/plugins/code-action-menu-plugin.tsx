import * as React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { $isCodeNode } from "@lexical/code";

export function CodeActionMenuPlugin(): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [activeCodeDOM, setActiveCodeDOM] = React.useState<HTMLElement | null>(null);
  const [codeText, setCodeText] = React.useState("");
  const [coords, setCoords] = React.useState<{ top: number; left: number } | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);

  const checkCodeSelection = React.useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        let current: any = anchorNode;
        let foundCodeNode = null;

        while (current) {
          if ($isCodeNode(current)) {
            foundCodeNode = current;
            break;
          }
          current = current.getParent();
        }

        if (foundCodeNode) {
          const dom = editor.getElementByKey(foundCodeNode.getKey());
          if (dom) {
            setActiveCodeDOM(dom);
            setCodeText(foundCodeNode.getTextContent());
            
            const rect = dom.getBoundingClientRect();
            // Position near the top-right corner of the code block
            setCoords({
              top: rect.top + window.scrollY + 8,
              left: rect.right + window.scrollX - 75,
            });
            return;
          }
        }
      }
      setActiveCodeDOM(null);
      setCoords(null);
    });
  }, [editor]);

  React.useEffect(() => {
    return editor.registerUpdateListener(() => {
      checkCodeSelection();
    });
  }, [editor, checkCodeSelection]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  if (!activeCodeDOM || !coords) return null;

  return (
    <button type="button"
      onClick={handleCopy}
      className="editor-code-copy-button"
      style={{
        position: "absolute",
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        zIndex: 10,
        padding: "4px 8px",
        fontSize: "11px",
        fontWeight: 600,
        borderRadius: "4px",
        border: "1px solid #e2e8f0",
        backgroundColor: isCopied ? "#10b981" : "#ffffff",
        color: isCopied ? "#ffffff" : "#475569",
        cursor: "pointer",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        transition: "all 0.15s ease",
      }}
    >
      {isCopied ? "Copied!" : "Copy"}
    </button>
  );
}
