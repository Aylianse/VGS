import * as React from "react";
import { createPortal } from "react-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {$getSelection, $isRangeSelection, $isTextNode, $getNodeByKey, COMMAND_PRIORITY_LOW, KEY_ARROW_DOWN_COMMAND, KEY_ARROW_UP_COMMAND, KEY_ENTER_COMMAND, KEY_ESCAPE_COMMAND, $insertNodes} from "lexical";
import type {NodeKey, LexicalEditor} from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $createCodeNode } from "@lexical/code";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
} from "@lexical/list";
import { $setBlocksType } from "@lexical/selection";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { INSERT_IMAGE_COMMAND, OPEN_IMAGE_PROMPT_COMMAND } from "./images-plugin";
import { mergeRegister } from "@lexical/utils";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { INSERT_LAYOUT_COMMAND } from "./LayoutPlugin/LayoutPlugin";
import { INSERT_EQUATION_COMMAND } from "./EquationsPlugin";
import { INSERT_EXCALIDRAW_COMMAND } from "./ExcalidrawPlugin";
import { INSERT_POLL_COMMAND, OPEN_POLL_PROMPT_COMMAND } from "./PollPlugin";
import { uploadLexicalImage } from "../upload";
import { toast } from "sonner";
import { $createImageNode, $isImageNode } from "../nodes/image-node";

// Lucide Icons
import {
  Heading1,
  Heading2,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Terminal,
  Table2,
  Image,
  Minus,
  Columns2,
  Columns3,
  Sigma,
  Palette,
  BarChart3,
} from "lucide-react";

type ItemCategory = "Basic blocks" | "Layouts" | "Media" | "Advanced blocks";

interface PickerItem {
  key: string;
  title: string;
  description: string;
  category: ItemCategory;
  icon: React.ReactNode;
  action: (editor: LexicalEditor, uploadContainer?: string) => void;
}

