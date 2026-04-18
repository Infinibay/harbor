import { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { cn } from "../../lib/cn";
import { useCursorProximity } from "../../lib/cursor";

type Status = "online" | "busy" | "away" | "offline";
type Size = "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  name?: string;
  src?: string;
  status?: Status;
  size?: Size;
  className?: string;
  interactive?: boolean;
}

const sizes: Record<Size, { w: number; font: string; dot: number }> = {
  sm: { w: 28, font: "text-[10px]", dot: 8 },
  md: { w: 36, font: "text-xs", dot: 10 },
  lg: { w: 44, font: "text-sm", dot: 12 },
  xl: { w: 60, font: "text-base", dot: 14 },
};

const statusColor: Record<Status, string> = {
  online: "bg-emerald-400",
  busy: "bg-rose-400",
  away: "bg-amber-400",
  offline: "bg-white/30",
};

function initials(name?: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function colorFor(name?: string) {
  if (!name) return "linear-gradient(135deg,#64748b,#475569)";
  const palettes = [
    "linear-gradient(135deg,#a855f7,#6366f1)",
    "linear-gradient(135deg,#38bdf8,#0ea5e9)",
    "linear-gradient(135deg,#f472b6,#db2777)",
    "linear-gradient(135deg,#34d399,#059669)",
    "linear-gradient(135deg,#fbbf24,#f97316)",
  ];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return palettes[h % palettes.length];
}

export function Avatar({
  name,
  src,
  status,
  size = "md",
  className,
  interactive,
}: AvatarProps) {
  const s = sizes[size];
  const ref = useRef<HTMLSpanElement | null>(null);
  const { nx, ny, localX, localY, proximity } = useCursorProximity(ref, 80);
  const tx = useTransform(nx, (v) => v * 1);
  const ty = useTransform(ny, (v) => v * 1);
  const glowOpacity = useTransform(proximity, (v) => v * 0.45);
  const glowBg = useTransform(
    [localX, localY] as any,
    ([lx, ly]: any) =>
      `radial-gradient(${s.w}px circle at ${lx * 100}% ${ly * 100}%, rgba(255,255,255,0.45), transparent 60%)`,
  );
  return (
    <motion.span
      ref={ref}
      whileHover={interactive ? { y: -3, scale: 1.08 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      style={{
        x: tx,
        y: ty,
        width: s.w,
        height: s.w,
        background: src ? undefined : colorFor(name),
      }}
      className={cn(
        "relative inline-grid place-items-center rounded-full text-white font-semibold select-none border border-white/10 overflow-hidden",
        s.font,
        interactive && "cursor-pointer",
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name ?? ""}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <span className="relative z-[1]">{initials(name)}</span>
      )}
      <motion.span
        aria-hidden
        style={{ opacity: glowOpacity, background: glowBg }}
        className="absolute inset-0 pointer-events-none mix-blend-soft-light rounded-full"
      />
      {status ? (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-2 ring-[#12121a] z-[2]",
            statusColor[status],
          )}
          style={{ width: s.dot, height: s.dot }}
        />
      ) : null}
    </motion.span>
  );
}

export interface AvatarStackProps {
  people: { name: string; src?: string; status?: Status }[];
  size?: Size;
  max?: number;
  className?: string;
}

export function AvatarStack({
  people,
  size = "md",
  max = 4,
  className,
}: AvatarStackProps) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  const s = sizes[size];
  return (
    <div className={cn("flex -space-x-2", className)}>
      {shown.map((p) => (
        <motion.div
          key={p.name}
          whileHover={{ y: -4, zIndex: 10 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="relative"
        >
          <Avatar name={p.name} src={p.src} status={p.status} size={size} />
        </motion.div>
      ))}
      {rest > 0 ? (
        <div
          className="grid place-items-center rounded-full bg-white/10 border border-white/10 text-white/80 font-semibold"
          style={{ width: s.w, height: s.w, fontSize: 10 }}
        >
          +{rest}
        </div>
      ) : null}
    </div>
  );
}
