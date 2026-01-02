import { createFileRoute } from "@tanstack/react-router";
import { SimulatorProvider } from "@/components/simulator/SimulatorProvider";
import { CallStack } from "@/components/simulator/CallStack";
import { Queues } from "@/components/simulator/Queues";
import { PhaseIndicator } from "@/components/simulator/PhaseIndicator";
import { Controls } from "@/components/simulator/Controls";
import { CodePanel } from "@/components/simulator/CodePanel";
import { ConsolePanel } from "@/components/simulator/ConsolePanel";
import { ScenarioSelector } from "@/components/simulator/ScenarioSelector";
import { Panel, Group, Separator } from "react-resizable-panels";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
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

        <main className="hidden min-h-0 flex-1 p-2 lg:block">
          <Group orientation="horizontal" className="h-full">
            <Panel id="left-column" defaultSize={25} minSize={15}>
              <Group orientation="vertical" className="h-full">
                <Panel id="callstack" defaultSize={60} minSize={20}>
                  <CallStack className="h-full" />
                </Panel>
                <Separator className="mx-1 w-1 rounded bg-border transition-colors hover:bg-primary/50 data-[resize-handle-state=drag]:bg-primary" />
                <Panel id="console" defaultSize={40} minSize={15}>
                  <ConsolePanel />
                </Panel>
              </Group>
            </Panel>

            <Separator className="my-1 h-auto w-1 rounded bg-border transition-colors hover:bg-primary/50 data-[resize-handle-state=drag]:bg-primary" />

            <Panel id="queues" defaultSize={30} minSize={20}>
              <Queues />
            </Panel>

            <Separator className="my-1 h-auto w-1 rounded bg-border transition-colors hover:bg-primary/50 data-[resize-handle-state=drag]:bg-primary" />

            <Panel id="code" defaultSize={45} minSize={25}>
              <CodePanel />
            </Panel>
          </Group>
        </main>
      </div>
    </SimulatorProvider>
  );
}
