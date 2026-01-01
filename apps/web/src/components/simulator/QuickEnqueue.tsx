import { Timer, Zap, Clock, MousePointer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSimulatorContext } from "./SimulatorProvider";
import type { TaskType } from "@/lib/simulator/types";

interface QuickEnqueueOption {
  type: TaskType;
  label: string;
  icon: typeof Timer;
  runtime: "browser" | "node" | "both";
}

const QUICK_ENQUEUE_OPTIONS: QuickEnqueueOption[] = [
  { type: "setTimeout", label: "setTimeout", icon: Timer, runtime: "both" },
  { type: "promise", label: "Promise.then", icon: Zap, runtime: "both" },
  { type: "queueMicrotask", label: "queueMicrotask", icon: Zap, runtime: "both" },
  { type: "domEvent", label: "Click Event", icon: MousePointer, runtime: "browser" },
  { type: "nextTick", label: "nextTick", icon: Clock, runtime: "node" },
];

export function QuickEnqueue() {
  const { state, enqueueTask } = useSimulatorContext();

  const availableOptions = QUICK_ENQUEUE_OPTIONS.filter(
    (opt) => opt.runtime === "both" || opt.runtime === state.runtime
  );

  return (
    <div className="p-3 border-t border-border bg-card/50">
      <div className="text-xs text-muted-foreground mb-2">Quick Enqueue:</div>
      <div className="flex flex-wrap gap-1">
        {availableOptions.map(({ type, label, icon: Icon }) => (
          <Button
            key={type}
            variant="outline"
            size="xs"
            onClick={() => enqueueTask(type, `${label} (manual)`)}
            className="gap-1"
          >
            <Icon className="size-3" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
