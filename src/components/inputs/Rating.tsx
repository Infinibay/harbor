import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface RatingProps {
  value?: number;
  onChange?: (v: number) => void;
  max?: number;
  size?: number;
  readOnly?: boolean;
  allowHalf?: boolean;
  className?: string;
}

export function Rating({
  value = 0,
  onChange,
  max = 5,
  size = 22,
  readOnly,
  allowHalf,
  className,
}: RatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: max }).map((_, i) => {
        const idx = i + 1;
        const filled = display >= idx;
        const half =
          allowHalf && !filled && display > i && display < idx;
        return (
          <motion.button
            key={i}
            disabled={readOnly}
            whileHover={readOnly ? undefined : { scale: 1.2, y: -2 }}
            whileTap={readOnly ? undefined : { scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            onMouseEnter={() => !readOnly && setHover(idx)}
            onMouseLeave={() => !readOnly && setHover(null)}
            onClick={() => !readOnly && onChange?.(idx)}
            className="relative grid place-items-center"
            style={{ width: size + 2, height: size + 2 }}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              className={cn(
                "transition-colors",
                filled || half
                  ? "text-amber-300"
                  : readOnly
                    ? "text-white/15"
                    : "text-white/25",
              )}
            >
              <defs>
                <linearGradient id={`half-${i}`} x1="0" x2="1">
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
                </linearGradient>
              </defs>
              <path
                d="M12 2l3.1 6.4 6.9 1-5 5 1.2 7L12 18l-6.2 3.3L7 14.4l-5-5 6.9-1Z"
                fill={
                  filled
                    ? "currentColor"
                    : half
                      ? `url(#half-${i})`
                      : "transparent"
                }
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        );
      })}
    </div>
  );
}
