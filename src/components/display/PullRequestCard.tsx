import { type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Avatar, AvatarStack } from "./Avatar";
import { Timestamp } from "./Timestamp";

export type PRState = "open" | "draft" | "merged" | "closed";
export type PRCheckState = "passing" | "failing" | "pending" | "skipped";
export type ReviewState = "approved" | "changes-requested" | "pending" | "commented";

export interface PRReviewer {
  id: string;
  name: string;
  avatarUrl?: string;
  state: ReviewState;
}

export interface PRCheck {
  id: string;
  name: string;
  state: PRCheckState;
}

export interface PullRequestCardProps {
  title: string;
  number: number;
  state: PRState;
  authorName: string;
  authorAvatarUrl?: string;
  createdAt: Date | string | number;
  fromBranch: string;
  toBranch: string;
  reviewers?: readonly PRReviewer[];
  checks?: readonly PRCheck[];
  /** Additions / deletions summary. */
  diff?: { additions: number; deletions: number; files?: number };
  actions?: ReactNode;
  onClick?: () => void;
  className?: string;
}

const STATE_META: Record<PRState, { label: string; color: string; bg: string; icon: string }> = {
  open: { label: "Open", color: "text-emerald-200", bg: "bg-emerald-500/15", icon: "●" },
  draft: { label: "Draft", color: "text-white/60", bg: "bg-white/8", icon: "◌" },
  merged: { label: "Merged", color: "text-violet-200", bg: "bg-violet-500/20", icon: "⧖" },
  closed: { label: "Closed", color: "text-rose-200", bg: "bg-rose-500/15", icon: "⨯" },
};

const REVIEW_META: Record<ReviewState, { dot: string; title: string }> = {
  approved: { dot: "ring-2 ring-emerald-400", title: "Approved" },
  "changes-requested": { dot: "ring-2 ring-rose-400", title: "Changes requested" },
  commented: { dot: "ring-2 ring-sky-400", title: "Commented" },
  pending: { dot: "ring ring-white/25", title: "Pending" },
};

/** Pull / merge request summary card: state chip, title, branches,
 *  reviewers + checks status, diff stats, actions slot. */
export function PullRequestCard({
  title,
  number,
  state,
  authorName,
  authorAvatarUrl,
  createdAt,
  fromBranch,
  toBranch,
  reviewers,
  checks,
  diff,
  actions,
  onClick,
  className,
}: PullRequestCardProps) {
  const meta = STATE_META[state];
  const checkCounts = {
    passing: 0,
    failing: 0,
    pending: 0,
    skipped: 0,
  } as Record<PRCheckState, number>;
  for (const c of checks ?? []) checkCounts[c.state] += 1;
  void authorAvatarUrl;
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-3",
        onClick && "cursor-pointer hover:bg-white/[0.05]",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[11px] uppercase tracking-widest font-semibold",
            meta.bg,
            meta.color,
          )}
        >
          <span className="text-sm leading-none">{meta.icon}</span>
          {meta.label}
        </span>
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <div className="text-white font-medium">
            {title}
            <span className="text-white/40 font-mono ml-2">#{number}</span>
          </div>
          <div className="text-xs text-white/55 flex items-center gap-2 flex-wrap">
            <Avatar name={authorName} size="sm" />
            <span>{authorName}</span>
            <span className="text-white/30">·</span>
            <Timestamp value={createdAt} />
            <span className="text-white/30">·</span>
            <span className="font-mono text-white/60">
              {fromBranch}
              <span className="text-white/30 mx-1">→</span>
              {toBranch}
            </span>
          </div>
        </div>
        {actions}
      </div>

      <div className="flex items-center gap-3 flex-wrap text-xs">
        {reviewers && reviewers.length > 0 ? (
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-[10px] uppercase tracking-widest">Reviews</span>
            <AvatarStack
              max={6}
              size="sm"
              people={reviewers.map((r) => ({
                name: r.name,
                status: r.state === "approved" ? "online" : r.state === "changes-requested" ? "busy" : undefined,
              }))}
            />
            {/* Review state indicator strip */}
            <span className="flex items-center gap-1">
              {reviewers.map((r) => (
                <span
                  key={r.id}
                  title={`${r.name}: ${REVIEW_META[r.state].title}`}
                  className={cn(
                    "w-2 h-2 rounded-full bg-white/10",
                    REVIEW_META[r.state].dot,
                  )}
                />
              ))}
            </span>
          </div>
        ) : null}
        {checks && checks.length > 0 ? (
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-[10px] uppercase tracking-widest">CI</span>
            <span className="text-emerald-300 tabular-nums font-mono">
              {checkCounts.passing} ✓
            </span>
            {checkCounts.failing > 0 ? (
              <span className="text-rose-300 tabular-nums font-mono">
                {checkCounts.failing} ✗
              </span>
            ) : null}
            {checkCounts.pending > 0 ? (
              <span className="text-amber-300 tabular-nums font-mono">
                {checkCounts.pending} …
              </span>
            ) : null}
          </div>
        ) : null}
        {diff ? (
          <span className="ml-auto inline-flex gap-2 text-[11px] tabular-nums font-mono">
            <span className="text-emerald-300">+{diff.additions}</span>
            <span className="text-rose-300">−{diff.deletions}</span>
            {diff.files !== undefined ? (
              <span className="text-white/40">{diff.files} files</span>
            ) : null}
          </span>
        ) : null}
      </div>
    </div>
  );
}
