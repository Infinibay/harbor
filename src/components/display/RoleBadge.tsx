import { cn } from "../../lib/cn";

export type Role = "owner" | "admin" | "editor" | "viewer" | "guest" | "custom";

export interface RoleBadgeProps {
  role: Role;
  /** Override the display label. */
  label?: string;
  /** Show a small icon (key/shield/eye/user). */
  icon?: boolean;
  /** Compact = xs. Default md. */
  size?: "xs" | "sm" | "md";
  className?: string;
}

const META: Record<
  Role,
  { label: string; bg: string; color: string; border: string; icon: string }
> = {
  owner: {
    label: "Owner",
    bg: "bg-fuchsia-500/15",
    color: "text-fuchsia-200",
    border: "border-fuchsia-400/30",
    icon: "👑",
  },
  admin: {
    label: "Admin",
    bg: "bg-rose-500/15",
    color: "text-rose-200",
    border: "border-rose-400/30",
    icon: "🛡️",
  },
  editor: {
    label: "Editor",
    bg: "bg-sky-500/15",
    color: "text-sky-200",
    border: "border-sky-400/30",
    icon: "✎",
  },
  viewer: {
    label: "Viewer",
    bg: "bg-white/[0.06]",
    color: "text-white/75",
    border: "border-white/15",
    icon: "👁",
  },
  guest: {
    label: "Guest",
    bg: "bg-white/[0.04]",
    color: "text-white/50",
    border: "border-white/10",
    icon: "·",
  },
  custom: {
    label: "Custom",
    bg: "bg-violet-500/15",
    color: "text-violet-200",
    border: "border-violet-400/30",
    icon: "◆",
  },
};

const SIZE: Record<NonNullable<RoleBadgeProps["size"]>, string> = {
  xs: "text-[9px] px-1 py-0",
  sm: "text-[10px] px-1.5 py-0.5",
  md: "text-xs px-2 py-0.5",
};

/** Pill chip for a user's role. Goes next to usernames everywhere. */
export function RoleBadge({ role, label, icon, size = "md", className }: RoleBadgeProps) {
  const meta = META[role];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border font-semibold uppercase tracking-wider",
        SIZE[size],
        meta.bg,
        meta.color,
        meta.border,
        className,
      )}
    >
      {icon ? <span className="leading-none">{meta.icon}</span> : null}
      <span>{label ?? meta.label}</span>
    </span>
  );
}
