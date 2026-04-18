import { useRef, type ReactNode } from "react";
import { motion, useTransform } from "framer-motion";
import { cn } from "../../lib/cn";
import { useCursorProximity } from "../../lib/cursor";

export interface DockItem {
  id: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
  badge?: ReactNode;
  onClick?: () => void;
}

export interface DockProps {
  items: DockItem[];
  className?: string;
  size?: number;
}

export function Dock({ items, className, size = 44 }: DockProps) {
  return (
    <div
      className={cn(
        "inline-flex items-end gap-1.5 px-2 py-1.5 rounded-2xl glass",
        className,
      )}
    >
      {items.map((it) => (
        <DockIcon key={it.id} item={it} baseSize={size} />
      ))}
    </div>
  );
}

function DockIcon({
  item,
  baseSize,
}: {
  item: DockItem;
  baseSize: number;
}) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const { proximity } = useCursorProximity(ref, 120);
  const scale = useTransform(proximity, (v) => 1 + v * 0.65);
  const y = useTransform(proximity, (v) => -v * 8);
  return (
    <div className="relative flex flex-col items-center">
      <motion.button
        ref={ref}
        onClick={item.onClick}
        style={{ scale, y, width: baseSize, height: baseSize }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "relative grid place-items-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors",
          item.active && "ring-1 ring-fuchsia-400/60",
        )}
        aria-label={item.label}
        title={item.label}
      >
        {item.icon}
        {item.badge ? (
          <span className="absolute -top-1 -right-1">{item.badge}</span>
        ) : null}
      </motion.button>
      {item.active ? (
        <motion.span
          layoutId={`dock-active-${item.id}`}
          className="w-1 h-1 rounded-full bg-fuchsia-400 mt-1"
        />
      ) : (
        <span className="w-1 h-1 mt-1" />
      )}
    </div>
  );
}
