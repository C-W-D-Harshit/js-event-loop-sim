import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Task, StackFrame, AsyncOperation, RenderStep } from '@/lib/simulator/types';
import { getTaskColor } from '@/lib/simulator/types';

type TaskItem = Task | StackFrame | AsyncOperation | RenderStep;

interface TaskCardProps {
  task: TaskItem;
  variant?: 'stack' | 'microtask' | 'macrotask' | 'async' | 'render' | 'nextTick';
  showProgress?: boolean;
  className?: string;
}

function getColor(task: TaskItem): string {
  if ('color' in task && task.color) {
    return task.color;
  }
  if ('type' in task && typeof task.type === 'string') {
    const taskType = task.type;
    if (['rAF', 'style', 'layout', 'paint'].includes(taskType)) {
      return '#34d399';
    }
    return getTaskColor(taskType as Parameters<typeof getTaskColor>[0]);
  }
  return '#60a5fa';
}

export function TaskCard({ 
  task, 
  variant = 'macrotask',
  showProgress = false,
  className 
}: TaskCardProps) {
  const color = getColor(task);
  const progress = showProgress && 'progress' in task ? task.progress : undefined;

  const variantStyles = {
    stack: 'border-blue-400/50 bg-blue-950/50',
    microtask: 'border-violet-400/50 bg-violet-950/50',
    macrotask: 'border-amber-400/50 bg-amber-950/50',
    async: 'border-slate-400/50 bg-slate-800/50',
    render: 'border-emerald-400/50 bg-emerald-950/50',
    nextTick: 'border-pink-400/50 bg-pink-950/50',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ 
        type: 'spring', 
        stiffness: 500, 
        damping: 30,
        mass: 0.8
      }}
      className={cn(
        'relative px-3 py-2 rounded-md border text-sm font-mono',
        'shadow-sm backdrop-blur-sm',
        variantStyles[variant],
        className
      )}
      style={{ borderLeftColor: color, borderLeftWidth: 3 }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-foreground/90">{task.label}</span>
      </div>
      
      {progress !== undefined && (
        <div className="mt-1.5 h-1 w-full rounded-full bg-slate-700 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-slate-400 to-slate-300"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
      
      {'delay' in task && task.delay !== undefined && (
        <div className="mt-1 text-xs text-muted-foreground">
          {task.delay}ms
        </div>
      )}
    </motion.div>
  );
}
