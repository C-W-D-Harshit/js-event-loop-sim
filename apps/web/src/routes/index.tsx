import { createFileRoute } from "@tanstack/react-router";
import { SimulatorProvider } from "@/components/simulator/SimulatorProvider";
import { CallStack } from "@/components/simulator/CallStack";
import { Queues } from "@/components/simulator/Queues";
import { PhaseIndicator } from "@/components/simulator/PhaseIndicator";
import { Controls } from "@/components/simulator/Controls";
import { CodePanel } from "@/components/simulator/CodePanel";
import { ConsolePanel } from "@/components/simulator/ConsolePanel";
import { ScenarioSelector } from "@/components/simulator/ScenarioSelector";
import { ResizableCardFrame } from "@/components/simulator/ResizableCardFrame";
import { useLayoutState, type CardId } from "@/hooks/useLayoutState";
import { useRef, useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const { layouts, updateLayout, bringToFront, resetLayouts } = useLayoutState(containerSize);

  const cards: { id: CardId; title: string; content: React.ReactNode }[] = [
    { id: "callStack", title: "Call Stack", content: <CallStack className="h-full" /> },
    { id: "console", title: "Console", content: <ConsolePanel /> },
    { id: "queues", title: "Queues", content: <Queues /> },
    { id: "code", title: "Code", content: <CodePanel /> },
  ];

  return (
    <SimulatorProvider>
      <div className="flex h-full flex-col overflow-hidden bg-background">
        <header className="shrink-0 border-b bg-background/80 backdrop-blur">
          <div className="flex items-center gap-4 px-4 py-2">
            <h1 className="shrink-0 text-base font-semibold tracking-tight">
              JS Event Loop
            </h1>
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <ScenarioSelector />
              <div className="hidden items-center gap-2 lg:flex">
                <PhaseIndicator />
              </div>
            </div>
            <div className="hidden lg:flex">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetLayouts}
                title="Reset layout"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            <Controls />
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2 lg:hidden">
          <div className="shrink-0">
            <PhaseIndicator />
          </div>
          <CallStack className="min-h-[300px]" />
          <div className="min-h-[300px]">
            <CodePanel />
          </div>
          <div className="min-h-[200px]">
            <ConsolePanel />
          </div>
        </main>

        <main
          ref={containerRef}
          className="relative hidden min-h-0 flex-1 overflow-hidden p-2 lg:block"
        >
          {containerSize.width > 0 && containerSize.height > 0 && (
            <>
              {cards.map((card) => (
                <ResizableCardFrame
                  key={card.id}
                  cardId={card.id}
                  title={card.title}
                  layout={layouts[card.id]}
                  containerBounds={containerSize}
                  onLayoutChange={updateLayout}
                  onBringToFront={bringToFront}
                >
                  {card.content}
                </ResizableCardFrame>
              ))}
            </>
          )}
        </main>
      </div>
    </SimulatorProvider>
  );
}
