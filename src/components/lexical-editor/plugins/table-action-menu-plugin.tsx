import * as React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, SELECTION_CHANGE_COMMAND } from "lexical";
import {
  $isTableCellNode,
  $insertTableRowAtSelection,
  $insertTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $deleteTableColumnAtSelection,
} from "@lexical/table";
import { mergeRegister } from "@lexical/utils";

export function TableActionMenuPlugin(): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [isInTable, setIsInTable] = React.useState(false);
  const [coords, setCoords] = React.useState<{ top: number; left: number } | null>(null);

  const checkTableSelection = React.useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = selection.anchor.getNode();
      const isCell = $isTableCellNode(node) || $isTableCellNode(node.getParent());
      
      if (isCell) {
        setIsInTable(true);
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
        setIsInTable(false);
        setCoords(null);
      }
    } else {
      setIsInTable(false);
      setCoords(null);
    }
  }, []);

  React.useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          checkTableSelection();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          checkTableSelection();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, checkTableSelection]);

  if (!isInTable || !coords) return null;

  return (
    <div
      className="table-action-menu"
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
      }}
    >
      <button type="button"
        style={{ fontSize: "11px", padding: "3px 6px", cursor: "pointer", borderRadius: "4px", border: "1px solid #e2e8f0", background: "#f8fafc" }}
        onClick={() => {
          editor.update(() => {
            $insertTableRowAtSelection(false);
          });
        }}
      >
        + Row Above
      </button>
      <button type="button"
        style={{ fontSize: "11px", padding: "3px 6px", cursor: "pointer", borderRadius: "4px", border: "1px solid #e2e8f0", background: "#f8fafc" }}
        onClick={() => {
          editor.update(() => {
            $insertTableRowAtSelection(true);
          });
        }}
      >
        + Row Below
      </button>
      <button type="button"
        style={{ fontSize: "11px", padding: "3px 6px", cursor: "pointer", borderRadius: "4px", border: "1px solid #e2e8f0", background: "#f8fafc" }}
        onClick={() => {
          editor.update(() => {
            $insertTableColumnAtSelection(false);
          });
        }}
      >
        + Col Left
      </button>
      <button type="button"
        style={{ fontSize: "11px", padding: "3px 6px", cursor: "pointer", borderRadius: "4px", border: "1px solid #e2e8f0", background: "#f8fafc" }}
        onClick={() => {
          editor.update(() => {
            $insertTableColumnAtSelection(true);
          });
        }}
      >
        + Col Right
      </button>
      <button type="button"
        style={{ fontSize: "11px", padding: "3px 6px", cursor: "pointer", borderRadius: "4px", border: "none", background: "#fee2e2", color: "#991b1b" }}
        onClick={() => {
          editor.update(() => {
            $deleteTableRowAtSelection();
          });
        }}
      >
        Del Row
      </button>
      <button type="button"
        style={{ fontSize: "11px", padding: "3px 6px", cursor: "pointer", borderRadius: "4px", border: "none", background: "#fee2e2", color: "#991b1b" }}
        onClick={() => {
          editor.update(() => {
            $deleteTableColumnAtSelection();
          });
        }}
      >
        Del Col
      </button>
    </div>
  );
}
