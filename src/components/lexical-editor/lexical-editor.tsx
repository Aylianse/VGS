"use client";

import * as React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";

import AutoEmbedPlugin from "./plugins/AutoEmbedPlugin";
import { LayoutPlugin } from "./plugins/LayoutPlugin/LayoutPlugin";
import TableCellResizer from "./plugins/TableCellResizer";
import TableHoverActionsV2Plugin from "./plugins/TableHoverActionsV2Plugin";
import EquationsPlugin from "./plugins/EquationsPlugin";
import ExcalidrawPlugin from "./plugins/ExcalidrawPlugin";
import PollPlugin from "./plugins/PollPlugin";

// --- Nodes ---
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { ImageNode } from "./nodes/image-node";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { LayoutContainerNode } from "./nodes/LayoutContainerNode";
import { LayoutItemNode } from "./nodes/LayoutItemNode";
import { YouTubeNode } from "./nodes/YouTubeNode";
import { FigmaNode } from "./nodes/FigmaNode";
import { TweetNode } from "./nodes/TweetNode";
import { EquationNode } from "./nodes/EquationNode";
import { ExcalidrawNode } from "./nodes/ExcalidrawNode";
import { PollNode } from "./nodes/PollNode";

// --- Custom Plugins ---
import { ToolbarPlugin } from "./plugins/toolbar-plugin";
import { HtmlPlugin } from "./plugins/html-plugin";
import { ImagesPlugin } from "./plugins/images-plugin";
import { FloatingLinkEditorPlugin } from "./plugins/floating-link-editor-plugin";
import { LayoutActionMenuPlugin } from "./plugins/layout-action-menu-plugin";

// --- Lexical Playground Custom Plugins ---
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ComponentPickerPlugin } from "./plugins/component-picker-plugin";
import { DraggableBlockPlugin } from "./plugins/draggable-block-plugin";
import { CodeActionMenuPlugin } from "./plugins/code-action-menu-plugin";
import { EmojiPlugin } from "./plugins/emoji-plugin";
import { ListMaxIndentLevelPlugin } from "./plugins/list-max-indent-plugin";
import { FloatingTextFormatToolbarPlugin } from "./plugins/floating-text-format-toolbar-plugin";

// --- Theme & Styles ---
import { lexicalTheme } from "./theme";
import "./lexical-editor.scss";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

function LinkTargetPlugin() {
  const [editor] = useLexicalComposerContext();
  React.useEffect(() => {
    return editor.registerNodeTransform(LinkNode, (node) => {
      if (node.getTarget() !== "_blank") {
        node.setTarget("_blank");
        node.setRel("noopener noreferrer");
      }
    });
  }, [editor]);
  return null;
}

interface LexicalEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  uploadContainer?: string;
}

