import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/cn";

export interface JsonViewerProps {
  data: unknown;
  rootLabel?: string;
  defaultExpanded?: number;
  className?: string;
}

export function JsonViewer({
  data,
  rootLabel = "$",
  defaultExpanded = 2,
  className,
}: JsonViewerProps) {
  return (
    <div
      className={cn(
        "font-mono text-[12.5px] leading-6 p-3 rounded-lg bg-black/40 border border-white/8 overflow-auto",
        className,
      )}
    >
      <Node
        label={rootLabel}
        value={data}
        depth={0}
        defaultExpanded={defaultExpanded}
      />
    </div>
  );
}

function Node({
  label,
  value,
  depth,
  defaultExpanded,
  isLast,
}: {
  label?: string;
  value: unknown;
  depth: number;
  defaultExpanded: number;
  isLast?: boolean;
}) {
  const type = getType(value);
  const [open, setOpen] = useState(depth < defaultExpanded);

  if (type === "object" || type === "array") {
    const entries =
      type === "array"
        ? (value as unknown[]).map((v, i) => [String(i), v] as const)
        : Object.entries(value as object);
    const openChar = type === "array" ? "[" : "{";
    const closeChar = type === "array" ? "]" : "}";
    return (
      <div style={{ paddingLeft: depth === 0 ? 0 : 16 }}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="group inline-flex items-center gap-1.5 hover:bg-white/5 rounded px-1 -mx-1"
        >
          <motion.span
            animate={{ rotate: open ? 0 : -90 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="inline-block text-white/35 text-[10px] leading-none"
          >
            ▼
          </motion.span>
          {label ? (
            <span className="text-sky-300">"{label}"</span>
          ) : null}
          {label ? <span className="text-white/30">:</span> : null}
          <span className="text-white/60">{openChar}</span>
          {!open ? (
            <span className="text-white/30">
              {entries.length} {type === "array" ? "items" : "keys"}
            </span>
          ) : null}
          {!open ? (
            <span className="text-white/60">
              {closeChar}
              {isLast ? "" : ","}
            </span>
          ) : null}
        </button>
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              {entries.map(([k, v], i) => (
                <Node
                  key={k}
                  label={type === "array" ? undefined : k}
                  value={v}
                  depth={depth + 1}
                  defaultExpanded={defaultExpanded}
                  isLast={i === entries.length - 1}
                />
              ))}
              <div style={{ paddingLeft: 16 * (depth === 0 ? 0 : 1) }}>
                <span className="text-white/60">
                  {closeChar}
                  {isLast ? "" : ","}
                </span>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div style={{ paddingLeft: depth === 0 ? 0 : 16 }}>
      {label ? (
        <>
          <span className="text-sky-300">"{label}"</span>
          <span className="text-white/30">: </span>
        </>
      ) : null}
      <Primitive value={value} />
      {isLast ? "" : <span className="text-white/30">,</span>}
    </div>
  );
}

function Primitive({ value }: { value: unknown }) {
  if (value === null)
    return <span className="text-rose-300 italic">null</span>;
  if (typeof value === "string")
    return <span className="text-emerald-300">"{value}"</span>;
  if (typeof value === "number")
    return <span className="text-amber-300">{String(value)}</span>;
  if (typeof value === "boolean")
    return <span className="text-fuchsia-300">{String(value)}</span>;
  return <span className="text-white/70">{String(value)}</span>;
}

function getType(v: unknown): "string" | "number" | "boolean" | "null" | "array" | "object" {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  if (typeof v === "object") return "object";
  if (typeof v === "string") return "string";
  if (typeof v === "number") return "number";
  if (typeof v === "boolean") return "boolean";
  return "object";
}
