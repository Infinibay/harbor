import { useMemo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

type Level = 0 | 1 | 2 | 3 | 4;

interface ScoreResult {
  level: Level;
  label: string;
  tone: "rose" | "amber" | "sky" | "green";
}

const labels: Record<Level, ScoreResult> = {
  0: { level: 0, label: "Empty", tone: "rose" },
  1: { level: 1, label: "Weak", tone: "rose" },
  2: { level: 2, label: "Fair", tone: "amber" },
  3: { level: 3, label: "Strong", tone: "sky" },
  4: { level: 4, label: "Very strong", tone: "green" },
};

const toneBar: Record<ScoreResult["tone"], string> = {
  rose: "bg-rose-400",
  amber: "bg-amber-400",
  sky: "bg-sky-400",
  green: "bg-emerald-400",
};

const toneText: Record<ScoreResult["tone"], string> = {
  rose: "text-rose-300",
  amber: "text-amber-300",
  sky: "text-sky-300",
  green: "text-emerald-300",
};

function scorePassword(pw: string): ScoreResult {
  if (!pw) return labels[0];
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  // Penalise obvious patterns — cap, don't floor to 0
  if (/^(.)\1+$/.test(pw)) score = Math.min(score, 1);
  if (/^(?:123|abc|qwerty|password)/i.test(pw)) score = Math.min(score, 1);
  // Any typed password is at least "Weak" (level 1); perfect score is 4.
  const clamped = Math.min(4, Math.max(1, score)) as Level;
  return labels[clamped];
}

export interface PasswordStrengthProps {
  value: string;
  /** Override the computed label (for custom scoring integrations). */
  labelOverride?: ReactNode;
  /** Hide the textual label to show bars only. */
  showLabel?: boolean;
  className?: string;
}

/** Four-segment strength meter plus a short label. Computes a score
 *  from the password value unless `labelOverride` is passed. */
export function PasswordStrength({
  value,
  labelOverride,
  showLabel = true,
  className,
}: PasswordStrengthProps) {
  const result = useMemo(() => scorePassword(value), [value]);
  return (
    <div
      className={cn("flex items-center gap-2 w-full", className)}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-1 flex-1">
        {[1, 2, 3, 4].map((i) => {
          const filled = result.level >= i;
          return (
            <motion.span
              key={i}
              initial={false}
              animate={{ opacity: filled ? 1 : 0.25, scaleX: filled ? 1 : 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={cn(
                "h-1 flex-1 rounded-full",
                filled ? toneBar[result.tone] : "bg-white/10",
              )}
            />
          );
        })}
      </div>
      {showLabel ? (
        <span
          className={cn(
            "text-xs font-medium w-24 text-right shrink-0",
            toneText[result.tone],
          )}
        >
          {labelOverride ?? result.label}
        </span>
      ) : null}
    </div>
  );
}
