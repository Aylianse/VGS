import * as React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {$insertNodes, COMMAND_PRIORITY_EDITOR, createCommand} from "lexical";
import type {LexicalCommand} from "lexical";
import { $createImageNode, ImageNode } from "../nodes/image-node";
import type { ImagePayload } from "../nodes/image-node";
import { mergeRegister } from "@lexical/utils";
import { uploadLexicalImage } from "../upload";
import { toast } from "sonner";

export const INSERT_IMAGE_COMMAND: LexicalCommand<ImagePayload> = createCommand(
  "INSERT_IMAGE_COMMAND"
);

export const OPEN_IMAGE_PROMPT_COMMAND: LexicalCommand<void> = createCommand(
  "OPEN_IMAGE_PROMPT_COMMAND"
);

interface ImagesPluginProps {
  uploadContainer?: string;
}

export function ImagesPlugin({ uploadContainer = "research-file" }: ImagesPluginProps): React.JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      console.warn("ImagesPlugin: ImageNode is not registered.");
    }

    const handleFileUpload = async (file: File) => {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("folder_name", uploadContainer);

      try {
        const response = await uploadLexicalImage(uploadContainer, file.type, uploadFormData);
        
        if (response?.data?.url) {
          const { url } = response.data;
          
          // Insert the image only after successful upload with the permanent URL
          editor.update(() => {
            const imageNode = $createImageNode({
              src: url,
              altText: file.name,
            });
            $insertNodes([imageNode]);
          });
          toast.success("Image uploaded successfully.");
        }
      } catch (error) {
        console.error("Lexical: Public Upload error:", error);
        toast.error("Upload failed.");
      }
    };

    return mergeRegister(
      editor.registerCommand<ImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand<DragEvent>(
        // @ts-ignore
        "DROP_COMMAND",
        (event) => {
          event.preventDefault();
          const files = event.dataTransfer?.files;
          if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith("image/")) {
              toast.info("Uploading image...");
              handleFileUpload(file);
            }
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand<ClipboardEvent>(
        // @ts-ignore
        "PASTE_COMMAND",
        (event) => {
          const items = event.clipboardData?.items;
          if (items) {
            for (let i = 0; i < items.length; i++) {
              const item = items[i];
              if (item.type.startsWith("image/")) {
                const file = item.getAsFile();
                if (file) {
                  toast.info("Uploading image...");
                  handleFileUpload(file);
                  event.preventDefault();
                  return true;
                }
              }
            }
          }
          return false;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor, uploadContainer]);

  return null;
}
