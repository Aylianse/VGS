import * as React from "react";
import { createPortal } from "react-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {$getSelection, $isRangeSelection, $isNodeSelection, $isTextNode, $getNodeByKey, CAN_REDO_COMMAND, CAN_UNDO_COMMAND, REDO_COMMAND, UNDO_COMMAND, FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND, $createParagraphNode, INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND, COMMAND_PRIORITY_LOW, $createTextNode} from "lexical";
import type {NodeKey} from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
} from "@lexical/list";
import {
  $createCodeNode,
} from "@lexical/code";
import {
  $patchStyleText,
  $getSelectionStyleValueForProperty,
  $setBlocksType,
} from "@lexical/selection";
import { TOGGLE_LINK_COMMAND, $createLinkNode } from "@lexical/link";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { INSERT_IMAGE_COMMAND, OPEN_IMAGE_PROMPT_COMMAND } from "./images-plugin";
import { INSERT_POLL_COMMAND, OPEN_POLL_PROMPT_COMMAND } from "./PollPlugin";
import { mergeRegister } from "@lexical/utils";
import { uploadLexicalImage } from "../upload";
import { toast } from "sonner";
import {$createHeadingNode, $createQuoteNode} from "@lexical/rich-text";
import type {HeadingTagType} from "@lexical/rich-text";
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  CheckSquare,
  Image,
  Link,
  Table,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Terminal,
  Type,
  Baseline,
  Highlighter,
  ChevronDown,
  RemoveFormatting,
  Indent,
  Outdent,
  Minus,
  Plus,
  FileText,
} from "lucide-react";
import { $isImageNode } from "../nodes/image-node";

const TEXT_COLORS = [
  "#000000", "#475569", "#ef4444", "#f97316", "#eab308",
  "#22c55e", "#06b6d4", "#3b82f6", "#6366f1", "#a855f7"
];

const HIGHLIGHT_COLORS = [
  "#ffffff", "#f1f5f9", "#fee2e2", "#ffedd5", "#fef9c3",
  "#dcfce7", "#ecfeff", "#dbeafe", "#e0e7ff", "#f3e8ff"
];

const FONT_FAMILY_OPTIONS = [
  ["Arial", "Arial"],
  ["Courier New", "Courier New"],
  ["Georgia", "Georgia"],
  ["Times New Roman", "Times New Roman"],
  ["Trebuchet MS", "Trebuchet MS"],
  ["Verdana", "Verdana"],
];

const FONT_SIZE_OPTIONS = [
  "10px", "11px", "12px", "13px", "14px", "15px", "16px", "17px", "18px", "19px", "20px", "24px", "28px"
];

