import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface ZoomControlsProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  presets?: number[];
  onFit?: () => void;
  className?: string;
}

export function ZoomControls({
  value,
  onChange,
  min = 10,
  max = 400,
  step = 10,
  presets = [25, 50, 100, 200],
  onFit,
  className,
}: ZoomControlsProps) {
  function clamp(v: number) {
    return Math.max(min, Math.min(max, v));
  }
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg bg-[var(--harbor-surface-toolbar)] border border-[color:var(--harbor-border-subtle)] p-0.5",
        className,
      )}
    >
      <ZBtn onClick={() => onChange(clamp(value - step))} label="Zoom out">
        −
      </ZBtn>
      <div className="relative group">
        <button
          type="button"
          className="min-w-[56px] h-7 px-2 text-xs font-mono text-[color:var(--harbor-field-fg)] hover:bg-[var(--harbor-state-hover)] rounded"
        >
          {Math.round(value)}%
        </button>
        <motion.div
          initial={false}
          className="absolute left-1/2 -translate-x-1/2 top-full mt-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity min-w-[120px] rounded-lg bg-[var(--harbor-menu-surface-bg)] border border-[color:var(--harbor-menu-surface-border)] p-1 shadow-xl z-50"
        >
          {presets.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => onChange(p)}
              className="w-full text-left px-2 py-1 rounded text-xs text-[color:var(--harbor-menu-item-fg)] hover:bg-[var(--harbor-menu-item-hover-bg)] font-mono"
            >
              {p}%
            </button>
          ))}
          {onFit ? (
            <>
              <div className="h-px bg-[var(--harbor-menu-separator)] my-1" />
              <button
                type="button"
                onClick={onFit}
                className="w-full text-left px-2 py-1 rounded text-xs text-[color:var(--harbor-menu-item-fg)] hover:bg-[var(--harbor-menu-item-hover-bg)]"
              >
                Fit to view
              </button>
            </>
          ) : null}
        </motion.div>
      </div>
      <ZBtn onClick={() => onChange(clamp(value + step))} label="Zoom in">
        +
      </ZBtn>
    </div>
  );
}

function ZBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="w-7 h-7 grid place-items-center rounded text-[color:var(--harbor-field-muted-fg)] hover:bg-[var(--harbor-state-hover)] hover:text-[color:var(--harbor-field-fg)] text-sm"
    >
      {children}
    </button>
  );
}
