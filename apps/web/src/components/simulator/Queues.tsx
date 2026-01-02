import { AnimatePresence } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { useSimulatorContext } from './SimulatorProvider';
import { Zap, Clock, FastForward } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Panel, Group, Separator } from 'react-resizable-panels';

export function Queues() {
  const { state } = useSimulatorContext();
  const showNextTick = state.runtime === 'node' && state.nextTickQueue.length > 0;

  return (
    <Group orientation="vertical" className="h-full">
      {showNextTick && (
        <>
          <Panel id="nextTick-queue" defaultSize={33} minSize={15}>
            <QueueSection
              title="nextTick Queue"
              icon={<FastForward className="h-4 w-4 text-pink-400" />}
              count={state.nextTickQueue.length}
              hint="Runs before other microtasks"
            >
              {state.nextTickQueue.map((task) => (
                <TaskCard key={task.id} task={task} variant="nextTick" />
              ))}
            </QueueSection>
          </Panel>
          <Separator className="mx-1 h-1 rounded bg-border transition-colors hover:bg-primary/50 data-[resize-handle-state=drag]:bg-primary" />
        </>
      )}

      <Panel id="microtask-queue" defaultSize={showNextTick ? 33 : 50} minSize={15}>
        <QueueSection
          title="Microtask Queue"
          icon={<Zap className="h-4 w-4 text-violet-400" />}
          count={state.microtaskQueue.length}
          hint="Drains completely after each task"
        >
          {state.microtaskQueue.map((task) => (
            <TaskCard key={task.id} task={task} variant="microtask" />
          ))}
        </QueueSection>
      </Panel>

      <Separator className="mx-1 h-1 rounded bg-border transition-colors hover:bg-primary/50 data-[resize-handle-state=drag]:bg-primary" />

      <Panel id="macrotask-queue" defaultSize={showNextTick ? 34 : 50} minSize={15}>
        <QueueSection
          title="Macrotask Queue"
          icon={<Clock className="h-4 w-4 text-amber-400" />}
          count={state.macrotaskQueue.length}
          hint="One per event loop iteration"
        >
          {state.macrotaskQueue.map((task) => (
            <TaskCard key={task.id} task={task} variant="macrotask" />
          ))}
        </QueueSection>
      </Panel>
    </Group>
  );
}

interface QueueSectionProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  hint?: string;
  children: React.ReactNode;
}

function QueueSection({ title, icon, count, hint, children }: QueueSectionProps) {
  return (
    <Card size="sm" className="flex h-full min-h-0 flex-col overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-sm">
          {icon}
          {title}
          <span className="ml-auto text-xs font-normal text-muted-foreground">
            {count}
          </span>
        </CardTitle>
        {hint ? <div className="text-xs text-muted-foreground">{hint}</div> : null}
      </CardHeader>

      <CardContent className="min-h-0 flex-1 overflow-auto p-3">
        <AnimatePresence mode="popLayout">
          {count === 0 ? (
            <div className="flex h-full min-h-[120px] items-center justify-center text-sm text-muted-foreground">
              Empty
            </div>
          ) : (
            <div className="space-y-2">{children}</div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
