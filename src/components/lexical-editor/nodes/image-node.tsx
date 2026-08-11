"use client";
import * as React from "react";
import {
  DecoratorNode,
  $applyNodeReplacement,
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import type {
  NodeKey,
  SerializedLexicalNode,
  Spread,
  DOMExportOutput,
  DOMConversionMap,
  DOMConversionOutput,
  LexicalEditor,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";

export interface ImagePayload {
  altText: string;
  height?: number | "inherit";
  key?: NodeKey;
  src: string;
  width?: number | "inherit";
}

import ImageResizer from "../ui/ImageResizer";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { Suspense } from "react";

type ImageStatus =
  | { error: true }
  | { error: false; width: number; height: number };

const imageCache = new Map<string, Promise<ImageStatus> | ImageStatus>();

function useSuspenseImage(src: string): ImageStatus {
  if (!src) return { error: true };
  let cached = imageCache.get(src);
  if (cached && "error" in cached && typeof cached.error === "boolean") {
    return cached;
  } else if (!cached) {
    cached = new Promise<ImageStatus>((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () =>
        resolve({
          error: false,
          height: img.naturalHeight,
          width: img.naturalWidth,
          });
      img.onerror = () => resolve({ error: true });
    }).then((rval) => {
      imageCache.set(src, rval);
      return rval;
    });
    imageCache.set(src, cached);
    throw cached;
  }
  throw cached;
}

function LazyImage({
  altText,
  className,
  imageRef,
  src,
  width,
  height,
  maxWidth,
  onError,
}: {
  altText: string;
  className: string | null;
  height: "inherit" | number;
  imageRef: { current: null | HTMLImageElement };
  maxWidth: number;
  src: string;
  width: "inherit" | number;
  onError: () => void;
}): React.JSX.Element {
  const status = useSuspenseImage(src);

  React.useEffect(() => {
    if (status.error) {
      onError();
    }
  }, [status.error, onError]);

  if (status.error) {
    return (
      <div style={{ height: 200, width: 200, backgroundColor: "#eee", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #ccc" }}>
        <span className="text-xs text-gray-400">Image Load Error</span>
      </div>
    );
  }

  const calculateDimensions = () => {
    if (width !== "inherit" && height !== "inherit") {
      return { height, maxWidth, width };
    }
    const naturalWidth = status.width || 400;
    const naturalHeight = status.height || 300;
    let finalWidth = naturalWidth;
    let finalHeight = naturalHeight;

    if (finalWidth > maxWidth) {
      const scale = maxWidth / finalWidth;
      finalWidth = maxWidth;
      finalHeight = Math.round(finalHeight * scale);
    }
    const maxHeight = 500;
    if (finalHeight > maxHeight) {
      const scale = maxHeight / finalHeight;
      finalHeight = maxHeight;
      finalWidth = Math.round(finalWidth * scale);
    }
    return { height: finalHeight, maxWidth, width: finalWidth };
  };

  const imageStyle = calculateDimensions();

  return (
    <img
      className={className || undefined}
      src={src}
      alt={altText}
      ref={imageRef}
      style={imageStyle}
      onError={onError}
      draggable="false"
    />
  );
}

function ImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
}: {
  src: string;
  altText: string;
  nodeKey: NodeKey;
  width: number | "inherit";
  height: number | "inherit";
}): React.JSX.Element {
  const imageRef = React.useRef<null | HTMLImageElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = React.useState<boolean>(false);
  const [editor] = useLexicalComposerContext();
  const activeEditorRef = React.useRef<LexicalEditor | null>(null);
  const [isLoadError, setIsLoadError] = React.useState<boolean>(false);
  const isEditable = useLexicalEditable();

  const isInNodeSelection = React.useMemo(
    () =>
      isSelected &&
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        return $isNodeSelection(selection) && selection.has(nodeKey);
      }),
    [editor, isSelected, nodeKey]
  );

  const onClick = React.useCallback(
    (payload: MouseEvent) => {
      const event = payload;

      if (isResizing) {
        return true;
      }
      if (event.target === imageRef.current) {
        if (event.shiftKey) {
          setSelected(!isSelected);
        } else {
          clearSelection();
          setSelected(true);
        }
        return true;
      }

      return false;
    },
    [isResizing, isSelected, setSelected, clearSelection]
  );

  React.useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === imageRef.current) {
            event.preventDefault();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        onClick,
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, onClick]);

  const onResizeEnd = (
    nextWidth: "inherit" | number,
    nextHeight: "inherit" | number
  ) => {
    setTimeout(() => {
      setIsResizing(false);
    }, 200);

    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setWidthAndHeight(nextWidth, nextHeight);
      }
    });
  };

  const onResizeStart = () => {
    setIsResizing(true);
  };

  const draggable = isInNodeSelection && !isResizing;
  const isFocused = (isSelected || isResizing) && isEditable;

  return (
    <Suspense fallback={<div style={{ width: 100, height: 100, background: '#f0f0f0', borderRadius: 4 }} />}>
      <span
        className="editor-image-container"
        style={{ display: "inline-block", position: "relative" }}
        draggable={draggable}
      >
        {isLoadError ? (
          <div style={{ height: 200, width: 200, backgroundColor: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span>Broken Image</span>
          </div>
        ) : (
          <LazyImage
            className={isFocused ? `focused ${isInNodeSelection ? "draggable" : ""}` : null}
            src={src}
            altText={altText}
            imageRef={imageRef}
            width={width}
            height={height}
            maxWidth={1000}
            onError={() => setIsLoadError(true)}
          />
        )}

        {isInNodeSelection && isFocused && (
          <ImageResizer
            showCaption={false}
            setShowCaption={() => {}}
            editor={editor}
            buttonRef={buttonRef}
            imageRef={imageRef}
            maxWidth={1000}
            onResizeStart={onResizeStart}
            onResizeEnd={onResizeEnd}
            captionsEnabled={false}
          />
        )}
      </span>
    </Suspense>
  );
}

// ─── Serialized type ─────────────────────────────────────────────────────────
export type SerializedImageNode = Spread<
  {
    altText: string;
    height?: number | "inherit";
    src: string;
    width?: number | "inherit";
  },
  SerializedLexicalNode
>;

// ─── ImageNode Lexical class ─────────────────────────────────────────────────
export class ImageNode extends DecoratorNode<React.JSX.Element> {
  __src: string; 
  __altText: string;
  __width: number | "inherit";
  __height: number | "inherit";

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__width, node.__height, node.__key);
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, altText, width, height } = serializedNode;
    return $createImageNode({ src, altText, width, height });
  }

  exportJSON(): SerializedImageNode {
    return {
      type: "image",
      src: this.__src, 
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
      version: 1,
    };
  }

  constructor(
    src: string,
    altText: string,
    width: number | "inherit" = "inherit",
    height: number | "inherit" = "inherit",
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("alt", this.__altText);
    if (this.__width !== "inherit") element.setAttribute("width", String(this.__width));
    if (this.__height !== "inherit") element.setAttribute("height", String(this.__height));
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (_node: Node) => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  createDOM(): HTMLElement {
    const span = document.createElement("span");
    span.className = "editor-image-wrapper";
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  setSrc(src: string): void {
    const writable = this.getWritable();
    writable.__src = src;
  }

  setAltText(altText: string): void {
    const writable = this.getWritable();
    writable.__altText = altText;
  }

  setWidthAndHeight(width: number | "inherit", height: number | "inherit"): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  decorate(): React.JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        nodeKey={this.getKey()}
      />
    );
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function convertImageElement(domNode: Node): DOMConversionOutput | null {
  if (domNode instanceof HTMLImageElement) {
    const { src, alt } = domNode;
    const node = $createImageNode({ src, altText: alt || "image" });
    return { node };
  }
  return null;
}

export function $createImageNode({
  src,
  altText,
  width,
  height,
  key,
}: ImagePayload): ImageNode {
  return $applyNodeReplacement(new ImageNode(src, altText, width, height, key));
}

export function $isImageNode(node: unknown): node is ImageNode {
  return node instanceof ImageNode;
}
