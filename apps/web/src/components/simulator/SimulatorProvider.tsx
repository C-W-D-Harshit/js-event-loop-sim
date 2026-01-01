import { createContext, useContext, type ReactNode } from 'react';
import { useSimulator } from '@/hooks/useSimulator';

type SimulatorContextType = ReturnType<typeof useSimulator>;

const SimulatorContext = createContext<SimulatorContextType | null>(null);

interface SimulatorProviderProps {
  children: ReactNode;
}

export function SimulatorProvider({ children }: SimulatorProviderProps) {
  const simulator = useSimulator();

  return (
    <SimulatorContext.Provider value={simulator}>
      {children}
    </SimulatorContext.Provider>
  );
}

export function useSimulatorContext() {
  const context = useContext(SimulatorContext);
  if (!context) {
    throw new Error('useSimulatorContext must be used within a SimulatorProvider');
  }
  return context;
}
