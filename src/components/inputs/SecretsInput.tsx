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
          <div className="text-[length:var(--harbor-target-font-size)] text-[color:var(--harbor-field-muted-fg)]">{label}</div>
        ) : null}
        <div
          className={cn(
            "flex min-h-[var(--harbor-target-input-height)] items-center gap-2 rounded-[var(--harbor-target-radius)] border bg-[var(--harbor-field-bg)] px-[var(--harbor-target-control-padding-x)]",
            revealed
              ? "border-amber-400/40 bg-amber-500/[0.06]"
              : "border-[color:var(--harbor-field-border)]",
          )}
        >
          <input
            ref={ref}
            {...rest}
            type={revealed ? "text" : "password"}
            value={value}
            className={cn(
              "flex-1 bg-transparent py-[var(--harbor-target-control-padding-y)] font-mono text-[length:var(--harbor-target-font-size)] text-[color:var(--harbor-field-fg)] caret-[color:var(--harbor-field-caret)] tabular-nums outline-none placeholder:text-[color:var(--harbor-field-placeholder)]",
              !revealed && "tracking-widest",
            )}
          />
          {!revealed && typeof value === "string" ? (
            <span className="font-mono text-xs tabular-nums text-[color:var(--harbor-field-placeholder)]" aria-hidden>
              {masked}
            </span>
          ) : null}
          <button
            onClick={() => setRevealed((r) => !r)}
            type="button"
            className="rounded-[calc(var(--harbor-target-radius)-2px)] px-1.5 py-0.5 text-xs text-[color:var(--harbor-field-muted-fg)] hover:bg-[var(--harbor-menu-item-hover-bg)] hover:text-[color:var(--harbor-field-fg)]"
            title={revealed ? "Hide" : "Reveal"}
          >
            {revealed ? "Hide" : "Reveal"}
          </button>
          {copyable ? (
            <button
              onClick={copy}
              type="button"
              className="rounded-[calc(var(--harbor-target-radius)-2px)] px-1.5 py-0.5 text-xs text-[color:var(--harbor-field-muted-fg)] hover:bg-[var(--harbor-menu-item-hover-bg)] hover:text-[color:var(--harbor-field-fg)]"
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
          <div className="text-[11px] text-[color:var(--harbor-field-muted-fg)]">{caption}</div>
        ) : null}
      </div>
    );
  },
);
