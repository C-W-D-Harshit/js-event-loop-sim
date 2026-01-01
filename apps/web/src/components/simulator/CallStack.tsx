import { AnimatePresence } from "framer-motion";
import { TaskCard } from "./TaskCard";
import { useSimulatorContext } from "./SimulatorProvider";
import { Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function CallStack({ className }: { className?: string }) {
  const { state } = useSimulatorContext();
  const frames = [...state.callStack].reverse();

  return (
    <Card
      size="sm"
      className={cn("flex min-h-0 flex-col overflow-hidden", className ?? "")}
    >
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Layers className="size-4 text-blue-400" />
          Call Stack
          <span className="ml-auto text-xs font-normal text-muted-foreground">
            {state.callStack.length} frame
            {state.callStack.length !== 1 ? "s" : ""}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 overflow-auto p-3">
        <AnimatePresence mode="popLayout">
          {frames.length === 0 ? (
            <div className="flex h-full min-h-[120px] items-center justify-center text-sm text-muted-foreground">
              Empty
            </div>
          ) : (
            <div className="space-y-2">
              {frames.map((frame) => (
                <TaskCard key={frame.id} task={frame} variant="stack" />
              ))}
            </div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