export function ToolbarPlugin({
  pageSize,
  setPageSize,
  orientation,
  setOrientation,
  margins,
  setMargins,
  uploadContainer = "research-file",
}: {
  pageSize: string;
  setPageSize: (s: string) => void;
  orientation: string;
  setOrientation: (o: string) => void;
  margins: string;
  setMargins: (m: string) => void;
  uploadContainer?: string;
}): React.JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);
  const [isStrikethrough, setIsStrikethrough] = React.useState(false);
  const [isCode, setIsCode] = React.useState(false);
  const [isSubscript, setIsSubscript] = React.useState(false);
  const [isSuperscript, setIsSuperscript] = React.useState(false);

  // Styles state
  const [fontFamily, setFontFamily] = React.useState("Arial");
  const [fontSize, setFontSize] = React.useState("15px");

  // Dropdown states
  const [blockType, setBlockType] = React.useState("paragraph");
  const [showBlockDropdown, setShowBlockDropdown] = React.useState(false);
  const [showTextColor, setShowTextColor] = React.useState(false);
  const [showHighlightColor, setShowHighlightColor] = React.useState(false);
  const [showFontFamilyDropdown, setShowFontFamilyDropdown] = React.useState(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = React.useState(false);
  const [showInsertDropdown, setShowInsertDropdown] = React.useState(false);
  const [showPageSetupDropdown, setShowPageSetupDropdown] = React.useState(false);
  const [selectedImageKey, setSelectedImageKey] = React.useState<NodeKey | null>(null);
  const [selectedImageAlt, setSelectedImageAlt] = React.useState("");

  const blockDropdownRef = React.useRef<HTMLDivElement | null>(null);
  const textColorRef = React.useRef<HTMLDivElement | null>(null);
  const highlightColorRef = React.useRef<HTMLDivElement | null>(null);
  const fontFamilyDropdownRef = React.useRef<HTMLDivElement | null>(null);
  const fontSizeDropdownRef = React.useRef<HTMLDivElement | null>(null);
  const insertDropdownRef = React.useRef<HTMLDivElement | null>(null);
  const pageSetupDropdownRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (blockDropdownRef.current && !blockDropdownRef.current.contains(target)) setShowBlockDropdown(false);
      if (textColorRef.current && !textColorRef.current.contains(target)) setShowTextColor(false);
      if (highlightColorRef.current && !highlightColorRef.current.contains(target)) setShowHighlightColor(false);
      if (fontFamilyDropdownRef.current && !fontFamilyDropdownRef.current.contains(target)) setShowFontFamilyDropdown(false);
      if (fontSizeDropdownRef.current && !fontSizeDropdownRef.current.contains(target)) setShowFontSizeDropdown(false);
      if (insertDropdownRef.current && !insertDropdownRef.current.contains(target)) setShowInsertDropdown(false);
      if (pageSetupDropdownRef.current && !pageSetupDropdownRef.current.contains(target)) setShowPageSetupDropdown(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const updateToolbar = React.useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));

      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementTag = element.getType();
      setBlockType(elementTag);

      // Read formatting properties
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, "font-family", "Arial")
      );
      setFontSize(
        $getSelectionStyleValueForProperty(selection, "font-size", "15px")
      );
      setSelectedImageKey(null);
    } else if ($isNodeSelection(selection)) {
      const nodes = selection.getNodes();
      if (nodes.length === 1 && $isImageNode(nodes[0])) {
        setSelectedImageKey(nodes[0].getKey());
        setSelectedImageAlt(nodes[0].getAltText());
      } else {
        setSelectedImageKey(null);
      }
    } else {
      setSelectedImageKey(null);
    }
  }, []);

  React.useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        1
      ),
      editor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        1
      ),
      editor.registerCommand<void>(
        OPEN_IMAGE_PROMPT_COMMAND,
        () => {
          setShowImagePrompt(true);
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<void>(
        OPEN_POLL_PROMPT_COMMAND,
        () => {
          setShowPollPrompt(true);
          return true;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateToolbar]);

  // Formatting actions
  const formatHeading = (headingSize: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
    setShowBlockDropdown(false);
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
    setShowBlockDropdown(false);
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
    setShowBlockDropdown(false);
  };

  const formatCode = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createCodeNode());
      }
    });
    setShowBlockDropdown(false);
  };

  const applyStyleText = (styleProperty: string, value: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { [styleProperty]: value });
      }
    });
  };

  const clearFormatting = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if ($isTextNode(node)) {
            node.setFormat(0);
            node.setStyle("");
          }
        });
      }
    });
  };

  const [showLinkPrompt, setShowLinkPrompt] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");
  const [linkText, setLinkText] = React.useState("");

  const insertLink = () => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) && !selection.isCollapsed()) {
        setLinkText(selection.getTextContent());
      } else {
        setLinkText("");
      }
    });
    setShowInsertDropdown(false);
    setShowLinkPrompt(true);
  };

  const handleLinkPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkUrl) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const currentText = selection.getTextContent();
          if (linkText && linkText !== currentText) {
            const linkNode = $createLinkNode(linkUrl);
            const textNode = $createTextNode(linkText);
            linkNode.append(textNode);
            selection.insertNodes([linkNode]);
          } else {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
          }
        }
      });
    }
    setShowLinkPrompt(false);
    setLinkUrl("");
    setLinkText("");
  };

  const [showTablePrompt, setShowTablePrompt] = React.useState(false);
  const [tableRows, setTableRows] = React.useState(3);
  const [tableCols, setTableCols] = React.useState(3);

  const insertTable = () => {
    setShowInsertDropdown(false);
    setShowTablePrompt(true);
  };

  const handleTablePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns: String(tableCols),
      rows: String(tableRows),
    });
    setShowTablePrompt(false);
    setTableRows(3);
    setTableCols(3);
  };

  const insertLocalImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast.info("Uploading image...");
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("folder_name", uploadContainer);

        try {
          const response = await uploadLexicalImage(uploadContainer, file.type, uploadFormData);
          if (response?.data?.url) {
            const { url } = response.data;
            setImageUrl(url);
            setImageAltText("");
            setShowImagePrompt(true);
            toast.success("Image uploaded — add alt text.");
          }
        } catch (error) {
          console.error("Lexical Toolbar: Public Upload failed", error);
          toast.error("Upload failed.");
        }
      }
    };
    input.click();
    setShowInsertDropdown(false);
  };

  const [showImagePrompt, setShowImagePrompt] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");
  const [imageAltText, setImageAltText] = React.useState("");

  const insertImageUrl = () => {
    setShowInsertDropdown(false);
    setShowImagePrompt(true);
  };

  const handleImagePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl) {
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        src: imageUrl,
        altText: imageAltText.trim() || "Image",
      });
    }
    setShowImagePrompt(false);
    setImageUrl("");
    setImageAltText("");
  };

  const commitSelectedImageAlt = React.useCallback(
    (alt: string) => {
      if (!selectedImageKey) return;
      editor.update(() => {
        const node = $getNodeByKey(selectedImageKey);
        if ($isImageNode(node)) {
          node.setAltText(alt);
        }
      });
    },
    [editor, selectedImageKey],
  );

  const [showPollPrompt, setShowPollPrompt] = React.useState(false);
  const [pollQuestion, setPollQuestion] = React.useState("");

  const handlePollPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pollQuestion) {
      editor.dispatchCommand(INSERT_POLL_COMMAND, pollQuestion);
    }
    setShowPollPrompt(false);
    setPollQuestion("");
  };

  const insertHorizontalRule = () => {
    editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
    setShowInsertDropdown(false);
  };

  const getBlockLabel = () => {
    switch (blockType) {
      case "h1":
      case "heading":
        return "Heading 1";
      case "h2":
        return "Heading 2";
      case "h3":
        return "Heading 3";
      case "quote":
        return "Quote";
      case "code":
        return "Code Block";
      default:
        return "Normal Paragraph";
    }
  };

  return (
    <div className="lexical-toolbar">
      {/* Undo/Redo */}
      <div className="lexical-toolbar-group">
        <button type="button"
          className="lexical-toolbar-btn"
          disabled={!canUndo}
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          title="Undo"
        >
          <Undo2 />
        </button>
        <button type="button"
          className="lexical-toolbar-btn"
          disabled={!canRedo}
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          title="Redo"
        >
          <Redo2 />
        </button>
      </div>

      <div className="lexical-toolbar-separator" />

      {/* Block Type Dropdown */}
      <div className="lexical-toolbar-group" ref={blockDropdownRef}>
        <div className="lexical-select-container">
          <button type="button"
            className="lexical-dropdown-trigger"
            onClick={() => setShowBlockDropdown(!showBlockDropdown)}
          >
            <Type size={16} />
            <span>{getBlockLabel()}</span>
            <ChevronDown size={14} />
          </button>
          {showBlockDropdown && (
            <div className="lexical-dropdown-menu">
              <button type="button"
                className={`lexical-dropdown-item ${blockType === "paragraph" ? "active" : ""}`}
                onClick={formatParagraph}
              >
                <Type size={14} /> Normal Paragraph
              </button>
              <button type="button"
                className={`lexical-dropdown-item ${blockType === "h1" ? "active" : ""}`}
                onClick={() => formatHeading("h1")}
              >
                <Heading1 size={14} /> Heading 1
              </button>
              <button type="button"
                className={`lexical-dropdown-item ${blockType === "h2" ? "active" : ""}`}
                onClick={() => formatHeading("h2")}
              >
                <Heading2 size={14} /> Heading 2
              </button>
              <button type="button"
                className={`lexical-dropdown-item ${blockType === "h3" ? "active" : ""}`}
                onClick={() => formatHeading("h3")}
              >
                <Heading3 size={14} /> Heading 3
              </button>
              <button type="button"
                className={`lexical-dropdown-item ${blockType === "quote" ? "active" : ""}`}
                onClick={formatQuote}
              >
                <Quote size={14} /> Quote Block
              </button>
              <button type="button"
                className={`lexical-dropdown-item ${blockType === "code" ? "active" : ""}`}
                onClick={formatCode}
              >
                <Terminal size={14} /> Code Block
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="lexical-toolbar-separator" />

      {/* Font Family Dropdown */}
      <div className="lexical-toolbar-group" ref={fontFamilyDropdownRef}>
        <div className="lexical-select-container">
          <button type="button"
            className="lexical-dropdown-trigger font-family-btn"
            onClick={() => setShowFontFamilyDropdown(!showFontFamilyDropdown)}
            title="Font Family"
          >
            <span className="truncate">{fontFamily}</span>
            <ChevronDown size={14} />
          </button>
          {showFontFamilyDropdown && (
            <div className="lexical-dropdown-menu">
              {FONT_FAMILY_OPTIONS.map(([option, text]) => (
                <button type="button"
                  key={option}
                  className={`lexical-dropdown-item ${fontFamily === option ? "active" : ""}`}
                  onClick={() => {
                    applyStyleText("font-family", option);
                    setShowFontFamilyDropdown(false);
                  }}
                  style={{ fontFamily: option }}
                >
                  {text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Font Size Dropdown */}
      <div className="lexical-toolbar-group" ref={fontSizeDropdownRef}>
        <div className="lexical-select-container">
          <button type="button"
            className="lexical-dropdown-trigger font-size-btn"
            onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
            title="Font Size"
          >
            <span>{fontSize}</span>
            <ChevronDown size={14} />
          </button>
          {showFontSizeDropdown && (
            <div className="lexical-dropdown-menu font-size-menu">
              {FONT_SIZE_OPTIONS.map((size) => (
                <button type="button"
                  key={size}
                  className={`lexical-dropdown-item ${fontSize === size ? "active" : ""}`}
                  onClick={() => {
                    applyStyleText("font-size", size);
                    setShowFontSizeDropdown(false);
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lexical-toolbar-separator" />

      {/* Inline Formatting */}
      <div className="lexical-toolbar-group">
        <button type="button"
          className={`lexical-toolbar-btn ${isBold ? "active" : ""}`}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
          title="Bold"
        >
          <Bold />
        </button>
        <button type="button"
          className={`lexical-toolbar-btn ${isItalic ? "active" : ""}`}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
          title="Italic"
        >
          <Italic />
        </button>
        <button type="button"
          className={`lexical-toolbar-btn ${isUnderline ? "active" : ""}`}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
          title="Underline"
        >
          <Underline />
        </button>
        <button type="button"
          className={`lexical-toolbar-btn ${isStrikethrough ? "active" : ""}`}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}
          title="Strikethrough"
        >
          <Strikethrough />
        </button>
        <button type="button"
          className={`lexical-toolbar-btn ${isCode ? "active" : ""}`}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
          title="Inline Code"
        >
          <Code />
        </button>
        <button type="button"
          className="lexical-toolbar-btn"
          onClick={clearFormatting}
          title="Clear Formatting"
        >
          <RemoveFormatting />
        </button>
      </div>

      <div className="lexical-toolbar-separator" />

      {/* Text / Highlight Colors */}
      <div className="lexical-toolbar-group" style={{ gap: "4px" }}>
        <div ref={textColorRef} style={{ position: "relative" }}>
          <button type="button"
            className="lexical-toolbar-btn"
            onClick={() => setShowTextColor(!showTextColor)}
            title="Text Color"
          >
            <Baseline />
          </button>
          {showTextColor && (
            <div className="lexical-dropdown-menu lexical-color-picker-grid">
              {TEXT_COLORS.map((c) => (
                <div
                  key={c}
                  className="lexical-color-swatch"
                  style={{ backgroundColor: c }}
                  onClick={() => {
                    applyStyleText("color", c);
                    setShowTextColor(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div ref={highlightColorRef} style={{ position: "relative" }}>
          <button type="button"
            className="lexical-toolbar-btn"
            onClick={() => setShowHighlightColor(!showHighlightColor)}
            title="Highlight Color"
          >
            <Highlighter />
          </button>
          {showHighlightColor && (
            <div className="lexical-dropdown-menu lexical-color-picker-grid">
              {HIGHLIGHT_COLORS.map((c) => (
                <div
                  key={c}
                  className="lexical-color-swatch"
                  style={{ backgroundColor: c }}
                  onClick={() => {
                    applyStyleText("background-color", c);
                    setShowHighlightColor(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="lexical-toolbar-separator" />

      {/* Insert structures Dropdown */}
      <div className="lexical-toolbar-group" ref={insertDropdownRef}>
        <div className="lexical-select-container">
          <button type="button"
            className="lexical-dropdown-trigger"
            onClick={() => setShowInsertDropdown(!showInsertDropdown)}
            title="Insert"
          >
            <Plus size={16} />
            <span>Insert</span>
            <ChevronDown size={14} />
          </button>
          {showInsertDropdown && (
            <div className="lexical-dropdown-menu">
              <button type="button" className="lexical-dropdown-item" onClick={insertHorizontalRule}>
                <Minus size={14} /> Horizontal Rule
              </button>
              <button type="button" className="lexical-dropdown-item" onClick={insertLocalImage}>
                <Image size={14} /> Upload Image (Local)
              </button>
              <button type="button" className="lexical-dropdown-item" onClick={insertImageUrl}>
                <Image size={14} /> Embed Image (URL)
              </button>
              <button type="button" className="lexical-dropdown-item" onClick={insertTable}>
                <Table size={14} /> Table
              </button>
              <button type="button" className="lexical-dropdown-item" onClick={insertLink}>
                <Link size={14} /> Link
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="lexical-toolbar-separator" />

      {/* Alignments & Indent */}
      <div className="lexical-toolbar-group">
        <button type="button"
          className="lexical-toolbar-btn"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
          title="Align Left"
        >
          <AlignLeft />
        </button>
        <button type="button"
          className="lexical-toolbar-btn"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
          title="Align Center"
        >
          <AlignCenter />
        </button>
        <button type="button"
          className="lexical-toolbar-btn"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
          title="Align Right"
        >
          <AlignRight />
        </button>
        <button type="button"
          className="lexical-toolbar-btn"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")}
          title="Align Justify"
        >
          <AlignJustify />
        </button>
        <button type="button"
          className="lexical-toolbar-btn"
          onClick={() => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)}
          title="Outdent"
        >
          <Outdent />
        </button>
        <button type="button"
          className="lexical-toolbar-btn"
          onClick={() => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)}
          title="Indent"
        >
          <Indent />
        </button>
      </div>

      <div className="lexical-toolbar-separator" />

      {/* Lists */}
      <div className="lexical-toolbar-group">
        <button type="button"
          className="lexical-toolbar-btn"
          onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
          title="Bullet List"
        >
          <List />
        </button>
        <button type="button"
          className="lexical-toolbar-btn"
          onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
          title="Numbered List"
        >
          <ListOrdered />
        </button>
        <button type="button"
          className="lexical-toolbar-btn"
          onClick={() => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)}
          title="Checklist"
        >
          <CheckSquare />
        </button>
      </div>

      <div className="lexical-toolbar-separator" />

      {selectedImageKey ? (
        <>
          <div className="lexical-toolbar-group">
            <input
              type="text"
              value={selectedImageAlt}
              onChange={(e) => setSelectedImageAlt(e.target.value)}
              onBlur={() => commitSelectedImageAlt(selectedImageAlt)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitSelectedImageAlt(selectedImageAlt);
                }
              }}
              placeholder="Image alt text"
              title="Alt text (SEO & accessibility)"
              className="h-8 min-w-48 rounded-md border border-slate-200 px-2 text-xs text-slate-700"
            />
          </div>
          <div className="lexical-toolbar-separator" />
        </>
      ) : null}

      {/* Page Setup */}
      <div className="lexical-toolbar-group">
        <div className="lexical-select-container" ref={pageSetupDropdownRef}>
          <button type="button"
            className={`lexical-dropdown-trigger flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200 ${showPageSetupDropdown ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
            onClick={() => setShowPageSetupDropdown(!showPageSetupDropdown)}
            title="Page setup: size, orientation, margins"
          >
            <FileText size={16} />
            <span className="text-xs font-semibold">Page Setup</span>
          </button>
          {showPageSetupDropdown && (
            <div className="lexical-dropdown-menu absolute right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg p-3 w-56 z-50">
              {/* Page Size */}
              <div className="mb-3">
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Page Size</label>
                <div className="grid grid-cols-2 gap-1">
                  {["Letter", "A4", "Legal", "Pageless"].map((sz) => (
                    <button type="button"
                      key={sz}
                      className={`text-left text-xs px-2 py-1 rounded transition-colors border ${pageSize === sz ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                      onClick={() => {
                        setPageSize(sz);
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orientation */}
              {pageSize !== "Pageless" && (
                <div className="mb-3">
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Orientation</label>
                  <div className="grid grid-cols-2 gap-1">
                    {["portrait", "landscape"].map((ort) => (
                      <button type="button"
                        key={ort}
                        className={`text-left text-xs capitalize px-2 py-1 rounded transition-colors border ${orientation === ort ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                        onClick={() => setOrientation(ort)}
                      >
                        {ort}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Margins */}
              {pageSize !== "Pageless" && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Margins</label>
                  <div className="grid grid-cols-2 gap-1">
                    {["narrow", "normal", "moderate", "wide"].map((mrg) => (
                      <button type="button"
                        key={mrg}
                        className={`text-left text-xs capitalize px-2 py-1 rounded transition-colors border ${margins === mrg ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                        onClick={() => setMargins(mrg)}
                      >
                        {mrg}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/*
        Prompt modals are portaled to document.body so their <form> elements
        are not nested inside the admin create/edit Form (invalid HTML — submit
        would POST the blog post and bounce the user out of the editor).
      */}
      {typeof document !== "undefined" &&
        createPortal(
          <>
            {showLinkPrompt && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-[90vw]">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Insert Link</h3>
                  <form onSubmit={handleLinkPromptSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Text to display
                      </label>
                      <input
                        type="text"
                        autoFocus
                        placeholder="Link text"
                        value={linkText}
                        onChange={(e) => setLinkText(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Link URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowLinkPrompt(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Insert
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {showTablePrompt && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-80 max-w-[90vw]">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Insert Table</h3>
                  <form onSubmit={handleTablePromptSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rows
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={tableRows}
                        onChange={(e) =>
                          setTableRows(parseInt(e.target.value) || 1)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Columns
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={tableCols}
                        onChange={(e) =>
                          setTableCols(parseInt(e.target.value) || 1)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowTablePrompt(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Insert
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {showImagePrompt && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-[90vw]">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Insert image</h3>
                  <form onSubmit={handleImagePromptSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL
                      </label>
                      <input
                        type="url"
                        autoFocus
                        placeholder="https://example.com/image.jpg"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alt Text
                      </label>
                      <input
                        type="text"
                        placeholder="Describe the image"
                        value={imageAltText}
                        onChange={(e) => setImageAltText(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowImagePrompt(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Embed
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {showPollPrompt && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-[90vw]">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Create Interactive Poll
                  </h3>
                  <form onSubmit={handlePollPromptSubmit}>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Poll Question
                      </label>
                      <input
                        type="text"
                        autoFocus
                        placeholder="What is your favorite color?"
                        value={pollQuestion}
                        onChange={(e) => setPollQuestion(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowPollPrompt(false)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>,
          document.body,
        )}
    </div>
  );
}
