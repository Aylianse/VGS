import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {$getSelection, $isRangeSelection, $isTextNode, COMMAND_PRIORITY_LOW, FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND, getDOMSelection} from "lexical";
import type {LexicalEditor} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isCodeHighlightNode } from "@lexical/code";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link,
  Subscript,
  Superscript,
} from "lucide-react";

function getDOMRangeRect(
  nativeSelection: Selection,
  rootElement: HTMLElement
): DOMRect {
  const domRange = nativeSelection.getRangeAt(0);
  let rect;
  if (nativeSelection.anchorNode === rootElement) {
    let inner = rootElement;
    while (inner.firstElementChild != null) {
      inner = inner.firstElementChild as HTMLElement;
    }
    rect = inner.getBoundingClientRect();
  } else {
    rect = domRange.getBoundingClientRect();
  }
  return rect;
}

const VERTICAL_GAP = 10;
const HORIZONTAL_OFFSET = 5;

function setFloatingElemPosition(
  targetRect: DOMRect | null,
  floatingElem: HTMLElement,
  anchorElem: HTMLElement,
  isLink: boolean = false,
  verticalGap: number = VERTICAL_GAP,
  horizontalOffset: number = HORIZONTAL_OFFSET
): void {
  const scrollerElem = anchorElem.parentElement;

  if (targetRect === null || !scrollerElem) {
    floatingElem.style.opacity = "0";
    floatingElem.style.transform = "translate(-10000px, -10000px)";
    return;
  }

  const floatingElemRect = floatingElem.getBoundingClientRect();
  const anchorElementRect = anchorElem.getBoundingClientRect();
  const editorScrollerRect = scrollerElem.getBoundingClientRect();

  let top = targetRect.top - floatingElemRect.height - verticalGap;
  let left = targetRect.left - horizontalOffset;

  if (top < editorScrollerRect.top) {
    top += floatingElemRect.height + targetRect.height + verticalGap * (isLink ? 9 : 2);
  }
  if (left + floatingElemRect.width > editorScrollerRect.right) {
    left = editorScrollerRect.right - floatingElemRect.width - horizontalOffset;
  }
  if (left < editorScrollerRect.left) {
    left = editorScrollerRect.left + horizontalOffset;
  }

  top -= anchorElementRect.top;
  left -= anchorElementRect.left;

  floatingElem.style.opacity = "1";
  floatingElem.style.transform = `translate(${left}px, ${top}px)`;
}

function TextFormatFloatingToolbar({
  editor,
  anchorElem,
  isLink,
  isBold,
  isItalic,
  isUnderline,
  isStrikethrough,
  isCode,
  isSubscript,
  isSuperscript,
}: {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
  isLink: boolean;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isCode: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
}) {
  const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const $updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection();
    const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
    const nativeSelection = getDOMSelection(editor._window);

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement);
      setFloatingElemPosition(rangeRect, popupCharStylesEditorElem, anchorElem, isLink);
    }
  }, [editor, anchorElem, isLink]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;
    const update = () => {
      editor.getEditorState().read(() => {
        $updateTextFormatFloatingToolbar();
      });
    };
    window.addEventListener("resize", update);
    if (scrollerElem) {
      scrollerElem.addEventListener("scroll", update);
    }
    return () => {
      window.removeEventListener("resize", update);
      if (scrollerElem) {
        scrollerElem.removeEventListener("scroll", update);
      }
    };
  }, [editor, $updateTextFormatFloatingToolbar, anchorElem]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateTextFormatFloatingToolbar();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateTextFormatFloatingToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateTextFormatFloatingToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, $updateTextFormatFloatingToolbar]);

  return (
    <div ref={popupCharStylesEditorRef} className="lexical-floating-toolbar">
      {editor.isEditable() && (
        <>
          <button
            type="button"
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
            className={`popup-item ${isBold ? "active" : ""}`}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
            className={`popup-item ${isItalic ? "active" : ""}`}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
            className={`popup-item ${isUnderline ? "active" : ""}`}
            title="Underline"
          >
            <Underline size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}
            className={`popup-item ${isStrikethrough ? "active" : ""}`}
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript")}
            className={`popup-item ${isSubscript ? "active" : ""}`}
            title="Subscript"
          >
            <Subscript size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript")}
            className={`popup-item ${isSuperscript ? "active" : ""}`}
            title="Superscript"
          >
            <Superscript size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
            className={`popup-item ${isCode ? "active" : ""}`}
            title="Insert code block"
          >
            <Code size={16} />
          </button>
        </>
      )}
    </div>
  );
}

function useFloatingTextFormatToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLElement
): React.JSX.Element | null {
  const [isText, setIsText] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      if (editor.isComposing()) return;
      const selection = $getSelection();
      const nativeSelection = getDOMSelection(editor._window);
      const rootElement = editor.getRootElement();

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          rootElement === null ||
          !rootElement.contains(nativeSelection.anchorNode))
      ) {
        setIsText(false);
        return;
      }

      if (!$isRangeSelection(selection)) return;

      const node = selection.anchor.getNode();

      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));
      setIsCode(selection.hasFormat("code"));

      const parent = node.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(node));

      if (!$isCodeHighlightNode(selection.anchor.getNode()) && selection.getTextContent() !== "") {
        setIsText($isTextNode(node) || node.getType() === "paragraph" || node.getType() === "text");
      } else {
        setIsText(false);
      }

      const rawTextContent = selection.getTextContent().replace(/\n/g, "");
      if (!selection.isCollapsed() && rawTextContent === "") {
        setIsText(false);
      }
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener("selectionchange", updatePopup);
    return () => document.removeEventListener("selectionchange", updatePopup);
  }, [updatePopup]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => updatePopup()),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsText(false);
        }
      })
    );
  }, [editor, updatePopup]);

  if (!isText) {
    return null;
  }

  return createPortal(
    <TextFormatFloatingToolbar
      editor={editor}
      anchorElem={anchorElem}
      isLink={isLink}
      isBold={isBold}
      isItalic={isItalic}
      isUnderline={isUnderline}
      isStrikethrough={isStrikethrough}
      isSubscript={isSubscript}
      isSuperscript={isSuperscript}
      isCode={isCode}
    />,
    anchorElem
  );
}

export function FloatingTextFormatToolbarPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  return useFloatingTextFormatToolbar(editor, anchorElem);
}
