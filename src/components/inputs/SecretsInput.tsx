import { forwardRef, useEffect, useRef, useState, type InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface SecretsInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Re-mask automatically after N seconds once revealed. Default 0 (off). */
  autoReveal?: number;
  /** Show the copy button. Default true. */
  copyable?: boolean;
  /** Custom masked character. Default '•'. */
  mask?: string;
  /** Called when value is successfully copied. */
  onCopy?: () => void;
  /** Optional label ("API key", "Password"). */
  label?: string;
  /** Optional caption below the input ("Rotate every 30 days"). */
  caption?: string;
}

/** Sensitive-value input with reveal/mask toggle + copy button + inline
 *  warning when revealed. Optional auto-remask timer. */
export const SecretsInput = forwardRef<HTMLInputElement, SecretsInputProps>(
  function SecretsInput(
    {
      autoReveal = 0,
      copyable = true,
      mask = "•",
      onCopy,
      label,
      caption,
      value,
      className,
      ...rest
    },
    ref,
  ) {
    const [revealed, setRevealed] = useState(false);
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<number | null>(null);

    // Auto-remask timer.
    useEffect(() => {
      if (!revealed || !autoReveal) return;
      timerRef.current = window.setTimeout(() => setRevealed(false), autoReveal * 1000);
      return () => {
        if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      };
    }, [revealed, autoReveal]);

    const masked =
      typeof value === "string" ? mask.repeat(Math.max(6, Math.min(32, value.length))) : "";

    async function copy() {
      if (!value || typeof value !== "string") return;
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
        onCopy?.();
      } catch {
        // ignore
      }
    }

    return (
      <div className={cn("w-full flex flex-col gap-1", className)}>
        {label ? (
          <div className="text-xs text-white/70">{label}</div>
        ) : null}
        <div
          className={cn(
            "flex items-center gap-2 rounded-md border bg-white/5 px-2",
            revealed
              ? "border-amber-400/40 bg-amber-500/[0.06]"
              : "border-white/10",
          )}
        >
          <input
            ref={ref}
            {...rest}
            type={revealed ? "text" : "password"}
            value={value}
            className={cn(
              "flex-1 bg-transparent outline-none text-sm text-white py-1.5 tabular-nums font-mono",
              !revealed && "tracking-widest",
            )}
          />
          {!revealed && typeof value === "string" ? (
            <span className="text-white/20 text-xs tabular-nums font-mono" aria-hidden>
              {masked}
            </span>
          ) : null}
          <button
            onClick={() => setRevealed((r) => !r)}
            type="button"
            className="text-white/60 hover:text-white text-xs px-1.5 py-0.5"
            title={revealed ? "Hide" : "Reveal"}
          >
            {revealed ? "Hide" : "Reveal"}
          </button>
          {copyable ? (
            <button
              onClick={copy}
              type="button"
              className="text-white/60 hover:text-white text-xs px-1.5 py-0.5"
              title="Copy"
            >
              {copied ? "✓ copied" : "Copy"}
            </button>
          ) : null}
        </div>
        {revealed ? (
          <div className="text-[11px] text-amber-300 inline-flex items-center gap-1">
            ⚠ Value is visible on screen
            {autoReveal > 0 ? ` · auto-hides in ${autoReveal}s` : ""}
          </div>
        ) : caption ? (
          <div className="text-[11px] text-white/50">{caption}</div>
        ) : null}
      </div>
    );
  },
);
