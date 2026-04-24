import type { Path } from "../schema";

/** Convert a dot-path string (`"user.email"`, `"tags.0.name"`) to the
 *  array form schemas emit. Numeric segments become numbers so array
 *  indexing round-trips (`tags.0` → `["tags", 0]`). */
export function stringToPath(s: string): Path {
  if (s === "") return [];
  return s.split(".").map((seg) => {
    if (/^\d+$/.test(seg)) return Number(seg);
    return seg;
  });
}

export function pathToString(p: Path): string {
  return p.map(String).join(".");
}

/** Read a nested value by path. Returns `undefined` when a segment
 *  misses — never throws. */
export function getByPath(obj: unknown, path: Path): unknown {
  let cur: unknown = obj;
  for (const seg of path) {
    if (cur == null) return undefined;
    cur = (cur as Record<string | number, unknown>)[seg as never];
  }
  return cur;
}

/** Immutable path-set. Clones parent objects/arrays along the way so
 *  React sees a new reference at every touched level. */
export function setByPath<T>(obj: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;
  const isIndex = typeof head === "number";

  if (Array.isArray(obj) || isIndex) {
    const src = (Array.isArray(obj) ? obj : []) as unknown[];
    const next = src.slice();
    const idx = head as number;
    next[idx] = setByPath(
      (src[idx] as unknown) ?? (typeof rest[0] === "number" ? [] : {}),
      rest,
      value,
    );
    return next as unknown as T;
  }
  const src = (obj ?? {}) as Record<string, unknown>;
  const next: Record<string, unknown> = { ...src };
  const key = head as string;
  next[key] = setByPath(
    src[key] ?? (typeof rest[0] === "number" ? [] : {}),
    rest,
    value,
  );
  return next as unknown as T;
}