const ITEMS: PickerItem[] = [
  {
    key: "h1",
    title: "Heading 1",
    description: "Big section heading",
    category: "Basic blocks",
    icon: <Heading1 size={18} className="text-slate-700 dark:text-slate-300" />,
    action: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode("h1"));
        }
      });
    },
  },
  {
    key: "h2",
    title: "Heading 2",
    description: "Medium section heading",
    category: "Basic blocks",
    icon: <Heading2 size={18} className="text-slate-700 dark:text-slate-300" />,
    action: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode("h2"));
        }
      });
    },
  },
  {
    key: "bullet",
    title: "Bulleted list",
    description: "Create a simple bulleted list",
    category: "Basic blocks",
    icon: <List size={18} className="text-slate-700 dark:text-slate-300" />,
    action: (editor) => {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    },
  },
  {
    key: "number",
    title: "Numbered list",
    description: "Create a list with numbering",
    category: "Basic blocks",
    icon: <ListOrdered size={18} className="text-slate-700 dark:text-slate-300" />,
    action: (editor) => {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    },
  },
  {
    key: "todo",
    title: "To-do list",
    description: "Track tasks with a to-do list",
    category: "Basic blocks",
    icon: <CheckSquare size={18} className="text-slate-700 dark:text-slate-300" />,
    action: (editor) => {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    },
  },
  {
    key: "quote",
    title: "Quote",
    description: "Capture a quote block",
    category: "Basic blocks",
    icon: <Quote size={18} className="text-slate-700 dark:text-slate-300" />,
    action: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    },
  },
  {
    key: "code",
    title: "Code block",
    description: "Write code snippets",
    category: "Basic blocks",
    icon: <Terminal size={18} className="text-slate-700 dark:text-slate-300" />,
    action: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    },
  },
  {
    key: "divider",
    title: "Divider",
    description: "Visually divide blocks with a line",
    category: "Basic blocks",
    icon: <Minus size={18} className="text-slate-700 dark:text-slate-300" />,
    action: (editor) => {
      editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
    },
  },
  {
    key: "table",
    title: "Table (3x3)",
    description: "Insert a custom 3x3 data table",
    category: "Basic blocks",
    icon: <Table2 size={18} className="text-slate-700 dark:text-slate-300" />,
    action: (editor) => {
      editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns: "3", rows: "3" });
    },
  },
  {
    key: "layout2",
    title: "2 Columns",
    description: "Split editor into two columns",
    category: "Layouts",
    icon: <Columns2 size={18} className="text-blue-500" />,
    action: (editor) => {
      editor.dispatchCommand(INSERT_LAYOUT_COMMAND, "1fr 1fr");
    },
  },
  {
    key: "layout3",
    title: "3 Columns",
    description: "Split editor into three columns",
    category: "Layouts",
    icon: <Columns3 size={18} className="text-blue-500" />,
    action: (editor) => {
      editor.dispatchCommand(INSERT_LAYOUT_COMMAND, "1fr 1fr 1fr");
    },
  },
  {
    key: "image-upload",
    title: "Upload Image",
    description: "Upload a local image file",
    category: "Media",
    icon: <Image size={18} className="text-indigo-500" />,
    action: (editor, uploadContainer = "research-file") => {
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
              editor.update(() => {
                const imageNode = $createImageNode({
                  src: url,
                  altText: file.name,
                });
                $insertNodes([imageNode]);
              });
              toast.success("Image uploaded!");
            }
          } catch (error) {
            console.error("Lexical Component Picker: Public Upload failed", error);
            toast.error("Upload failed.");
          }
        }
      };
      input.click();
    },
  },
  {
    key: "image-url",
    title: "Embed Image URL",
    description: "Embed an image with a web URL link",
    category: "Media",
    icon: <Image size={18} className="text-indigo-400" />,
    action: (editor) => {
      editor.dispatchCommand(OPEN_IMAGE_PROMPT_COMMAND, undefined);
    },
  },
  {
    key: "equation",
    title: "Math Equation",
    description: "Render complex KaTeX math formulas",
    category: "Advanced blocks",
    icon: <Sigma size={18} className="text-purple-500" />,
    action: (editor) => {
      editor.dispatchCommand(INSERT_EQUATION_COMMAND, { equation: "f(x) = y", inline: false });
    },
  },
  {
    key: "excalidraw",
    title: "Excalidraw Sketch",
    description: "Sketch designs on an interactive canvas",
    category: "Advanced blocks",
    icon: <Palette size={18} className="text-orange-500" />,
    action: (editor) => {
      editor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined);
    },
  },
  {
    key: "poll",
    title: "Interactive Poll",
    description: "Insert a stylish custom voting poll",
    category: "Advanced blocks",
    icon: <BarChart3 size={18} className="text-emerald-500" />,
    action: (editor) => {
      editor.dispatchCommand(OPEN_POLL_PROMPT_COMMAND, undefined);
    },
  },
];

const CATEGORIES: ItemCategory[] = [
  "Basic blocks",
  "Layouts",
  "Media",
  "Advanced blocks",
];

