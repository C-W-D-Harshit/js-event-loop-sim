import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSimulatorContext } from "./SimulatorProvider";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";

export function CodePanel({ className }: { className?: string }) {
  const { state, currentScenario } = useSimulatorContext();

  const highlightedCode = useMemo(() => {
    if (!currentScenario) return [];
    
    const html = Prism.highlight(
      currentScenario.code,
      Prism.languages.javascript,
      "javascript"
    );
    
    return html.split("\n");
  }, [currentScenario]);

  if (!currentScenario) {
    return (
      <Card size="sm" className="flex h-full flex-col">
        <CardHeader className="border-b">
          <CardTitle>Code</CardTitle>
          <CardDescription>Select a scenario to view the code.</CardDescription>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 items-center justify-center text-sm text-muted-foreground">
          No scenario selected
        </CardContent>
      </Card>
    );
  }

  const highlightLines = state.highlightedLines;

  return (
    <Card
      size="sm"
      className={cn("flex h-full flex-col overflow-hidden", className ?? "")}
    >
      <CardHeader className="border-b">
        <CardTitle className="text-sm">{currentScenario.title}</CardTitle>
        <CardDescription>{currentScenario.description}</CardDescription>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 overflow-auto p-0 font-mono text-sm">
        <pre className="p-4">
          {highlightedCode.map((lineHtml, i) => {
            const lineNum = i + 1;
            const isHighlighted = highlightLines.includes(lineNum);

            return (
              <div
                key={i}
                className={`group flex rounded-sm px-1 transition-colors duration-150 hover:bg-muted/40 ${
                  isHighlighted ? "bg-primary/10 ring-1 ring-primary/20" : ""
                }`}
              >
                <span className="w-10 shrink-0 select-none pr-3 text-right text-[11px] leading-6 text-muted-foreground/60">
                  {lineNum}
                </span>
                <code
                  className={
                    isHighlighted
                      ? "leading-6 text-foreground"
                      : "leading-6"
                  }
                  dangerouslySetInnerHTML={{ __html: lineHtml || " " }}
                />
              </div>
            );
          })}
        </pre>
      </CardContent>

      {currentScenario.explanation && (
        <div className="shrink-0 border-t bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
          <strong className="text-foreground">Why?</strong>{" "}
          {currentScenario.explanation}
        </div>
      )}
    </Card>
  );
}
