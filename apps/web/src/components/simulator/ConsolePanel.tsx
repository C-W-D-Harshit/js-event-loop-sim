import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSimulatorContext } from "./SimulatorProvider";

export function ConsolePanel() {
  const { state } = useSimulatorContext();

  return (
    <Card size="sm" className="flex h-full flex-col overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Terminal className="size-4 text-muted-foreground" />
          Console
          {state.consoleOutput.length > 0 && (
            <span className="text-xs font-normal text-muted-foreground">
              ({state.consoleOutput.length} logs)
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 overflow-auto p-0 font-mono text-sm">
        {state.consoleOutput.length === 0 ? (
          <div className="p-4 text-xs text-muted-foreground">
            Console output will appear here.
          </div>
        ) : (
          <div className="p-3">
            <AnimatePresence mode="popLayout">
              {state.consoleOutput.map((output, i) => (
                <motion.div
                  key={`${i}-${output}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-start gap-2 rounded px-2 py-1 hover:bg-muted/40"
                >
                  <span className="text-emerald-500 shrink-0">{">"}</span>
                  <span className="text-foreground/90">{output}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
