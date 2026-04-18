import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/cn";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  id: string | number;
  time: string | Date;
  level: LogLevel;
  source?: string;
  message: string;
}

export interface LogViewerProps {
  entries: LogEntry[];
  height?: number;
  className?: string;
  autoScroll?: boolean;
}

const levelColor: Record<LogLevel, string> = {
  debug: "text-white/45",
  info: "text-sky-300",
  warn: "text-amber-300",
  error: "text-rose-300",
};
const levelBg: Record<LogLevel, string> = {
  debug: "bg-white/5",
  info: "bg-sky-500/10",
  warn: "bg-amber-500/10",
  error: "bg-rose-500/10",
};

export function LogViewer({
  entries,
  height = 320,
  className,
  autoScroll = true,
}: LogViewerProps) {
  const [filter, setFilter] = useState<Set<LogLevel>>(
    new Set(["debug", "info", "warn", "error"]),
  );
  const [q, setQ] = useState("");
  const [paused, setPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(
    () =>
      entries.filter((e) => {
        if (!filter.has(e.level)) return false;
        if (q && !`${e.source ?? ""} ${e.message}`.toLowerCase().includes(q.toLowerCase()))
          return false;
        return true;
      }),
    [entries, filter, q],
  );

  useEffect(() => {
    if (!autoScroll || paused) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [filtered, autoScroll, paused]);

  function toggle(l: LogLevel) {
    setFilter((s) => {
      const next = new Set(s);
      if (next.has(l)) next.delete(l);
      else next.add(l);
      return next;
    });
  }

  function fmtTime(t: string | Date) {
    if (typeof t === "string") return t;
    return t.toLocaleTimeString([], { hour12: false });
  }

  const counts = entries.reduce(
    (acc, e) => {
      acc[e.level] = (acc[e.level] ?? 0) + 1;
      return acc;
    },
    {} as Record<LogLevel, number>,
  );

  return (
    <div
      className={cn(
        "rounded-lg bg-[#0a0a10] border border-white/8 flex flex-col overflow-hidden font-mono text-[12px]",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-2 py-1.5 border-b border-white/8">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter…"
          className="flex-1 bg-white/5 border border-white/8 rounded px-2 py-1 text-xs text-white placeholder:text-white/30 outline-none focus:border-fuchsia-400/60"
        />
        {(["debug", "info", "warn", "error"] as LogLevel[]).map((l) => (
          <button
            key={l}
            onClick={() => toggle(l)}
            className={cn(
              "px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider border",
              filter.has(l)
                ? `${levelBg[l]} ${levelColor[l]} border-white/15`
                : "bg-white/[0.02] text-white/30 border-white/5",
            )}
          >
            {l} · {counts[l] ?? 0}
          </button>
        ))}
        <button
          onClick={() => setPaused((p) => !p)}
          className={cn(
            "px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border",
            paused
              ? "bg-amber-500/15 text-amber-200 border-amber-400/30"
              : "bg-white/[0.02] text-white/50 border-white/8 hover:text-white/80",
          )}
        >
          {paused ? "Paused" : "Follow"}
        </button>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto"
        style={{ height }}
      >
        {filtered.length === 0 ? (
          <div className="h-full grid place-items-center text-white/30 text-xs">
            No matching entries
          </div>
        ) : (
          filtered.map((e) => (
            <div
              key={e.id}
              className="flex gap-2 px-2 py-0.5 hover:bg-white/[0.02] border-b border-white/[0.03]"
            >
              <span className="text-white/30 shrink-0 tabular-nums">
                {fmtTime(e.time)}
              </span>
              <span
                className={cn(
                  "w-10 text-[10px] uppercase tracking-wider shrink-0",
                  levelColor[e.level],
                )}
              >
                {e.level}
              </span>
              {e.source ? (
                <span className="text-fuchsia-300/80 shrink-0">{e.source}</span>
              ) : null}
              <span className="text-white/85 break-all">{e.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
