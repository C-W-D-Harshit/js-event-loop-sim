import { createFileRoute } from "@tanstack/react-router";
import { SimulatorProvider } from "@/components/simulator/SimulatorProvider";
import { CallStack } from "@/components/simulator/CallStack";
import { Queues } from "@/components/simulator/Queues";
import { PhaseIndicator } from "@/components/simulator/PhaseIndicator";
import { Controls } from "@/components/simulator/Controls";
import { CodePanel } from "@/components/simulator/CodePanel";
import { ConsolePanel } from "@/components/simulator/ConsolePanel";
import { ScenarioSelector } from "@/components/simulator/ScenarioSelector";
import { QuickEnqueue } from "@/components/simulator/QuickEnqueue";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <SimulatorProvider>
      <div className="flex h-full flex-col overflow-hidden">
        {/* Compact Header */}
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

        {/* Main Content - 3 Column Layout */}
        <main className="grid min-h-0 flex-1 grid-cols-1 gap-2 overflow-hidden p-2 lg:grid-cols-[320px_320px_1fr]">
          {/* Left Column: Runtime Visualization */}
          <div className="flex min-h-0 flex-col gap-2 overflow-hidden">
            {/* Mobile Phase Indicator */}
            <div className="shrink-0 lg:hidden">
              <PhaseIndicator />
            </div>
            {/* Runtime Grid */}
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 overflow-hidden md:grid-cols-2">
              <CallStack className="col-span-2" />
              {/* <Queues /> */}
            </div>
          </div>

          {/* Middle Column (desktop): Queues */}
          <div className="hidden min-h-0 flex-col gap-2 overflow-hidden lg:flex">
            <Queues />
          </div>

          {/* Right Column: Code & Console */}
          <div className="flex min-h-0 flex-col gap-2 overflow-hidden">
            <div className="min-h-0 flex-1 overflow-hidden lg:hidden">
              <CallStack className="lg:hidden" />
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              <CodePanel />
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              <ConsolePanel />
            </div>
          </div>
        </main>
      </div>
    </SimulatorProvider>
  );
}
