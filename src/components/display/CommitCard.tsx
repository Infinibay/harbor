import { type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Avatar } from "./Avatar";
import { Timestamp } from "./Timestamp";

export interface CommitStats {
  additions?: number;
  deletions?: number;
  files?: number;
}

export interface CommitCardProps {
  sha: string;
  /** Short SHA override. Default: first 7 chars of `sha`. */
  shortSha?: string;
  authorName: string;
  authorEmail?: string;
  avatarUrl?: string;
  /** Git commit message — first line is title, rest is body. */
  message: string;
  at: Date | string | number;
  stats?: CommitStats;
  /** Branch / tag chip rendered on the right. */
  refs?: string[];
  onClick?: () => void;
  /** Right-click menu slot (use ContextMenu + MenuItems). */
  contextMenu?: ReactNode;
  className?: string;
}

/** Git commit tile. Hover reveals stats; click opens it.
 *  `contextMenu` slot accepts a ReactNode rendered by the caller on
 *  right-click (bring your own ContextMenu). */
export function CommitCard({
  sha,
  shortSha,
  authorName,
  authorEmail,
  avatarUrl,
  message,
  at,
  stats,
  refs,
  onClick,
  contextMenu,
  className,
}: CommitCardProps) {
  const lines = message.split("\n");
  const title = lines[0];
  const body = lines.slice(1).join("\n").trim();
  const short = shortSha ?? sha.slice(0, 7);
  void avatarUrl; void authorEmail;
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "group rounded-xl border border-white/10 bg-white/[0.03] p-3 flex gap-3 transition-colors",
        onClick && "cursor-pointer hover:bg-white/[0.05] hover:border-white/15",
        className,
      )}
    >
      <Avatar name={authorName} size="sm" />
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-sm text-white truncate">{title}</span>
          <span className="text-[10px] tabular-nums font-mono text-white/40">
            {short}
          </span>
          {refs?.map((r) => (
            <span
              key={r}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-fuchsia-500/15 text-fuchsia-200 border border-fuchsia-400/30"
            >
              {r}
            </span>
          ))}
        </div>
        {body ? (
          <p className="text-xs text-white/55 line-clamp-2 mt-0.5">{body}</p>
        ) : null}
        <div className="flex items-center gap-3 text-xs text-white/50 mt-1">
          <span>{authorName}</span>
          <Timestamp value={at} />
          {stats ? (
            <span className="inline-flex items-center gap-2 tabular-nums font-mono">
              {stats.additions !== undefined ? (
                <span className="text-emerald-300">+{stats.additions}</span>
              ) : null}
              {stats.deletions !== undefined ? (
                <span className="text-rose-300">−{stats.deletions}</span>
              ) : null}
              {stats.files !== undefined ? (
                <span className="text-white/40">{stats.files} files</span>
              ) : null}
            </span>
          ) : null}
        </div>
      </div>
      {contextMenu}
    </div>
  );
}
