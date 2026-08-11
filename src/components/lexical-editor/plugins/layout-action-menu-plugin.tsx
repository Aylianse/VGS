import * as React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, SELECTION_CHANGE_COMMAND, $getNodeByKey } from "lexical";
import { $isLayoutContainerNode } from "../nodes/LayoutContainerNode";
import { $isLayoutItemNode } from "../nodes/LayoutItemNode";
import { mergeRegister, $findMatchingParent } from "@lexical/utils";
import { UPDATE_LAYOUT_COMMAND } from "./LayoutPlugin/LayoutPlugin";
import { Trash, Plus, Minus } from "lucide-react";

export function LayoutActionMenuPlugin(): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [layoutKey, setLayoutKey] = React.useState<string | null>(null);
  const [coords, setCoords] = React.useState<{ top: number; left: number } | null>(null);

  const checkLayoutSelection = React.useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = selection.anchor.getNode();
      const layoutItem = $findMatchingParent(node, $isLayoutItemNode);
      const layoutContainer = $findMatchingParent(node, $isLayoutContainerNode);
      
      if (layoutContainer && layoutItem) {
        setLayoutKey(layoutContainer.getKey());
        const nativeSelection = window.getSelection();
        if (nativeSelection && nativeSelection.rangeCount > 0) {
          const range = nativeSelection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setCoords({
            top: rect.bottom + window.scrollY + 10,
            left: rect.left + window.scrollX,
          });
        }
      } else {
        setLayoutKey(null);
        setCoords(null);
      }
    } else {
      setLayoutKey(null);
      setCoords(null);
    }
  }, []);

  React.useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          checkLayoutSelection();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          checkLayoutSelection();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, checkLayoutSelection]);

  if (!layoutKey || !coords) return null;

  return (
    <div
      className="layout-action-menu"
      style={{
        position: "absolute",
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        display: "flex",
        gap: "4px",
        padding: "6px",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
        border: "1px solid #cbd5e1",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        zIndex: 100,
        alignItems: "center"
      }}
    >
      <div style={{ fontSize: "11px", fontWeight: "bold", padding: "0 4px", color: "#64748b" }}>Layout</div>
      <button type="button"
        style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "11px", padding: "3px 6px", cursor: "pointer", borderRadius: "4px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#334155" }}
        onClick={() => {
          editor.update(() => {
            const container = $getNodeByKey(layoutKey);
            if ($isLayoutContainerNode(container)) {
               const template = container.getTemplateColumns();
               const cols = template.trim().split(/\s+/).length;
               if (cols < 4) {
                 const newTemplate = Array(cols + 1).fill("1fr").join(" ");
                 editor.dispatchCommand(UPDATE_LAYOUT_COMMAND, { template: newTemplate, nodeKey: layoutKey });
               }
            }
          });
        }}
        title="Add Column"
      >
        <Plus size={12} /> Col
      </button>
      <button type="button"
        style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "11px", padding: "3px 6px", cursor: "pointer", borderRadius: "4px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#334155" }}
        onClick={() => {
          editor.update(() => {
             const container = $getNodeByKey(layoutKey);
             if ($isLayoutContainerNode(container)) {
               const template = container.getTemplateColumns();
               const cols = template.trim().split(/\s+/).length;
               if (cols > 1) {
                 const newTemplate = Array(cols - 1).fill("1fr").join(" ");
                 editor.dispatchCommand(UPDATE_LAYOUT_COMMAND, { template: newTemplate, nodeKey: layoutKey });
               }
             }
          });
        }}
        title="Remove Column"
      >
        <Minus size={12} /> Col
      </button>
      <button type="button"
        style={{ display: "flex", alignItems: "center", gap: "2px", fontSize: "11px", padding: "3px 6px", cursor: "pointer", borderRadius: "4px", border: "none", background: "#fee2e2", color: "#991b1b" }}
        onClick={() => {
          editor.update(() => {
             const container = $getNodeByKey(layoutKey);
             if ($isLayoutContainerNode(container)) {
                container.remove();
             }
          });
        }}
        title="Delete Layout"
      >
        <Trash size={12} /> Delete
      </button>
    </div>
  );
}
