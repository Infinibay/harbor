import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";

export interface CommandVariant {
  /** Chip label ("macOS", "Linux", "Windows PS"). */
  label: string;
  code: string;
  /** Optional language for syntax hinting (not required). */
  language?: string;
}

export interface CopyCommandProps {
  variants: readonly CommandVariant[];
  /** Persisted preference key (localStorage). Default: auto from first label. */
  storageKey?: string;
  /** Leading `$` prompt rendering. Default true. */
  showPrompt?: boolean;
  className?: string;
}

/** Copy-to-clipboard command snippet with tabbed variants.
 *  Remembers the last-picked tab in localStorage. */
export function CopyCommand({
  variants,
  storageKey,
  showPrompt = true,
  className,
}: CopyCommandProps) {
  const key = storageKey ?? `harbor:copy-command:${variants.map((v) => v.label).join("+")}`;
  const [activeIdx, setActiveIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    if (raw) {
      const idx = variants.findIndex((v) => v.label === raw);
      if (idx >= 0) setActiveIdx(idx);
    }
  }, [key, variants]);

  function select(i: number) {
    setActiveIdx(i);
    try {
      window.localStorage.setItem(key, variants[i].label);
    } catch {
      // ignore
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(variants[activeIdx].code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  if (variants.length === 0) return null;
  const v = variants[activeIdx];

  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-black/60 overflow-hidden",
        className,
      )}
    >
      {variants.length > 1 ? (
        <div className="flex items-center gap-0.5 px-2 pt-1.5 border-b border-white/5">
          {variants.map((vt, i) => (
            <button
              key={vt.label}
              onClick={() => select(i)}
              className={cn(
                "text-[11px] px-2 py-1 rounded-t-md",
                i === activeIdx
                  ? "bg-white/[0.06] text-white"
                  : "text-white/50 hover:text-white/80",
              )}
            >
              {vt.label}
            </button>
          ))}
          <span className="flex-1" />
          <button
            onClick={copy}
            className="text-[11px] text-white/60 hover:text-white px-2 py-1"
          >
            {copied ? "✓ copied" : "Copy"}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-end px-2 pt-1.5">
          <button
            onClick={copy}
            className="text-[11px] text-white/60 hover:text-white px-2 py-1"
          >
            {copied ? "✓ copied" : "Copy"}
          </button>
        </div>
      )}
      <pre className="p-3 text-sm text-white/90 font-mono whitespace-pre-wrap break-all">
        {v.code.split("\n").map((line, i) => (
          <div key={i}>
            {showPrompt && !line.startsWith("#") ? (
              <span className="text-white/30 select-none mr-2">$</span>
            ) : null}
            {line}
          </div>
        ))}
      </pre>
    </div>
  );
}
