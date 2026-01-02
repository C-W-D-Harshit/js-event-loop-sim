import { useState, useCallback, useEffect } from "react";

export type CardId = "callStack" | "queues" | "code" | "console";

export interface CardLayout {
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
}

export interface LayoutState {
  cards: Record<CardId, CardLayout>;
}

const STORAGE_KEY = "simulator-card-layout:v1";

const DEFAULT_LAYOUTS: Record<CardId, CardLayout> = {
  callStack: { x: 0, y: 0, w: 300, h: 400, z: 1 },
  console: { x: 0, y: 410, w: 300, h: 250, z: 1 },
  queues: { x: 310, y: 0, w: 350, h: 660, z: 1 },
  code: { x: 670, y: 0, w: 500, h: 660, z: 1 },
};

function loadFromStorage(): LayoutState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
  }
  return null;
}

function saveToStorage(state: LayoutState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
  }
}

export function getDefaultLayouts(containerWidth: number, containerHeight: number): Record<CardId, CardLayout> {
  const leftWidth = Math.floor(containerWidth * 0.22);
  const middleWidth = Math.floor(containerWidth * 0.28);
  const gapWidth = 20;
  const rightWidth = containerWidth - leftWidth - middleWidth - gapWidth;
  
  return {
    callStack: { x: 0, y: 0, w: leftWidth, h: Math.floor(containerHeight * 0.55), z: 1 },
    console: { x: 0, y: Math.floor(containerHeight * 0.55) + 10, w: leftWidth, h: Math.floor(containerHeight * 0.45) - 10, z: 1 },
    queues: { x: leftWidth + 10, y: 0, w: middleWidth, h: containerHeight, z: 1 },
    code: { x: leftWidth + middleWidth + 20, y: 0, w: rightWidth, h: containerHeight, z: 1 },
  };
}

export function useLayoutState(containerSize: { width: number; height: number }) {
  const [layouts, setLayouts] = useState<Record<CardId, CardLayout>>(() => {
    const stored = loadFromStorage();
    if (stored?.cards) {
      return stored.cards;
    }
    if (containerSize.width > 0 && containerSize.height > 0) {
      return getDefaultLayouts(containerSize.width, containerSize.height);
    }
    return DEFAULT_LAYOUTS;
  });

  const [maxZ, setMaxZ] = useState(() => {
    return Math.max(...Object.values(layouts).map((l) => l.z), 1);
  });

  useEffect(() => {
    if (containerSize.width > 0 && containerSize.height > 0) {
      const stored = loadFromStorage();
      if (!stored?.cards) {
        setLayouts(getDefaultLayouts(containerSize.width, containerSize.height));
      }
    }
  }, [containerSize.width, containerSize.height]);

  const updateLayout = useCallback((cardId: CardId, updates: Partial<CardLayout>) => {
    setLayouts((prev) => {
      const next = {
        ...prev,
        [cardId]: { ...prev[cardId], ...updates },
      };
      saveToStorage({ cards: next });
      return next;
    });
  }, []);

  const bringToFront = useCallback((cardId: CardId) => {
    setMaxZ((prev) => {
      const newZ = prev + 1;
      setLayouts((layouts) => {
        const next = {
          ...layouts,
          [cardId]: { ...layouts[cardId], z: newZ },
        };
        saveToStorage({ cards: next });
        return next;
      });
      return newZ;
    });
  }, []);

  const resetLayouts = useCallback(() => {
    const defaults = containerSize.width > 0 && containerSize.height > 0
      ? getDefaultLayouts(containerSize.width, containerSize.height)
      : DEFAULT_LAYOUTS;
    setLayouts(defaults);
    setMaxZ(1);
    localStorage.removeItem(STORAGE_KEY);
  }, [containerSize]);

  return {
    layouts,
    updateLayout,
    bringToFront,
    resetLayouts,
  };
}
