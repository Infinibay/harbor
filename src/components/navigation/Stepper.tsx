import { Fragment } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface Step {
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  current: number;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Stepper({
  steps,
  current,
  orientation = "horizontal",
  className,
}: StepperProps) {
  if (orientation === "vertical")
    return (
      <ol className={cn("relative flex flex-col gap-6", className)}>
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={i} className="flex items-start gap-4 relative">
              {i < steps.length - 1 ? (
                <span
                  className={cn(
                    "absolute left-[15px] top-8 bottom-[-24px] w-px",
                    done ? "bg-fuchsia-400/60" : "bg-white/10",
                  )}
                />
              ) : null}
              <StepDot active={active} done={done} index={i} />
              <div className="flex-1 pt-0.5">
                <div
                  className={cn(
                    "font-medium text-sm",
                    active || done ? "text-white" : "text-white/50",
                  )}
                >
                  {s.label}
                </div>
                {s.description ? (
                  <div className="text-xs text-white/50 mt-0.5">
                    {s.description}
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    );

  return (
    <ol className={cn("flex items-center gap-3", className)}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <Fragment key={i}>
            <li className="flex items-center gap-2">
              <StepDot active={active} done={done} index={i} />
              <span
                className={cn(
                  "text-sm font-medium hidden md:inline",
                  active || done ? "text-white" : "text-white/50",
                )}
              >
                {s.label}
              </span>
            </li>
            {i < steps.length - 1 ? (
              <motion.span
                className="flex-1 h-px bg-white/10 relative overflow-hidden"
                initial={false}
              >
                <motion.span
                  className="absolute inset-0 origin-left"
                  style={{
                    background: "linear-gradient(90deg,#a855f7,#38bdf8)",
                  }}
                  animate={{ scaleX: done ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 30 }}
                />
              </motion.span>
            ) : null}
          </Fragment>
        );
      })}
    </ol>
  );
}

function StepDot({
  active,
  done,
  index,
}: {
  active: boolean;
  done: boolean;
  index: number;
}) {
  return (
    <motion.span
      layout
      animate={{
        background: done
          ? "linear-gradient(135deg,#a855f7,#38bdf8)"
          : active
            ? "rgba(168, 85, 247, 0.2)"
            : "rgba(255,255,255,0.05)",
        borderColor: done
          ? "transparent"
          : active
            ? "rgba(168, 85, 247, 0.8)"
            : "rgba(255,255,255,0.12)",
        scale: active ? 1.08 : 1,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative w-8 h-8 rounded-full border grid place-items-center text-xs font-semibold text-white flex-shrink-0"
    >
      {done ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12 L10 17 L19 7"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        index + 1
      )}
      {active ? (
        <motion.span
          animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 rounded-full"
          style={{ background: "rgba(168, 85, 247, 0.3)" }}
        />
      ) : null}
    </motion.span>
  );
}
