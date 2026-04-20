/**
 * Versioned on-disk format for a Canvas document. Hand it your
 * application's item/connection shape as generics to keep the round
 * trip fully typed.
 */
export interface CanvasDocument<TItem = unknown, TConnection = unknown> {
  /** Schema version — bump when making breaking changes to the shape
   *  and write a migration in `canvasFromJSON` below. */
  v: 1;
  transform: { x: number; y: number; zoom: number };
  items: TItem[];
  connections?: TConnection[];
  /** Free-form metadata (name, timestamps, feature flags…). */
  meta?: Record<string, unknown>;
}

/** Wrap caller state into a versioned document. Idempotent — passing a
 *  document back round-trips exactly. */
export function canvasToJSON<TItem, TConn>(
  data: Omit<CanvasDocument<TItem, TConn>, "v">,
): CanvasDocument<TItem, TConn> {
  return {
    v: 1,
    transform: data.transform,
    items: data.items,
    connections: data.connections,
    meta: data.meta,
  };
}

export class CanvasDocumentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CanvasDocumentError";
  }
}

/** Parse + validate a JSON object back into a typed `CanvasDocument`.
 *  Throws `CanvasDocumentError` with a descriptive message if the input
 *  doesn't match — the caller can show it to the user. */
export function canvasFromJSON<TItem = unknown, TConn = unknown>(
  input: unknown,
): CanvasDocument<TItem, TConn> {
  if (!input || typeof input !== "object") {
    throw new CanvasDocumentError("document root must be an object");
  }
  const obj = input as Record<string, unknown>;
  const migrated = migrate(obj);
  if (migrated.v !== 1) {
    throw new CanvasDocumentError(`unsupported document version ${String(migrated.v)}`);
  }
  if (!migrated.transform || typeof migrated.transform !== "object") {
    throw new CanvasDocumentError("document is missing `transform`");
  }
  const t = migrated.transform as Record<string, unknown>;
  if (typeof t.x !== "number" || typeof t.y !== "number" || typeof t.zoom !== "number") {
    throw new CanvasDocumentError("transform must have numeric x, y, zoom");
  }
  if (!Array.isArray(migrated.items)) {
    throw new CanvasDocumentError("items must be an array");
  }
  if (migrated.connections !== undefined && !Array.isArray(migrated.connections)) {
    throw new CanvasDocumentError("connections must be an array if present");
  }
  return migrated as unknown as CanvasDocument<TItem, TConn>;
}

/** Hook future versions here — map old shapes to v1. Today this is a
 *  passthrough. */
function migrate(obj: Record<string, unknown>): Record<string, unknown> & { v: number } {
  const v = typeof obj.v === "number" ? obj.v : 1;
  return { ...obj, v };
}

/** Convenience: stringify with sensible formatting. */
export function stringifyCanvas<T, C>(doc: CanvasDocument<T, C>, pretty = false): string {
  return JSON.stringify(doc, null, pretty ? 2 : undefined);
}

/** Convenience: parse + validate in one call. */
export function parseCanvas<T = unknown, C = unknown>(input: string): CanvasDocument<T, C> {
  return canvasFromJSON<T, C>(JSON.parse(input));
}
