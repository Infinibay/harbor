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
        "overflow-hidden rounded-xl border border-white/10 bg-surface-1/95 text-fg shadow-harbor-sm",
        className,
      )}
    >
      {variants.length > 1 ? (
        <div className="flex items-center gap-0.5 border-b border-white/5 px-2 pt-1.5">
          {variants.map((vt, i) => (
            <button
              key={vt.label}
              onClick={() => select(i)}
              className={cn(
                "text-[11px] px-2 py-1 rounded-t-md",
                i === activeIdx
                  ? "bg-white/[0.06] text-fg"
                  : "text-fg-muted hover:text-fg",
              )}
            >
              {vt.label}
            </button>
          ))}
          <span className="flex-1" />
          <button
            onClick={copy}
            className="px-2 py-1 text-[11px] text-fg-muted hover:text-fg"
          >
            {copied ? "✓ copied" : "Copy"}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-end px-2 pt-1.5">
          <button
            onClick={copy}
            className="px-2 py-1 text-[11px] text-fg-muted hover:text-fg"
          >
            {copied ? "✓ copied" : "Copy"}
          </button>
        </div>
      )}
      <pre className="whitespace-pre-wrap break-all p-3 font-mono text-sm text-fg">
        {v.code.split("\n").map((line, i) => (
          <div key={i}>
            {showPrompt && !line.startsWith("#") ? (
              <span data-slot="prompt" className="mr-2 select-none text-fg-subtle">$</span>
            ) : null}
            {line}
          </div>
        ))}
      </pre>
    </div>
  );
}
