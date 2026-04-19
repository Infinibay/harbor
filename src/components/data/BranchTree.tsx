import { useMemo, useState } from "react";
import { cn } from "../../lib/cn";
import { Timestamp } from "../display/Timestamp";

export interface BranchCommit {
  sha: string;
  parents: string[];
  /** Branch name this commit "belongs to" (used for color/track assignment). */
  branch?: string;
  message: string;
  at: Date | string | number;
  author?: string;
  /** Commit is a merge commit with ≥ 2 parents. */
  merge?: boolean;
  /** Tag labels attached to the commit. */
  refs?: string[];
}

export interface BranchDef {
  name: string;
  color?: string;
}

export interface BranchTreeProps {
  commits: readonly BranchCommit[];
  branches: readonly BranchDef[];
  /** px between commits on the vertical axis. */
  rowHeight?: number;
  /** px between tracks (branch columns). */
  trackWidth?: number;
  onCommitClick?: (c: BranchCommit) => void;
  /** Optional cap on visible commits (older entries clipped). */
  maxCommits?: number;
  className?: string;
}

const DEFAULT_COLORS = [
  "#a855f7", "#38bdf8", "#f472b6", "#34d399",
  "#fbbf24", "#fb7185", "#818cf8", "#22d3ee",
];

/** Mini git-graph. Commits are ordered newest-first, one row each;
 *  each branch gets its own column track. Merges draw a diagonal from
 *  the secondary parent into the current row. */
export function BranchTree({
  commits,
  branches,
  rowHeight = 32,
  trackWidth = 22,
  onCommitClick,
  maxCommits = 200,
  className,
}: BranchTreeProps) {
  const [hover, setHover] = useState<string | null>(null);

  const branchColor = useMemo(() => {
    const map = new Map<string, string>();
    branches.forEach((b, i) => map.set(b.name, b.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]));
    return map;
  }, [branches]);
  const branchIndex = useMemo(() => {
    const map = new Map<string, number>();
    branches.forEach((b, i) => map.set(b.name, i));
    return map;
  }, [branches]);

  const clipped = commits.slice(0, maxCommits);
  const rowOf = new Map<string, number>();
  clipped.forEach((c, i) => rowOf.set(c.sha, i));

  const width = branches.length * trackWidth + 16;
  const height = clipped.length * rowHeight + 12;

  function trackX(name?: string): number {
    const idx = name ? branchIndex.get(name) ?? 0 : 0;
    return 12 + idx * trackWidth;
  }

  return (
    <div className={cn("w-full flex gap-0 overflow-auto", className)}>
      <svg width={width} height={height} className="shrink-0 block">
        {clipped.map((c, i) => {
          const x = trackX(c.branch);
          const y = rowHeight * i + 16;
          const fill = branchColor.get(c.branch ?? "") ?? "#a855f7";
          // Edges to parents
          return (
            <g key={c.sha}>
              {c.parents.map((p) => {
                const pi = rowOf.get(p);
                if (pi === undefined) return null;
                const parent = clipped[pi];
                const px = trackX(parent.branch);
                const py = rowHeight * pi + 16;
                const color = branchColor.get(parent.branch ?? "") ?? "#666";
                if (px === x) {
                  return (
                    <line
                      key={p}
                      x1={x}
                      y1={y}
                      x2={px}
                      y2={py}
                      stroke={color}
                      strokeWidth={1.5}
                    />
                  );
                }
                // Diagonal merge — curve into the track.
                const midY = (y + py) / 2;
                return (
                  <path
                    key={p}
                    d={`M${x},${y} C${x},${midY} ${px},${midY} ${px},${py}`}
                    stroke={color}
                    strokeWidth={1.5}
                    fill="none"
                  />
                );
              })}
              <circle
                cx={x}
                cy={y}
                r={c.merge ? 5 : 4}
                fill={fill}
                stroke={hover === c.sha ? "white" : "black"}
                strokeWidth={1.5}
                onMouseEnter={() => setHover(c.sha)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onCommitClick?.(c)}
                style={{ cursor: onCommitClick ? "pointer" : undefined }}
              />
            </g>
          );
        })}
      </svg>
      <div className="flex-1 min-w-0 text-xs divide-y divide-white/5 border-l border-white/5">
        {clipped.map((c) => (
          <div
            key={c.sha}
            onMouseEnter={() => setHover(c.sha)}
            onMouseLeave={() => setHover(null)}
            style={{ height: rowHeight }}
            className={cn(
              "flex items-center gap-2 px-3",
              hover === c.sha && "bg-white/[0.03]",
            )}
          >
            <span className="tabular-nums font-mono text-white/40 w-14 shrink-0">
              {c.sha.slice(0, 7)}
            </span>
            <span className="flex-1 truncate text-white/85">{c.message.split("\n")[0]}</span>
            {c.refs?.map((r) => (
              <span
                key={r}
                className="shrink-0 px-1.5 rounded bg-fuchsia-500/15 text-fuchsia-200 border border-fuchsia-400/30 font-mono text-[10px]"
              >
                {r}
              </span>
            ))}
            {c.author ? (
              <span className="text-white/40 shrink-0">{c.author}</span>
            ) : null}
            <Timestamp value={c.at} className="text-white/35 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
