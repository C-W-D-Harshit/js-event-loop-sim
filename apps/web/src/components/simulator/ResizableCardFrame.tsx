import { useRef, useCallback, useState, type ReactNode, type PointerEvent } from "react";
import { GripVertical, Maximize2 } from "lucide-react";
import type { CardId, CardLayout } from "@/hooks/useLayoutState";

interface ResizableCardFrameProps {
  cardId: CardId;
  layout: CardLayout;
  onLayoutChange: (cardId: CardId, updates: Partial<CardLayout>) => void;
  onBringToFront: (cardId: CardId) => void;
  children: ReactNode;
  title?: string;
  minWidth?: number;
  minHeight?: number;
  containerBounds?: { width: number; height: number };
}

type DragMode = "none" | "move" | "resize";

export function ResizableCardFrame({
  cardId,
  layout,
  onLayoutChange,
  onBringToFront,
  children,
  title,
  minWidth = 200,
  minHeight = 150,
  containerBounds,
}: ResizableCardFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [dragMode, setDragMode] = useState<DragMode>("none");
  const dragStartRef = useRef({ x: 0, y: 0, layoutX: 0, layoutY: 0, layoutW: 0, layoutH: 0 });

  const handlePointerDown = useCallback(
    (e: PointerEvent, mode: DragMode) => {
      e.preventDefault();
      e.stopPropagation();
      
      onBringToFront(cardId);
      setDragMode(mode);
      
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        layoutX: layout.x,
        layoutY: layout.y,
        layoutW: layout.w,
        layoutH: layout.h,
      };

      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      document.body.style.userSelect = "none";
    },
    [cardId, layout, onBringToFront]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (dragMode === "none") return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      if (dragMode === "move") {
        let newX = dragStartRef.current.layoutX + deltaX;
        let newY = dragStartRef.current.layoutY + deltaY;

        if (containerBounds) {
          newX = Math.max(0, Math.min(newX, containerBounds.width - layout.w));
          newY = Math.max(0, Math.min(newY, containerBounds.height - layout.h));
        }

        onLayoutChange(cardId, { x: newX, y: newY });
      } else if (dragMode === "resize") {
        let newW = Math.max(minWidth, dragStartRef.current.layoutW + deltaX);
        let newH = Math.max(minHeight, dragStartRef.current.layoutH + deltaY);

        if (containerBounds) {
          newW = Math.min(newW, containerBounds.width - layout.x);
          newH = Math.min(newH, containerBounds.height - layout.y);
        }

        onLayoutChange(cardId, { w: newW, h: newH });
      }
    },
    [dragMode, cardId, layout, containerBounds, minWidth, minHeight, onLayoutChange]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      if (dragMode === "none") return;
      
      setDragMode("none");
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      document.body.style.userSelect = "";
    },
    [dragMode]
  );

  return (
    <div
      ref={frameRef}
      className="absolute rounded-lg border bg-card shadow-lg overflow-hidden flex flex-col"
      style={{
        left: layout.x,
        top: layout.y,
        width: layout.w,
        height: layout.h,
        zIndex: layout.z,
      }}
      onPointerDown={() => onBringToFront(cardId)}
    >
      <div
        className="drag-handle flex items-center gap-2 px-3 py-1.5 bg-muted/50 border-b cursor-move select-none shrink-0"
        onPointerDown={(e) => handlePointerDown(e, "move")}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
        {title && <span className="text-sm font-medium text-foreground">{title}</span>}
      </div>

      <div className="card-content flex-1 min-h-0 overflow-auto">
        {children}
      </div>

      <div
        className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-center justify-center"
        onPointerDown={(e) => handlePointerDown(e, "resize")}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <Maximize2 className="h-3 w-3 text-muted-foreground rotate-90" />
      </div>
    </div>
  );
}
