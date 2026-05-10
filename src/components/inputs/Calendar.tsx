import { useId, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/cn";

export interface CalendarProps {
  value?: Date;
  onChange?: (d: Date) => void;
  min?: Date;
  max?: Date;
  className?: string;
}

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}
function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function Calendar({
  value,
  onChange,
  min,
  max,
  className,
}: CalendarProps) {
  const today = new Date();
  const [cursor, setCursor] = useState(startOfMonth(value ?? today));
  const [dir, setDir] = useState(0);
  // Per-instance layoutId so two Calendars on the same page don't share
  // the selected-day ring and "hop" from one to the other.
  const selectedLayoutId = `cal-sel-${useId()}`;

  const days = useMemo(() => {
    const first = startOfMonth(cursor);
    const offset = (first.getDay() + 6) % 7; // Monday-first
    const firstCell = new Date(first);
    firstCell.setDate(firstCell.getDate() - offset);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(firstCell);
      d.setDate(firstCell.getDate() + i);
      return d;
    });
  }, [cursor]);

  const monthLabel = cursor.toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className={cn(
        "w-[280px] rounded-[var(--harbor-menu-surface-radius)] border border-[color:var(--harbor-menu-surface-border)] bg-[var(--harbor-menu-surface-bg)] p-[var(--harbor-target-panel-padding)] text-[color:var(--harbor-field-fg)]",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => {
            setDir(-1);
            setCursor((c) => addMonths(c, -1));
          }}
          className="grid h-[calc(var(--harbor-target-control-height)-6px)] w-[calc(var(--harbor-target-control-height)-6px)] place-items-center rounded-[var(--harbor-target-radius)] text-[color:var(--harbor-field-muted-fg)] hover:bg-[var(--harbor-menu-item-hover-bg)] hover:text-white"
        >
          ‹
        </button>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={monthLabel}
            custom={dir}
            initial={{ opacity: 0, y: dir >= 0 ? 8 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dir >= 0 ? -8 : 8 }}
            transition={{ duration: 0.2 }}
            className="text-[length:var(--harbor-target-font-size)] font-medium capitalize text-white"
          >
            {monthLabel}
          </motion.div>
        </AnimatePresence>
        <button
          onClick={() => {
            setDir(1);
            setCursor((c) => addMonths(c, 1));
          }}
          className="grid h-[calc(var(--harbor-target-control-height)-6px)] w-[calc(var(--harbor-target-control-height)-6px)] place-items-center rounded-[var(--harbor-target-radius)] text-[color:var(--harbor-field-muted-fg)] hover:bg-[var(--harbor-menu-item-hover-bg)] hover:text-white"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] uppercase tracking-wider text-white/35 py-1"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((d) => {
          const inMonth = d.getMonth() === cursor.getMonth();
          const isSelected = value && sameDay(d, value);
          const isToday = sameDay(d, today);
          const disabled = (min && d < min) || (max && d > max);
          return (
            <motion.button
              key={d.toISOString()}
              disabled={!!disabled}
              onClick={() => onChange?.(d)}
              whileTap={disabled ? undefined : { scale: 0.88 }}
              className={cn(
                "relative h-[var(--harbor-target-control-height)] rounded-[var(--harbor-target-radius)] text-[length:var(--harbor-target-font-size)] transition-colors",
                inMonth ? "text-white/80" : "text-white/25",
                !disabled && !isSelected && "hover:bg-white/5",
                isSelected && "text-white",
                disabled && "opacity-30 cursor-not-allowed",
              )}
            >
              {isSelected ? (
                <motion.span
                  layoutId={selectedLayoutId}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 28,
                  }}
                  className="absolute inset-1 rounded-md"
                  style={{
                    background: "linear-gradient(135deg,#a855f7,#38bdf8)",
                  }}
                />
              ) : null}
              <span className="relative">{d.getDate()}</span>
              {isToday && !isSelected ? (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-fuchsia-400" />
              ) : null}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
