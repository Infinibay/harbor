export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IdRect extends Rect {
  id?: string;
}

export type SnapGuideKind =
  | "edge-left"
  | "edge-right"
  | "edge-top"
  | "edge-bottom"
  | "center-x"
  | "center-y"
  | "grid";

export interface SnapGuide {
  kind: SnapGuideKind;
  axis: "x" | "y";
  /** World-space position of the guide line. */
  position: number;
  /** ID of the reference item, when applicable. */
  refId?: string;
  /** World-space extent of the guide — for edge guides, the min/max of
   *  the moving + reference items' range on the perpendicular axis. */
  from?: number;
  to?: number;
}

export interface SnapOptions {
  /** Snap to a regular grid of this world-unit size. 0 / undefined = off. */
  grid?: number;
  /** Snap to other items' edges and centers. Default true. */
  edges?: boolean;
  /** Snap threshold, in world units. Default 6. */
  threshold?: number;
}

export interface SnapResult {
  /** Correction to add to the moving rect's x. */
  dx: number;
  /** Correction to add to the moving rect's y. */
  dy: number;
  guides: SnapGuide[];
}

interface Candidate {
  /** World position of the line this target can lock onto. */
  pos: number;
  kind: SnapGuideKind;
  refId?: string;
  /** Perpendicular-axis extent hint for the guide. */
  from?: number;
  to?: number;
}

function findBest(
  targets: { pos: number; kind: "start" | "center" | "end" }[],
  candidates: Candidate[],
  threshold: number,
  axis: "x" | "y",
): { delta: number; guide: SnapGuide | null; dist: number } {
  let best: { delta: number; guide: SnapGuide | null; dist: number } = {
    delta: 0,
    guide: null,
    dist: Infinity,
  };
  for (const t of targets) {
    for (const c of candidates) {
      const dist = Math.abs(c.pos - t.pos);
      if (dist > threshold) continue;
      if (dist >= best.dist) continue;
      // "edge-*" candidates only match start/end targets; "center-*"
      // candidates only match center targets. Grid matches anything.
      if (c.kind.startsWith("edge") && t.kind === "center") continue;
      if (c.kind.startsWith("center") && t.kind !== "center") continue;
      best = {
        delta: c.pos - t.pos,
        guide: {
          kind: c.kind,
          axis,
          position: c.pos,
          refId: c.refId,
          from: c.from,
          to: c.to,
        },
        dist,
      };
    }
  }
  return best;
}

function snapOneAxis(
  /** Positions we could align to a candidate (moving.left/center/right). */
  targets: { pos: number; kind: "start" | "center" | "end" }[],
  candidates: Candidate[],
  threshold: number,
  axis: "x" | "y",
): { delta: number; guide: SnapGuide | null } {
  // Edges + centers win priority over the grid — otherwise an 8px grid
  // next to items makes it feel arbitrary which one grabs. Only fall
  // back to the grid when no neighbor-edge is in range.
  const primary = candidates.filter((c) => c.kind !== "grid");
  const edgeBest = findBest(targets, primary, threshold, axis);
  if (edgeBest.guide) return { delta: edgeBest.delta, guide: edgeBest.guide };
  const grid = candidates.filter((c) => c.kind === "grid");
  const gridBest = findBest(targets, grid, threshold, axis);
  return { delta: gridBest.delta, guide: gridBest.guide };
}

/** Compute a snap adjustment for `moving` against a list of `others`,
 *  optionally including a grid. Pure — no side effects, safe to call
 *  on every drag frame. */
