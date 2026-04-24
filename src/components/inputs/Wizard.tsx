import { useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { ContentSwap } from "../motion/ContentSwap";

export interface WizardStep {
  id: string;
  label: string;
  description?: string;
  content: ReactNode;
  /** Return false (or a string) to block Next. May be async. */
  validate?: () => true | false | string | Promise<true | false | string>;
}

export interface WizardProps {
  steps: WizardStep[];
  onComplete?: () => void;
  className?: string;
}

export function Wizard({ steps, onComplete, className }: WizardProps) {
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const step = steps[current];
  const isLast = current === steps.length - 1;

  async function next() {
    const r = await step.validate?.();
    if (r === false) {
      setError("Required fields missing");
      return;
    }
    if (typeof r === "string") {
      setError(r);
      return;
    }
    setError(null);
    if (isLast) onComplete?.();
    else setCurrent((c) => c + 1);
  }

  return (
    <div className={cn("w-full rounded-2xl bg-white/[0.02] border border-white/8 overflow-hidden", className)}>
      {/* Step rail */}
      <div className="px-5 py-4 border-b border-white/8">
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex-1 flex items-center gap-2">
              <button
                onClick={() => i < current && setCurrent(i)}
                disabled={i > current}
                className={cn(
                  "flex items-center gap-2 text-left min-w-0",
                  i > current && "opacity-60",
                )}
              >
                <span
                  className={cn(
                    "w-6 h-6 rounded-full grid place-items-center text-[11px] font-mono shrink-0",
                    i < current
                      ? "bg-emerald-500/80 text-white"
                      : i === current
                        ? "bg-fuchsia-500 text-white"
                        : "bg-white/10 text-white/60",
                  )}
                >
                  {i < current ? "✓" : i + 1}
                </span>
                <span
                  className={cn(
                    "text-xs truncate",
                    i === current ? "text-white font-medium" : "text-white/55",
                  )}
                >
                  {s.label}
                </span>
              </button>
              {i < steps.length - 1 ? (
                <span
                  className={cn(
                    "flex-1 h-px",
                    i < current ? "bg-emerald-500/60" : "bg-white/10",
                  )}
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Step body */}
      <div className="p-5 min-h-[220px]">
        <ContentSwap id={step.id} variant="slide-left" duration={200}>
          <div>
            <div className="mb-4">
              <div className="text-base font-semibold text-white">{step.label}</div>
              {step.description ? (
                <div className="text-xs text-white/55 mt-0.5">{step.description}</div>
              ) : null}
            </div>
            {step.content}
          </div>
        </ContentSwap>
        {error ? (
          <div className="mt-3 text-xs text-rose-300">{error}</div>
        ) : null}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/8 flex justify-between bg-white/[0.02]">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="text-sm px-3 py-1.5 rounded-md text-white/70 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <span className="text-xs text-white/45 self-center">
          Step {current + 1} of {steps.length}
        </span>
        <button
          onClick={next}
          className="text-sm px-4 py-1.5 rounded-md bg-fuchsia-500/85 hover:bg-fuchsia-500 text-white"
        >
          {isLast ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}
