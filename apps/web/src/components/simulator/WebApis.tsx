import { AnimatePresence } from "framer-motion";
import { TaskCard } from "./TaskCard";
import { useSimulatorContext } from "./SimulatorProvider";
import { Globe, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WebApis() {
  const { state } = useSimulatorContext();
  const Icon = Globe;
  const title = "Web APIs";

  return (
    <Card size="sm" className="flex min-h-0 flex-col overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Icon className="size-4 text-muted-foreground" />
          {title}
          <span className="ml-auto text-xs font-normal text-muted-foreground">
            {state.webApis.length} pending
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 overflow-auto p-3">
        <AnimatePresence mode="popLayout">
          {state.webApis.length === 0 ? (
            <div className="flex h-full min-h-[120px] items-center justify-center text-sm text-muted-foreground">
              No pending operations
            </div>
          ) : (
            <div className="space-y-2">
              {state.webApis.map((op) => (
                <TaskCard key={op.id} task={op} variant="async" showProgress />
              ))}
            </div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
