import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../../lib/cn";
import { formatAbsolute } from "../../lib/format";
import type { LogEntry, LogLevel } from "./LogViewer";

export type { LogEntry, LogLevel } from "./LogViewer";

export interface LogTailerHandle {
  append(entry: LogEntry | LogEntry[]): void;
  clear(): void;
  scrollToBottom(): void;
  readonly following: boolean;
}

export interface LogTailerProps {
  /** Initial entries (or the full controlled array). */
  entries?: readonly LogEntry[];
  /** Max retained entries when pushed imperatively via `ref.append`.
   *  Older entries beyond this are dropped. Default 10,000. */
  bufferSize?: number;
  height?: number;
  /** Levels visible by default. */
  levels?: LogLevel[];
  /** Prefix for search placeholder. Purely cosmetic. */
  searchPlaceholder?: string;
  /** Called when the user flips follow mode. */
  onFollowChange?: (following: boolean) => void;
  className?: string;
}

const LEVEL_COLOR: Record<LogLevel, string> = {
  debug: "text-white/45",
  info: "text-sky-300",
  warn: "text-amber-300",
  error: "text-rose-300",
};
const LEVEL_BG: Record<LogLevel, string> = {
  debug: "bg-white/5",
  info: "bg-sky-500/10",
  warn: "bg-amber-500/10",
  error: "bg-rose-500/10",
};

/** Streaming log viewer. Two usage modes:
 *  1. **Controlled** — pass `entries` as a growing array; component auto-tails.
 *  2. **Imperative** — attach a ref; call `append(entry)` / `clear()` /
 *     `scrollToBottom()` from outside. Best for SSE / WebSocket wiring.
 *
 *  Follow mode: auto-scrolls to the bottom as new entries arrive.
 *  Manual scroll up pauses follow ("Resume" button restores). */
export const LogTailer = forwardRef<LogTailerHandle, LogTailerProps>(
  function LogTailer(
    {
      entries: controlled,
      bufferSize = 10_000,
      height = 360,
      levels = ["debug", "info", "warn", "error"],
      searchPlaceholder = "Search (regex supported)…",
      onFollowChange,
      className,
    },
    ref,
  ) {
    const [internal, setInternal] = useState<LogEntry[]>([]);
    const entries = controlled ?? internal;

    const [levelFilter, setLevelFilter] = useState<Set<LogLevel>>(new Set(levels));
    const [search, setSearch] = useState("");
    const [useRegex, setUseRegex] = useState(false);
    const [following, setFollowing] = useState(true);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    // Compile search as regex when possible; otherwise substring.
    const regex = useMemo(() => {
      if (!search) return null;
      if (!useRegex) return null;
      try {
        return new RegExp(search, "i");
      } catch {
        return null;
      }
    }, [search, useRegex]);

    const visible = useMemo(() => {
      const matches = (e: LogEntry) => {
        if (!levelFilter.has(e.level)) return false;
        if (!search) return true;
        const haystack = `${e.source ?? ""} ${e.message}`;
        if (regex) return regex.test(haystack);
        return haystack.toLowerCase().includes(search.toLowerCase());
      };
      return entries.filter(matches);
    }, [entries, levelFilter, search, regex]);

    useImperativeHandle(
      ref,
      () => ({
        append(entry) {
          const arr = Array.isArray(entry) ? entry : [entry];
          if (controlled) return; // controlled mode: caller handles state
          setInternal((prev) => {
            const next = prev.concat(arr);
            if (next.length > bufferSize) return next.slice(next.length - bufferSize);
            return next;
          });
        },
        clear() {
          if (!controlled) setInternal([]);
        },
        scrollToBottom() {
          const el = scrollRef.current;
          if (!el) return;
          el.scrollTop = el.scrollHeight;
          setFollowing(true);
          onFollowChange?.(true);
        },
        get following() {
          return following;
        },
      }),
      [controlled, bufferSize, following, onFollowChange],
    );

    // Auto-scroll when following.
    useEffect(() => {
      if (!following) return;
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    }, [visible, following]);

    // Pause follow when user scrolls up; resume when they scroll to bottom.
    function onScroll() {
      const el = scrollRef.current;
      if (!el) return;
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
      if (atBottom !== following) {
        setFollowing(atBottom);
        onFollowChange?.(atBottom);
      }
    }

    function toggleLevel(lv: LogLevel) {
      setLevelFilter((prev) => {
        const next = new Set(prev);
        if (next.has(lv)) next.delete(lv);
        else next.add(lv);
        return next;
      });
    }

    return (
      <div
        className={cn(
          "flex flex-col rounded-xl bg-black/60 border border-white/10 overflow-hidden font-mono",
          className,
        )}
      >
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-white/[0.02]">
          {(Object.keys(LEVEL_COLOR) as LogLevel[]).map((lv) => {
            const on = levelFilter.has(lv);
            return (
              <button
                key={lv}
                onClick={() => toggleLevel(lv)}
                className={cn(
                  "text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border transition-colors",
                  on
                    ? `${LEVEL_BG[lv]} ${LEVEL_COLOR[lv]} border-white/15`
                    : "text-white/30 border-white/10 hover:border-white/20",
                )}
              >
                {lv}
              </button>
            );
          })}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="flex-1 bg-transparent border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-fuchsia-400/40"
          />
          <button
            onClick={() => setUseRegex((r) => !r)}
            title="Toggle regex"
            className={cn(
              "text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border transition-colors",
              useRegex
                ? "bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-400/30"
                : "text-white/40 border-white/10 hover:border-white/20",
            )}
          >
            .*
          </button>
          <span className="text-[10px] text-white/40 tabular-nums font-sans">
            {visible.length}/{entries.length}
          </span>
          {!following ? (
            <button
              onClick={() => {
                const el = scrollRef.current;
                if (!el) return;
                el.scrollTop = el.scrollHeight;
                setFollowing(true);
                onFollowChange?.(true);
              }}
              className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-100 font-sans"
            >
              Resume ↓
            </button>
          ) : null}
        </div>
        <div
          ref={scrollRef}
          onScroll={onScroll}
          style={{ height }}
          className="overflow-auto text-xs leading-relaxed px-3 py-2 text-white/80"
        >
          {visible.length === 0 ? (
            <div className="text-white/40 text-xs py-6 text-center font-sans">
              No entries match.
            </div>
          ) : (
            visible.map((e) => {
              const timeStr =
                e.time instanceof Date
                  ? formatAbsolute(e.time, { preset: "time" })
                  : e.time;
              return (
                <div key={e.id} className="flex items-start gap-2 py-0.5">
                  <span className="text-white/35 tabular-nums shrink-0">{timeStr}</span>
                  <span
                    className={cn(
                      "shrink-0 w-12 uppercase text-[10px] tracking-wider font-semibold",
                      LEVEL_COLOR[e.level],
                    )}
                  >
                    {e.level}
                  </span>
                  {e.source ? (
                    <span className="text-white/45 shrink-0 w-32 truncate">
                      {e.source}
                    </span>
                  ) : null}
                  <span className="whitespace-pre-wrap break-words flex-1">
                    {e.message}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  },
);