export function ComponentPickerPlugin({ uploadContainer = "research-file" }: { uploadContainer?: string }): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const [coords, setCoords] = React.useState<{ top: number; left: number } | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [query, setQuery] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const menuRef = React.useRef<HTMLDivElement | null>(null);

  const checkSlashCommand = React.useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) && selection.isCollapsed()) {
        const anchor = selection.anchor;
        const textNode = anchor.getNode();
        if ($isTextNode(textNode)) {
          const textContent = textNode.getTextContent();
          const offset = anchor.offset;
          const prefixText = textContent.slice(0, offset);
          
          const lastSlashIndex = prefixText.lastIndexOf("/");
          if (lastSlashIndex !== -1 && (lastSlashIndex === 0 || prefixText[lastSlashIndex - 1] === " ")) {
            const q = prefixText.slice(lastSlashIndex + 1).toLowerCase();
            setQuery(q);
            setIsOpen(true);

            const nativeSelection = window.getSelection();
            if (nativeSelection && nativeSelection.rangeCount > 0) {
              const range = nativeSelection.getRangeAt(0);
              const rect = range.getBoundingClientRect();
              setCoords({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX,
              });
            }
            return;
          }
        }
      }
      setIsOpen(false);
      setCoords(null);
    });
  }, [editor]);

  React.useEffect(() => {
    return editor.registerUpdateListener(() => {
      checkSlashCommand();
    });
  }, [editor, checkSlashCommand]);

  const filteredItems = React.useMemo(() => {
    return ITEMS.filter((item) =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  }, [query]);

  // Handle keyboard events when open
  React.useEffect(() => {
    if (!isOpen || filteredItems.length === 0) return;

    return mergeRegister(
      editor.registerCommand(
        KEY_ARROW_DOWN_COMMAND,
        (event) => {
          if (event) {
            event.preventDefault();
          }
          setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ARROW_UP_COMMAND,
        (event) => {
          if (event) {
            event.preventDefault();
          }
          setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        (event) => {
          if (event) {
            event.preventDefault();
          }
          // Delete the slash trigger from the editor text node first
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const anchor = selection.anchor;
              const textNode = anchor.getNode();
              if ($isTextNode(textNode)) {
                const textContent = textNode.getTextContent();
                const offset = anchor.offset;
                const slashIdx = textContent.slice(0, offset).lastIndexOf("/");
                if (slashIdx !== -1) {
                  textNode.setTextContent(
                    textContent.slice(0, slashIdx) + textContent.slice(offset)
                  );
                  selection.setTextNodeRange(textNode, slashIdx, textNode, slashIdx);
                }
              }
            }
          });
          // Execute selected item's action
          filteredItems[selectedIndex].action(editor, uploadContainer);
          setIsOpen(false);
          return true;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        (event) => {
          if (event) {
            event.preventDefault();
          }
          setIsOpen(false);
          return true;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [isOpen, filteredItems, selectedIndex, editor, uploadContainer]);

  // Adjust index if list shrinks
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Auto-scroll selected item into view inside the dropdown menu
  React.useEffect(() => {
    if (menuRef.current) {
      const selectedElement = menuRef.current.querySelector(".active-scroll-item");
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
        });
      }
    }
  }, [selectedIndex]);

  if (!mounted || !isOpen || !coords || filteredItems.length === 0) return null;

  // Track global indexes when listing grouped components visually
  let globalItemIndexCounter = 0;

  return createPortal(
    <div
      ref={menuRef}
      className="editor-slash-menu border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-y-auto max-h-[320px] w-[320px] py-1.5"
      style={{
        position: "absolute",
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        zIndex: 1000,
        scrollBehavior: "smooth",
      }}
    >
      {CATEGORIES.map((category) => {
        // Find if this category has matches
        const categoryItems = filteredItems.filter((item) => item.category === category);
        if (categoryItems.length === 0) return null;

        return (
          <div key={category} className="mb-1.5 last:mb-0">
            {/* Header category title */}
            <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 px-3 py-1 uppercase tracking-wider select-none">
              {category}
            </div>

            {/* Category items */}
            {categoryItems.map((item) => {
              const currentGlobalIdx = globalItemIndexCounter;
              globalItemIndexCounter++;

              const isSelected = currentGlobalIdx === selectedIndex;

              return (
                <div
                  key={item.key}
                  className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors duration-150 rounded-lg mx-1.5 ${
                    isSelected
                      ? "active-scroll-item bg-slate-100 dark:bg-slate-700"
                      : "hover:bg-slate-50 dark:hover:bg-slate-750"
                  }`}
                  onClick={() => {
                    // Clear trigger slash text
                    editor.update(() => {
                      const selection = $getSelection();
                      if ($isRangeSelection(selection)) {
                        const anchor = selection.anchor;
                        const textNode = anchor.getNode();
                        if ($isTextNode(textNode)) {
                          const textContent = textNode.getTextContent();
                          const offset = anchor.offset;
                          const slashIdx = textContent.slice(0, offset).lastIndexOf("/");
                          if (slashIdx !== -1) {
                            textNode.setTextContent(
                              textContent.slice(0, slashIdx) + textContent.slice(offset)
                            );
                            selection.setTextNodeRange(textNode, slashIdx, textNode, slashIdx);
                          }
                        }
                      }
                    });
                    item.action(editor, uploadContainer);
                    setIsOpen(false);
                  }}
                >
                  {/* Left Icon badge wrapper */}
                  <div className="flex items-center justify-center w-9 h-9 border border-slate-150 dark:border-slate-650 rounded-lg bg-white dark:bg-slate-700/50 shadow-sm flex-shrink-0">
                    {item.icon}
                  </div>

                  {/* Right Description text */}
                  <div className="flex flex-col select-none">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-150 leading-snug">
                      {item.title}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-450 leading-snug">
                      {item.description}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>,
    document.body
  );
}
