import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type Tone = "note" | "tip" | "info" | "warning" | "danger";

export interface AsideProps {
  tone?: Tone;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}

const tones: Record<
  Tone,
  { bg: string; border: string; text: string; icon: string; label: string }
> = {
  note: {
    bg: "bg-white/[0.04]",
    border: "border-white/12",
    text: "text-white/60",
    icon: "📝",
    label: "Note",
  },
  tip: {
    bg: "bg-fuchsia-500/10",
    border: "border-fuchsia-400/30",
    text: "text-fuchsia-200",
    icon: "💡",
    label: "Tip",
  },
  info: {
    bg: "bg-sky-500/10",
    border: "border-sky-400/30",
    text: "text-sky-200",
    icon: "ℹ",
    label: "Info",
  },
  warning: {
    bg: "bg-amber-500/10",
    border: "border-amber-400/30",
    text: "text-amber-200",
    icon: "⚠",
    label: "Warning",
  },
  danger: {
    bg: "bg-rose-500/10",
    border: "border-rose-400/30",
    text: "text-rose-200",
    icon: "⛔",
    label: "Danger",
  },
};

/** Inline callout block for prose — think "MDN note" blocks. */
export function Aside({ tone = "note", title, children, className }: AsideProps) {
  const t = tones[tone];
  return (
    <aside
      className={cn(
        "my-6 rounded-xl border-l-[3px] pl-4 pr-4 py-3",
        t.bg,
        t.border.replace("border-", "border-l-"),
        "border border-l-[3px]",
        t.border,
        className,
      )}
    >
      <div className={cn("text-xs uppercase tracking-wider font-medium inline-flex items-center gap-1.5 mb-1", t.text)}>
        <span>{t.icon}</span>
        {title ?? t.label}
      </div>
      <div className="text-sm text-white/80 leading-relaxed">{children}</div>
    </aside>
  );
}
