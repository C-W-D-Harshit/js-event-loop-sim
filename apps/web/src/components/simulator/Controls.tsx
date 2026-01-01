import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSimulatorContext } from "./SimulatorProvider";

const SPEED_OPTIONS = [0.5, 1, 2, 4] as const;

function IconButton({
  label,
  children,
  ...buttonProps
}: React.ComponentProps<typeof Button> & {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={(triggerProps) => (
        <Button {...triggerProps} {...buttonProps} aria-label={label}>
          {children}
        </Button>
      )} />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function Controls() {
  const {
    state,
    currentScenario,
    isPlaying,
    canStepForward,
    canStepBackward,
    stepForward,
    stepBackward,
    play,
    pause,
    reset,
    setSpeed,
  } = useSimulatorContext();

  const currentSpeedIndex = SPEED_OPTIONS.indexOf(
    state.playbackSpeed as (typeof SPEED_OPTIONS)[number]
  );

  const cycleSpeed = () => {
    const nextIndex = (currentSpeedIndex + 1) % SPEED_OPTIONS.length;
    setSpeed(SPEED_OPTIONS[nextIndex]);
  };

  return (
    <div className="flex items-center gap-1">
      <IconButton variant="outline" size="icon-sm" onClick={reset} label="Reset">
        <RotateCcw className="size-4" />
      </IconButton>

      <IconButton
        variant="outline"
        size="icon-sm"
        onClick={stepBackward}
        disabled={!canStepBackward}
        label="Step Back"
      >
        <SkipBack className="size-4" />
      </IconButton>

      {isPlaying ? (
        <IconButton variant="default" size="icon" onClick={pause} label="Pause">
          <Pause className="size-5" />
        </IconButton>
      ) : (
        <IconButton
          variant="default"
          size="icon"
          onClick={play}
          disabled={!canStepForward}
          label="Play"
        >
          <Play className="size-5" />
        </IconButton>
      )}

      <IconButton
        variant="outline"
        size="icon-sm"
        onClick={stepForward}
        disabled={!canStepForward}
        label="Step Forward"
      >
        <SkipForward className="size-4" />
      </IconButton>

      <Tooltip>
        <TooltipTrigger
          render={(triggerProps) => (
            <Button
              {...triggerProps}
              variant="ghost"
              size="sm"
              onClick={cycleSpeed}
              className="min-w-[3.5rem] font-mono text-xs"
            >
              <Gauge className="mr-1 size-3" />
              {state.playbackSpeed}x
            </Button>
          )}
        />
        <TooltipContent>Playback speed</TooltipContent>
      </Tooltip>

      <span className="ml-1 text-xs text-muted-foreground font-mono">
        {state.currentStep}
        {currentScenario && `/${currentScenario.steps.length}`}
      </span>
    </div>
  );
}
