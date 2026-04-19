import { useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Timestamp } from "./Timestamp";

export type KeyKind = "api" | "ssh" | "bearer";

export interface KeyCardProps {
  kind?: KeyKind;
  /** Human-readable label. */
  label: string;
  /** Key identifier or fingerprint — shown fully (not masked, non-secret). */
  fingerprint: string;
  /** Comma-separated scopes ("read:events, write:deploys"). */
  scope?: string;
  /** Last-seen timestamp. */
  lastUsed?: Date | string | number;
  createdAt?: Date | string | number;
  /** When true, renders the "privileged key" warning strip. */
  privileged?: boolean;
  /** Callbacks — if omitted, the corresponding button is hidden. */
  onReveal?: () => void;
  onCopy?: () => void;
  onRotate?: () => void;
  onRevoke?: () => void;
  extra?: ReactNode;
  className?: string;
}

function KeyCard({
  kind = "api",
  label,
  fingerprint,
  scope,
  lastUsed,
  createdAt,
  privileged,
  onReveal,
  onCopy,
  onRotate,
  onRevoke,
  extra,
  className,
}: KeyCardProps) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard?.writeText(fingerprint).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
    onCopy?.();
  }

  const icon = kind === "ssh" ? "🔑" : kind === "bearer" ? "🎟" : "🔐";

  return (
    <div
      className={cn(
        "rounded-xl border bg-white/[0.03] p-4 flex flex-col gap-3",
        privileged ? "border-rose-400/30" : "border-white/10",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-black/40 border border-white/10 grid place-items-center text-lg">
          {icon}
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <div className="flex items-baseline gap-2">
            <span className="text-white font-semibold">{label}</span>
            {privileged ? (
              <span className="text-[10px] uppercase tracking-widest text-rose-200 bg-rose-500/20 border border-rose-400/30 rounded px-1.5 py-0.5 font-semibold">
                privileged
              </span>
            ) : null}
          </div>
          <code className="text-[11px] text-white/55 font-mono tabular-nums truncate">
            {fingerprint}
          </code>
          {scope ? (
            <div className="text-[11px] text-white/60 mt-1">
              <span className="uppercase tracking-widest text-[10px] text-white/40 mr-1">
                Scope
              </span>
              {scope}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-white/50 flex-wrap">
        {createdAt ? (
          <span>
            <span className="text-white/35 mr-1">Created</span>
            <Timestamp value={createdAt} noTooltip />
          </span>
        ) : null}
        {lastUsed ? (
          <span>
            <span className="text-white/35 mr-1">Last used</span>
            <Timestamp value={lastUsed} />
          </span>
        ) : null}
      </div>
      {extra ? <div>{extra}</div> : null}
      <div className="flex items-center gap-2 pt-2 border-t border-white/8">
        {onReveal ? (
          <button onClick={onReveal} className="text-xs text-white/70 hover:text-white px-2 py-1">
            Reveal
          </button>
        ) : null}
        <button onClick={copy} className="text-xs text-white/70 hover:text-white px-2 py-1">
          {copied ? "✓ copied" : "Copy"}
        </button>
        <span className="flex-1" />
        {onRotate ? (
          <button onClick={onRotate} className="text-xs text-sky-200 hover:text-white px-2 py-1">
            Rotate
          </button>
        ) : null}
        {onRevoke ? (
          <button onClick={onRevoke} className="text-xs text-rose-300 hover:text-rose-200 px-2 py-1">
            Revoke
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function APIKeyCard(props: Omit<KeyCardProps, "kind">) {
  return <KeyCard {...props} kind="api" />;
}

export function SSHKeyCard(props: Omit<KeyCardProps, "kind">) {
  return <KeyCard {...props} kind="ssh" />;
}
