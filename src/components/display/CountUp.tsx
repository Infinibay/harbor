import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";

export interface CountUpProps {
  value: number;
  duration?: number;
  format?: (v: number) => string;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function CountUp({
  value,
  duration = 600,
  format = (v) => Math.round(v).toLocaleString(),
  className,
  prefix,
  suffix,
}: CountUpProps) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current ?? 0);
    fromRef.current = display;
    startRef.current = null;

    function step(ts: number) {
      if (startRef.current === null) startRef.current = ts;
      const t = Math.min(1, (ts - startRef.current) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const next = fromRef.current + (value - fromRef.current) * eased;
      setDisplay(next);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return (
    <span className={cn("font-mono tabular-nums", className)}>
      {prefix}
      {format(display)}
      {suffix}
    </span>
  );
}