export function computeSnap(
  moving: Rect,
  others: readonly IdRect[],
  options?: SnapOptions,
): SnapResult {
  const { grid = 0, edges = true, threshold = 6 } = options ?? {};

  const leftX = moving.x;
  const centerX = moving.x + moving.width / 2;
  const rightX = moving.x + moving.width;
  const topY = moving.y;
  const centerY = moving.y + moving.height / 2;
  const bottomY = moving.y + moving.height;

  const xCandidates: Candidate[] = [];
  const yCandidates: Candidate[] = [];

  if (edges) {
    for (const o of others) {
      const ox1 = o.x;
      const ox2 = o.x + o.width;
      const oxc = o.x + o.width / 2;
      const oy1 = o.y;
      const oy2 = o.y + o.height;
      const oyc = o.y + o.height / 2;
      const xFrom = Math.min(o.y, moving.y);
      const xTo = Math.max(o.y + o.height, moving.y + moving.height);
      const yFrom = Math.min(o.x, moving.x);
      const yTo = Math.max(o.x + o.width, moving.x + moving.width);
      xCandidates.push(
        { pos: ox1, kind: "edge-left", refId: o.id, from: xFrom, to: xTo },
        { pos: ox2, kind: "edge-right", refId: o.id, from: xFrom, to: xTo },
        { pos: oxc, kind: "center-x", refId: o.id, from: xFrom, to: xTo },
      );
      yCandidates.push(
        { pos: oy1, kind: "edge-top", refId: o.id, from: yFrom, to: yTo },
        { pos: oy2, kind: "edge-bottom", refId: o.id, from: yFrom, to: yTo },
        { pos: oyc, kind: "center-y", refId: o.id, from: yFrom, to: yTo },
      );
    }
  }

  if (grid > 0) {
    const snapToGrid = (v: number) => Math.round(v / grid) * grid;
    // Grid candidates for each target reuse the nearest grid line.
    const xs = [leftX, centerX, rightX].map(snapToGrid);
    const ys = [topY, centerY, bottomY].map(snapToGrid);
    for (const pos of xs) xCandidates.push({ pos, kind: "grid" });
    for (const pos of ys) yCandidates.push({ pos, kind: "grid" });
  }

  const xResult = snapOneAxis(
    [
      { pos: leftX, kind: "start" },
      { pos: centerX, kind: "center" },
      { pos: rightX, kind: "end" },
    ],
    xCandidates,
    threshold,
    "x",
  );
  const yResult = snapOneAxis(
    [
      { pos: topY, kind: "start" },
      { pos: centerY, kind: "center" },
      { pos: bottomY, kind: "end" },
    ],
    yCandidates,
    threshold,
    "y",
  );

  const guides: SnapGuide[] = [];
  if (xResult.guide) guides.push(xResult.guide);
  if (yResult.guide) guides.push(yResult.guide);

  return { dx: xResult.delta, dy: yResult.delta, guides };
}

// =====================================================================
// Alignment operators — pure functions over a selection bbox.
// =====================================================================

export type Alignment =
  | "left"
  | "center-x"
  | "right"
  | "top"
  | "center-y"
  | "bottom";

/** Compute post-alignment positions for the given items, relative to
 *  their collective bbox. Returns a mapping `id → { x, y }`. */
export function alignItems(
  items: readonly IdRect[],
  alignment: Alignment,
): Map<string, { x: number; y: number }> {
  const out = new Map<string, { x: number; y: number }>();
  if (items.length === 0) return out;
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const it of items) {
    if (it.x < minX) minX = it.x;
    if (it.y < minY) minY = it.y;
    if (it.x + it.width > maxX) maxX = it.x + it.width;
    if (it.y + it.height > maxY) maxY = it.y + it.height;
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  for (const it of items) {
    if (!it.id) continue;
    let { x, y } = it;
    switch (alignment) {
      case "left":
        x = minX;
        break;
      case "right":
        x = maxX - it.width;
        break;
      case "center-x":
        x = cx - it.width / 2;
        break;
      case "top":
        y = minY;
        break;
      case "bottom":
        y = maxY - it.height;
        break;
      case "center-y":
        y = cy - it.height / 2;
        break;
    }
    out.set(it.id, { x, y });
  }
  return out;
}

/** Distribute items evenly along the given axis so edge-to-edge gaps
 *  are equal. Requires ≥ 3 items (2 are "aligned"). */
export function distributeItems(
  items: readonly IdRect[],
  axis: "x" | "y",
): Map<string, { x: number; y: number }> {
  const out = new Map<string, { x: number; y: number }>();
  if (items.length < 3) return out;
  const sorted = [...items].sort((a, b) => (axis === "x" ? a.x - b.x : a.y - b.y));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const firstStart = axis === "x" ? first.x : first.y;
  const lastEnd =
    axis === "x" ? last.x + last.width : last.y + last.height;
  const totalSize = sorted.reduce(
    (s, it) => s + (axis === "x" ? it.width : it.height),
    0,
  );
  const totalSpan = lastEnd - firstStart;
  const gap = (totalSpan - totalSize) / (sorted.length - 1);
  let cursor = firstStart;
  for (const it of sorted) {
    if (!it.id) continue;
    const pos = { x: it.x, y: it.y };
    if (axis === "x") pos.x = cursor;
    else pos.y = cursor;
    out.set(it.id, pos);
    cursor += (axis === "x" ? it.width : it.height) + gap;
  }
  return out;
}
