import * as React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, SELECTION_CHANGE_COMMAND } from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { mergeRegister } from "@lexical/utils";

export function FloatingLinkEditorPlugin(): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [isLink, setIsLink] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");
  const [coords, setCoords] = React.useState<{ top: number; left: number } | null>(null);
  const popoverRef = React.useRef<HTMLDivElement | null>(null);

  const updateLinkEditor = React.useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = selection.anchor.getNode();
      const parent = node.getParent();
      
      if ($isLinkNode(node)) {
        setIsLink(true);
        setLinkUrl(node.getURL());
      } else if ($isLinkNode(parent)) {
        setIsLink(true);
        setLinkUrl(parent.getURL());
      } else {
        setIsLink(false);
        setLinkUrl("");
        setCoords(null);
        return;
      }

      // Calculate DOM node coordinates
      const nativeSelection = window.getSelection();
      if (nativeSelection && nativeSelection.rangeCount > 0) {
        const range = nativeSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setCoords({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
        });
      }
    } else {
      setIsLink(false);
      setLinkUrl("");
      setCoords(null);
    }
  }, []);

  React.useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateLinkEditor]);

  const onSave = () => {
    if (linkUrl.trim() !== "") {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
    setIsLink(false);
    setCoords(null);
  };

  const onUnlink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    setIsLink(false);
    setCoords(null);
  };

  if (!isLink || !coords) return null;

  return (
    <div
      ref={popoverRef}
      className="floating-link-editor"
      style={{
        position: "absolute",
        top: `${coords.top}px`,
        left: `${coords.left}px`,
      }}
    >
      <input
        type="text"
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        placeholder="https://example.com"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSave();
          }
        }}
      />
      <button type="button"
        onClick={onSave}
        style={{
          backgroundColor: "#10b981",
          color: "white",
          border: "none",
        }}
      >
        Save
      </button>
      <button type="button"
        onClick={onUnlink}
        style={{
          backgroundColor: "#ef4444",
          color: "white",
          border: "none",
        }}
      >
        Unlink
      </button>
    </div>
  );
}