export function LexicalEditor({
  content = "",
  onChange,
  placeholder = "Type '/' for commands",
  uploadContainer = "research-file",
}: LexicalEditorProps): React.JSX.Element {

  const initialConfig = {
    namespace: "StatusStarLexicalEditor",
    theme: lexicalTheme,
    onError: (error: Error) => {
      console.error("Lexical Editor Error:", error);
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
      AutoLinkNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      ImageNode,
      HorizontalRuleNode,
      LayoutContainerNode,
      LayoutItemNode,
      YouTubeNode,
      FigmaNode,
      TweetNode,
      EquationNode,
      ExcalidrawNode,
      PollNode,
    ],
  };

  const [pageSize, setPageSize] = React.useState<string>("Pageless");
  const [orientation, setOrientation] = React.useState<string>("portrait"); // "portrait", "landscape"
  const [margins, setMargins] = React.useState<string>("normal"); // "narrow", "normal", "moderate", "wide"
  const [floatingAnchorElem, setFloatingAnchorElem] = React.useState<HTMLDivElement | null>(null);

  const onRef = (element: HTMLDivElement | null) => {
    if (element !== null) {
      setFloatingAnchorElem(element);
    }
  };

  // Page Dimensions & Margins specs mapping
  const PAGE_SPECS: Record<string, { width: string; height: string }> = {
    Letter: { width: "8.5in", height: "11in" },
    A4: { width: "210mm", height: "297mm" },
    Legal: { width: "8.5in", height: "14in" },
    Tabloid: { width: "11in", height: "17in" },
    Pageless: { width: "100%", height: "auto" },
  };

  const MARGIN_SPECS: Record<string, string> = {
    narrow: "0.25in",
    normal: "0.4in",
    moderate: "0.75in",
    wide: "1.0in",
  };

  const isPageless = pageSize === "Pageless";

  const rawWidth = PAGE_SPECS[pageSize]?.width || "8.5in";
  const rawHeight = PAGE_SPECS[pageSize]?.height || "11in";

  const computedWidth = isPageless
    ? "100%"
    : orientation === "landscape"
      ? rawHeight
      : rawWidth;

  const computedHeight = isPageless
    ? "min(50vh, 420px)"
    : orientation === "landscape"
      ? rawWidth
      : rawHeight;

  const computedPadding = MARGIN_SPECS[margins] || "0.4in";

  const dynamicStyles = {
    "--page-width": computedWidth,
    "--page-height": isPageless ? "min(50vh, 420px)" : computedHeight,
    "--page-padding": computedPadding,
    "--page-margin": isPageless ? "0" : "0 auto",
    "--page-shadow": isPageless ? "none" : "0 4px 15px rgba(0, 0, 0, 0.05), 0 1px 4px rgba(0, 0, 0, 0.04)",
    "--page-border": isPageless ? "none" : "1px solid #e2e8f0",
    "--page-radius": isPageless ? "0" : "4px",
    "--page-bg": "#ffffff",
    "--page-bg-dark": "#1e293b",
    "--page-border-color-dark": "#334155",
  } as React.CSSProperties;

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="lexical-editor-wrapper" style={dynamicStyles}>
        {/* Rich Formatting Toolbar */}
        <ToolbarPlugin
          pageSize={pageSize}
          setPageSize={setPageSize}
          orientation={orientation}
          setOrientation={setOrientation}
          margins={margins}
          setMargins={setMargins}
          uploadContainer={uploadContainer}
        />

        <div className="lexical-editor-container" style={isPageless ? undefined : { background: "#f8fafc", padding: "2rem 1rem", overflowY: "auto", maxHeight: "800px" }}>
          <div className="lexical-editor-inner-scroll" style={isPageless ? undefined : { width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div className="lexical-editor-relative-wrapper" ref={onRef} style={{ position: "relative", width: computedWidth }}>
              {/* Main Editable Area */}
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className="lexical-content-editable" />
                }
                placeholder={
                  <div className="editor-placeholder">{placeholder}</div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
            </div>
          </div>

          {/* Core plugins */}
          <HistoryPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <LinkPlugin />
          <TablePlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />

          {/* Custom plugins */}
          <HtmlPlugin initialHtml={content} onChange={onChange} />
          <ImagesPlugin uploadContainer={uploadContainer} />
          <FloatingLinkEditorPlugin />
          <LayoutActionMenuPlugin />
          <LinkTargetPlugin />

          {/* Playground-level features */}
          <HorizontalRulePlugin />
          <ComponentPickerPlugin uploadContainer={uploadContainer} />
          {floatingAnchorElem && <DraggableBlockPlugin anchorElem={floatingAnchorElem} />}
          <CodeActionMenuPlugin />
          <EmojiPlugin />
          <ListMaxIndentLevelPlugin />
          <FloatingTextFormatToolbarPlugin />
          <TabIndentationPlugin />
          <AutoEmbedPlugin />
          <LayoutPlugin />
          <TableCellResizer />
          <TableHoverActionsV2Plugin />
          <EquationsPlugin />
          <ExcalidrawPlugin />
          <PollPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}

// Support default import or re-export for drop-in flexibility
export default LexicalEditor;