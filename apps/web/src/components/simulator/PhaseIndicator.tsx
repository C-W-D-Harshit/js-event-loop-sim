import { motion } from 'framer-motion';
import { useSimulatorContext } from './SimulatorProvider';
import { getBrowserPhases, getNodePhases, getPhaseLabel } from '@/lib/simulator/engine';
import { cn } from '@/lib/utils';
import type { Phase } from '@/lib/simulator/types';
export function PhaseIndicator() {
  const { state } = useSimulatorContext();
  const phases = state.runtime === 'browser' ? getBrowserPhases() : getNodePhases();

  return (
    <div className="flex items-center gap-1 rounded-md border border-border/50 bg-muted/30 px-2 py-1.5">
      {phases.map((phase, index) => (
        <PhaseStep
          key={phase}
          phase={phase}
          runtime={state.runtime}
          isActive={state.phase === phase}
          isLast={index === phases.length - 1}
        />
      ))}
      <div className="ml-1 text-xs text-muted-foreground">↩</div>
    </div>
  );
}

interface PhaseStepProps {
  phase: Phase;
  runtime: 'browser' | 'node';
  isActive: boolean;
  isLast: boolean;
}

function PhaseStep({ phase, runtime, isActive, isLast }: PhaseStepProps) {
  return (
    <>
      <motion.div
        className={cn(
          'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
            : 'bg-muted/50 text-muted-foreground'
        )}
        animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {getPhaseLabel(phase, runtime)}
      </motion.div>
      {!isLast && (
        <div
          className={cn(
            'h-0.5 w-4 rounded-full',
            isActive ? 'bg-primary/50' : 'bg-border'
          )}
        />
      )}
    </>
  );
}
