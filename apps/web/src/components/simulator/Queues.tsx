import { AnimatePresence } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { useSimulatorContext } from './SimulatorProvider';
import { Zap, Clock, FastForward } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Queues() {
  const { state } = useSimulatorContext();
  const showNextTick = state.runtime === 'node' && state.nextTickQueue.length > 0;

  return (
    <div className="flex h-full flex-col gap-2">
      {showNextTick && (
        <QueueSection
          title="nextTick Queue"
          icon={<FastForward className="h-4 w-4 text-pink-400" />}
          count={state.nextTickQueue.length}
          hint="Runs before other microtasks"
          className="flex-1 min-h-0"
        >
          {state.nextTickQueue.map((task) => (
            <TaskCard key={task.id} task={task} variant="nextTick" />
          ))}
        </QueueSection>
      )}

      <QueueSection
        title="Microtask Queue"
        icon={<Zap className="h-4 w-4 text-violet-400" />}
        count={state.microtaskQueue.length}
        hint="Drains completely after each task"
        className="flex-1 min-h-0"
      >
        {state.microtaskQueue.map((task) => (
          <TaskCard key={task.id} task={task} variant="microtask" />
        ))}
      </QueueSection>

      <QueueSection
        title="Macrotask Queue"
        icon={<Clock className="h-4 w-4 text-amber-400" />}
        count={state.macrotaskQueue.length}
        hint="One per event loop iteration"
        className="flex-1 min-h-0"
      >
        {state.macrotaskQueue.map((task) => (
          <TaskCard key={task.id} task={task} variant="macrotask" />
        ))}
      </QueueSection>
    </div>
  );
}

interface QueueSectionProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

function QueueSection({ title, icon, count, hint, children, className }: QueueSectionProps) {
  return (
    <Card size="sm" className={`flex min-h-0 flex-col overflow-hidden ${className ?? ''}`}>
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
