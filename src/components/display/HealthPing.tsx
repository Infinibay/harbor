import { cn } from "../../lib/cn";

export type PingTone = "success" | "warn" | "danger" | "info" | "neutral";

export interface HealthPingProps {
  tone?: PingTone;
  /** Dot size in pixels. Default 8. */
  size?: number;
  /** How many pings are "in flight" — more = busier visual. Default 1. */
  rings?: 1 | 2;
  /** Cycle duration in seconds. Default 1.6. */
  speed?: number;
  className?: string;
}

const TONE: Record<PingTone, string> = {
  success: "bg-emerald-400",
  warn: "bg-amber-400",
  danger: "bg-rose-400",
  info: "bg-sky-400",
  neutral: "bg-white/60",
};

/** Pure-visual pulsing dot. Distinct from `StatusDot`:
 *  - StatusDot: semantic ("this VM is online") with a text label.
 *  - HealthPing: decorative ("this thing is alive") — use in lists, beside headers.
 *
 *  Implementation: one dot + one or two expanding+fading rings via pure
 *  CSS animations (no Framer, so it's dirt cheap when rendered 100+ times). */
export function HealthPing({
  tone = "success",
  size = 8,
  rings = 1,
  speed = 1.6,
  className,
}: HealthPingProps) {
  const animStyle = { animationDuration: `${speed}s` } as React.CSSProperties;
  const animStyleDelayed = {
    animationDuration: `${speed}s`,
    animationDelay: `${speed / 2}s`,
  } as React.CSSProperties;
  return (
    <span
      className={cn("relative inline-block shrink-0", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        className={cn(
          "absolute inset-0 rounded-full animate-ping opacity-70",
          TONE[tone],
        )}
        style={animStyle}
      />
      {rings === 2 ? (
        <span
          className={cn(
            "absolute inset-0 rounded-full animate-ping opacity-40",
            TONE[tone],
          )}
          style={animStyleDelayed}
        />
      ) : null}
      <span className={cn("absolute inset-0 rounded-full", TONE[tone])} />
    </span>
  );
}
