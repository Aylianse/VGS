import * as React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  INDENT_CONTENT_COMMAND,
} from "lexical";
import { $isListItemNode, $isListNode } from "@lexical/list";

type Props = {
  maxDepth?: number;
};

function getElementNodesInSelection(selection: any): Set<any> {
  const nodes = new Set<any>();
  if ($isRangeSelection(selection)) {
    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();
    if (anchorNode === focusNode) {
      nodes.add(anchorNode.getTopLevelElementOrThrow());
    } else {
      const selectedNodes = selection.getNodes();
      for (let i = 0; i < selectedNodes.length; i++) {
        const node = selectedNodes[i];
        if ($isElementNode(node)) {
          nodes.add(node);
        } else {
          const parent = node.getParentOrThrow();
          if ($isElementNode(parent)) {
            nodes.add(parent);
          }
        }
      }
    }
  }
  return nodes;
}

export function ListMaxIndentLevelPlugin({ maxDepth = 7 }: Props): null {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    return editor.registerCommand(
      INDENT_CONTENT_COMMAND,
      () => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }

        const elementNodes = getElementNodesInSelection(selection);
        let maxDepthReached = false;

        elementNodes.forEach((node) => {
          if ($isListItemNode(node)) {
            const parent = node.getParent();
            let depth = 1;
            let currentParent = parent;
            while (currentParent && $isListNode(currentParent)) {
              depth++;
              const grandParent = currentParent.getParent();
              if (grandParent && $isListItemNode(grandParent)) {
                currentParent = grandParent.getParent();
              } else {
                break;
              }
            }
            if (depth >= maxDepth) {
              maxDepthReached = true;
            }
          }
        });

        return maxDepthReached;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, maxDepth]);

  return null;
}
