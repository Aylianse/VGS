import * as React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TextNode } from "lexical";

const EMOJIS: Record<string, string> = {
  ":)": "😊",
  ":smile:": "😊",
  ":D": "😀",
  ":laugh:": "😀",
  ":(": "🙁",
  ":sad:": "🙁",
  ";)": "😉",
  ":wink:": "😉",
  "<3": "❤️",
  ":heart:": "❤️",
  ":thumbsup:": "👍",
  ":thumbsdown:": "👎",
  ":fire:": "🔥",
  ":rocket:": "🚀",
  ":star:": "⭐",
  ":party:": "🎉",
  ":check:": "✅",
};

function textNodeTransform(node: TextNode): void {
  const text = node.getTextContent();
  let updatedText = text;

  for (const [key, val] of Object.entries(EMOJIS)) {
    if (updatedText.includes(key)) {
      updatedText = updatedText.replaceAll(key, val);
    }
  }

  if (updatedText !== text) {
    node.setTextContent(updatedText);
  }
}

export function EmojiPlugin(): null {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    return editor.registerNodeTransform(TextNode, textNodeTransform);
  }, [editor]);

  return null;
}
