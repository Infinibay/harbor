import { useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { useT } from "../../lib/i18n";
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
  const { t } = useT();

  async function next() {
    const r = await step.validate?.();
    if (r === false) {
      setError(t("harbor.wizard.defaultError"));
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
    <div className={cn("w-full rounded-2xl bg-[var(--harbor-surface-panel)] border border-[color:var(--harbor-border-subtle)] overflow-hidden", className)}>
      {/* Step rail */}
      <div className="px-5 py-4 border-b border-[color:var(--harbor-border-subtle)]">
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => i < current && setCurrent(i)}
                disabled={i > current}
                aria-current={i === current ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2 text-start min-w-0",
                  i > current && "opacity-60",
                )}
              >
                <span
                  className={cn(
                    "w-6 h-6 rounded-full grid place-items-center text-[11px] font-mono shrink-0",
                    i < current
                      ? "bg-[rgb(var(--harbor-success))] text-[rgb(var(--harbor-brand-fg))]"
                      : i === current
                        ? "bg-[rgb(var(--harbor-brand))] text-[rgb(var(--harbor-brand-fg))]"
                        : "bg-[var(--harbor-state-hover)] text-[color:var(--harbor-field-muted-fg)]",
                  )}
                >
                  {i < current ? "✓" : i + 1}
                </span>
                <span
                  className={cn(
                    "text-xs truncate",
                    i === current
                      ? "text-[color:var(--harbor-text-primary)] font-medium"
                      : "text-[color:var(--harbor-text-tertiary)]",
                  )}
                >
                  {s.label}
                </span>
              </button>
              {i < steps.length - 1 ? (
                <span
                  className={cn(
                    "flex-1 h-px",
                    i < current
                      ? "bg-[rgb(var(--harbor-success))]"
                      : "bg-[var(--harbor-border-subtle)]",
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
              <div className="text-base font-semibold text-[color:var(--harbor-text-primary)]">{step.label}</div>
              {step.description ? (
                <div className="text-xs text-[color:var(--harbor-text-tertiary)] mt-0.5">{step.description}</div>
              ) : null}
            </div>
            {step.content}
          </div>
        </ContentSwap>
        {error ? (
          <div className="mt-3 text-xs text-[rgb(var(--harbor-danger))]">{error}</div>
        ) : null}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[color:var(--harbor-border-subtle)] flex justify-between bg-[var(--harbor-surface-toolbar)]">
        <button
          type="button"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="text-sm px-3 py-1.5 rounded-md text-[color:var(--harbor-field-muted-fg)] hover:bg-[var(--harbor-state-hover)] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {t("harbor.action.back")}
        </button>
        <span className="text-xs text-[color:var(--harbor-text-tertiary)] self-center">
          {t("harbor.wizard.stepOfN", {
            current: current + 1,
            total: steps.length,
          })}
        </span>
        <button
          type="button"
          onClick={next}
          className="text-sm px-4 py-1.5 rounded-md bg-[rgb(var(--harbor-brand))] hover:bg-[rgb(var(--harbor-accent))] text-[rgb(var(--harbor-brand-fg))]"
        >
          {isLast ? t("harbor.action.finish") : t("harbor.action.next")}
        </button>
      </div>
    </div>
  );
}
