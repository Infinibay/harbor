import { useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/cn";
import { SecretsInput } from "./SecretsInput";

export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
}

export interface KeyValueEditorProps {
  value: readonly KeyValuePair[];
  onChange: (next: KeyValuePair[]) => void;
  /** When a key matches this predicate, render the value cell as a
   *  `SecretsInput`. Default: keys matching `/secret|token|key|password/i`. */
  secret?: (key: string) => boolean;
  /** Key column placeholder. */
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  /** Hide the "add row" button (controlled-only mode). */
  hideAddButton?: boolean;
  /** Slot above the table — title + actions. */
  header?: ReactNode;
  className?: string;
}

const DEFAULT_SECRET_RE = /secret|token|key|password|apikey|api_key/i;

function makeId() {
  return `kv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

/** Inline table of key/value rows with add / remove / drag-reorder.
 *  Reorder uses plain pointer events (no Canvas, no `react-dnd`) —
 *  Framer Motion `layout` smooths the settle animation. */
export function KeyValueEditor({
  value,
  onChange,
  secret,
  keyPlaceholder = "KEY",
  valuePlaceholder = "value",
  hideAddButton,
  header,
  className,
}: KeyValueEditorProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragStartY = useRef(0);
  const isSecret = secret ?? ((k: string) => DEFAULT_SECRET_RE.test(k));

  function update(id: string, patch: Partial<KeyValuePair>) {
    onChange(value.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function remove(id: string) {
    onChange(value.filter((p) => p.id !== id));
  }

  function add() {
    onChange([...value, { id: makeId(), key: "", value: "" }]);
  }

  function onHandleDown(id: string) {
    return (e: React.PointerEvent) => {
      e.preventDefault();
      setDraggingId(id);
      dragStartY.current = e.clientY;
      function onMove(ev: PointerEvent) {
        const rows = document.querySelectorAll<HTMLElement>("[data-kv-row]");
        const draggedIdx = value.findIndex((p) => p.id === id);
        if (draggedIdx < 0) return;
        // Find target row by Y
        let targetIdx = draggedIdx;
        rows.forEach((row, i) => {
          const rect = row.getBoundingClientRect();
          if (ev.clientY > rect.top && ev.clientY < rect.bottom) {
            targetIdx = i;
          }
        });
        if (targetIdx !== draggedIdx) {
          const reordered = [...value];
          const [dragged] = reordered.splice(draggedIdx, 1);
          reordered.splice(targetIdx, 0, dragged);
          onChange(reordered);
        }
      }
      function onUp() {
        setDraggingId(null);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      }
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    };
  }

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      {header}
      <div className="flex flex-col gap-1.5">
        <AnimatePresence initial={false}>
          {value.map((p) => {
            const useSecret = p.key && isSecret(p.key);
            return (
              <motion.div
                key={p.id}
                data-kv-row
                layout
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ type: "spring", stiffness: 520, damping: 40 }}
                className={cn(
                  "flex items-start gap-2",
                  draggingId === p.id && "opacity-60",
                )}
              >
                <button
                  aria-label="Drag to reorder"
                  onPointerDown={onHandleDown(p.id)}
                  className="text-white/30 hover:text-white/70 cursor-grab active:cursor-grabbing w-5 h-9 grid place-items-center text-xs"
                >
                  ⋮⋮
                </button>
                <input
                  value={p.key}
                  onChange={(e) => update(p.id, { key: e.target.value })}
                  placeholder={keyPlaceholder}
                  className="w-44 bg-white/5 border border-white/10 rounded-md px-2 py-1.5 text-sm text-white uppercase tracking-wider outline-none focus:border-fuchsia-400/40 font-mono"
                />
                {useSecret ? (
                  <div className="flex-1">
                    <SecretsInput
                      value={p.value}
                      onChange={(e) => update(p.id, { value: e.target.value })}
                      placeholder={valuePlaceholder}
                    />
                  </div>
                ) : (
                  <input
                    value={p.value}
                    onChange={(e) => update(p.id, { value: e.target.value })}
                    placeholder={valuePlaceholder}
                    className="flex-1 bg-white/5 border border-white/10 rounded-md px-2 py-1.5 text-sm text-white outline-none focus:border-fuchsia-400/40 font-mono"
                  />
                )}
                <button
                  onClick={() => remove(p.id)}
                  className="w-8 h-9 text-white/30 hover:text-rose-300 grid place-items-center"
                  title="Remove"
                >
                  ×
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {value.length === 0 ? (
          <div className="text-xs text-white/40 text-center py-3 border border-dashed border-white/10 rounded-md">
            No pairs yet.
          </div>
        ) : null}
      </div>
      {!hideAddButton ? (
        <button
          onClick={add}
          className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.03] text-xs text-white/70 hover:bg-white/5 hover:text-white"
        >
          + Add pair
        </button>
      ) : null}
    </div>
  );
}
