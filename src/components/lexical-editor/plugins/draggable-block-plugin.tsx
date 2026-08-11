import * as React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { DraggableBlockPlugin_EXPERIMENTAL } from "@lexical/react/LexicalDraggableBlockPlugin";

export function DraggableBlockPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): React.JSX.Element {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const targetLineRef = React.useRef<HTMLDivElement>(null);

  function isOnMenu(element: HTMLElement): boolean {
    return !!element.closest(".draggable-block-menu");
  }

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={anchorElem}
      menuRef={menuRef}
      targetLineRef={targetLineRef}
      menuComponent={
        <div ref={menuRef} className="draggable-block-menu">
          <div className="draggable-block-handle" title="Drag to reorder">
            ⋮⋮
          </div>
        </div>
      }
      targetLineComponent={
        <div ref={targetLineRef} className="draggable-block-target-line" />
      }
      isOnMenu={isOnMenu}
    />
  );
}
