/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types";
import type { JSX } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement } from "@lexical/utils";
import {$createParagraphNode, $insertNodes, $isRootOrShadowRoot, COMMAND_PRIORITY_EDITOR, createCommand} from "lexical";
import type {LexicalCommand} from "lexical";
import { lazy, Suspense, useEffect, useState } from "react";

import {
  $createExcalidrawNode,
  ExcalidrawNode,
} from "../../nodes/ExcalidrawNode";

/** Keep Excalidraw out of the initial SSR/client graph until the modal opens. */
const ExcalidrawModal = lazy(() => import("../../ui/ExcalidrawModal"));

type ExcalidrawInitialElements = NonNullable<
  import("@excalidraw/excalidraw/types").ExcalidrawInitialDataState["elements"]
>;

export const INSERT_EXCALIDRAW_COMMAND: LexicalCommand<void> = createCommand(
  "INSERT_EXCALIDRAW_COMMAND",
);

export default function ExcalidrawPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!editor.hasNodes([ExcalidrawNode])) {
      throw new Error(
        "ExcalidrawPlugin: ExcalidrawNode not registered on editor",
      );
    }

    return editor.registerCommand(
      INSERT_EXCALIDRAW_COMMAND,
      () => {
        setModalOpen(true);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  const onClose = () => {
    setModalOpen(false);
  };

  const onDelete = () => {
    setModalOpen(false);
  };

  const onSave = (
    elements: ExcalidrawInitialElements | null | undefined,
    appState: Partial<AppState>,
    files: BinaryFiles,
  ) => {
    if (!elements) {
      setModalOpen(false);
      return;
    }

    editor.update(() => {
      const excalidrawNode = $createExcalidrawNode();
      excalidrawNode.setData(
        JSON.stringify({
          appState,
          elements,
          files,
        }),
      );
      $insertNodes([excalidrawNode]);
      if ($isRootOrShadowRoot(excalidrawNode.getParentOrThrow())) {
        $wrapNodeInElement(excalidrawNode, $createParagraphNode).selectEnd();
      }
    });
    setModalOpen(false);
  };

  if (!isModalOpen) return null;

  return (
    <Suspense fallback={null}>
      <ExcalidrawModal
        initialElements={[]}
        initialAppState={{} as AppState}
        initialFiles={{}}
        isShown={isModalOpen}
        onDelete={onDelete}
        onClose={onClose}
        onSave={onSave}
        closeOnClickOutside={false}
      />
    </Suspense>
  );
}
