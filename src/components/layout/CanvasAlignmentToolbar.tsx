import { type ReactNode } from "react";
import { cn } from "../../lib/cn";
import {
  alignItems,
  distributeItems,
  type Alignment,
  type IdRect,
} from "../../lib/canvas-snap";

export type AlignOp = Alignment | "distribute-x" | "distribute-y";

export interface CanvasAlignmentToolbarProps {
  /** IDs to align. Alignments that need ≥ 3 items (distribute) are
   *  disabled automatically when there aren't enough. */
  ids: ReadonlySet<string> | string[];
  /** All items (must contain `id, x, y, width, height` for the selected ids). */
  items: ReadonlyArray<IdRect>;
  /** Called with a map of `id → { x, y }` — just the positions to update. */
  onChange: (positions: Map<string, { x: number; y: number }>) => void;
  /** Render labels instead of / in addition to icons. */
  showLabels?: boolean;
  className?: string;
}

const OPS: { id: AlignOp; label: string; icon: ReactNode; group: 1 | 2 | 3 }[] = [
  { id: "left", label: "Left", icon: <AlignLeftIcon />, group: 1 },
  { id: "center-x", label: "Center H", icon: <AlignCenterXIcon />, group: 1 },
  { id: "right", label: "Right", icon: <AlignRightIcon />, group: 1 },
  { id: "top", label: "Top", icon: <AlignTopIcon />, group: 2 },
  { id: "center-y", label: "Center V", icon: <AlignCenterYIcon />, group: 2 },
  { id: "bottom", label: "Bottom", icon: <AlignBottomIcon />, group: 2 },
  { id: "distribute-x", label: "Distribute H", icon: <DistributeXIcon />, group: 3 },
  { id: "distribute-y", label: "Distribute V", icon: <DistributeYIcon />, group: 3 },
];

/** Six-way alignment + distribute controls, wired to pure functions in
 *  `canvas-snap.ts`. Hand it `ids` + `items`, get new positions back. */
export function CanvasAlignmentToolbar({
  ids,
  items,
  onChange,
  showLabels,
  className,
}: CanvasAlignmentToolbarProps) {
  const idSet = ids instanceof Set ? ids : new Set(ids);
  const selected = items.filter((it) => it.id && idSet.has(it.id));

  function handle(op: AlignOp) {
    if (selected.length === 0) return;
    if (op === "distribute-x") {
      onChange(distributeItems(selected, "x"));
      return;
    }
    if (op === "distribute-y") {
      onChange(distributeItems(selected, "y"));
      return;
    }
    onChange(alignItems(selected, op));
  }

  const disabled = (op: AlignOp) => {
    if (op === "distribute-x" || op === "distribute-y") return selected.length < 3;
    return selected.length < 2;
  };

  let lastGroup = 0;
  return (
    <div
      className={cn(
        "pointer-events-auto inline-flex items-center gap-0.5 p-1 rounded-xl bg-[#14141c]/85 backdrop-blur-md border border-white/10",
        className,
      )}
    >
      {OPS.map((op, i) => {
        const divider = i > 0 && op.group !== lastGroup;
        lastGroup = op.group;
        return (
          <span key={op.id} className="inline-flex items-center">
            {divider ? <span className="w-px h-5 bg-white/10 mx-1" /> : null}
            <button
              onClick={() => handle(op.id)}
              disabled={disabled(op.id)}
              title={op.label}
              aria-label={op.label}
              className={cn(
                "h-8 px-2 rounded-md grid place-items-center transition-colors text-white/70 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed",
                showLabels ? "flex items-center gap-1.5 text-xs" : "w-8",
              )}
            >
              {op.icon}
              {showLabels ? <span>{op.label}</span> : null}
            </button>
          </span>
        );
      })}
    </div>
  );
}

// =====================================================================
// Inline SVG icons
// =====================================================================

function Stroke({ d, ...rest }: { d: string } & React.SVGProps<SVGPathElement>) {
  return <path d={d} stroke="currentColor" strokeWidth={1.5} fill="none" strokeLinecap="round" {...rest} />;
}
function AlignLeftIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Stroke d="M4 4v16" />
      <rect x="6" y="7" width="10" height="4" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
      <rect x="6" y="13" width="14" height="4" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
    </svg>
  );
}
function AlignCenterXIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Stroke d="M12 4v16" />
      <rect x="7" y="7" width="10" height="4" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
      <rect x="5" y="13" width="14" height="4" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
    </svg>
  );
}
function AlignRightIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Stroke d="M20 4v16" />
      <rect x="8" y="7" width="10" height="4" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
      <rect x="4" y="13" width="14" height="4" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
    </svg>
  );
}
function AlignTopIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Stroke d="M4 4h16" />
      <rect x="7" y="6" width="4" height="10" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
      <rect x="13" y="6" width="4" height="14" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
    </svg>
  );
}
function AlignCenterYIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Stroke d="M4 12h16" />
      <rect x="7" y="7" width="4" height="10" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
      <rect x="13" y="5" width="4" height="14" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
    </svg>
  );
}
function AlignBottomIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Stroke d="M4 20h16" />
      <rect x="7" y="8" width="4" height="10" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
      <rect x="13" y="4" width="4" height="14" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
    </svg>
  );
}
function DistributeXIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="8" width="4" height="8" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
      <rect x="10" y="8" width="4" height="8" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
      <rect x="17" y="8" width="4" height="8" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
      <Stroke d="M7 20h3 M14 20h3" strokeDasharray="2 2" />
    </svg>
  );
}
function DistributeYIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <rect x="8" y="3" width="8" height="4" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
      <rect x="8" y="10" width="8" height="4" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
      <rect x="8" y="17" width="8" height="4" rx="1" stroke="currentColor" strokeWidth={1.5} fill="none" />
      <Stroke d="M20 7v3 M20 14v3" strokeDasharray="2 2" />
    </svg>
  );
}
