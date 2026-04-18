import { useCallback, useMemo, useRef, useState } from "react";

export interface HistoryEntry<T> {
  state: T;
  label?: string;
  /** Timestamp (ms) when the commit was made. */
  t: number;
}

export interface CanvasHistoryApi<T> {
  readonly state: T;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly stack: readonly HistoryEntry<T>[];
  readonly cursor: number;
  readonly hasPreview: boolean;

  /** Commit a new state.
   *  - Default: push a new history entry; truncates any redo branch.
   *  - `transient: true`: hold a preview state that overlays the stack
   *    without mutating it. Call `commit(final)` (non-transient) when
   *    the action settles to seal it into one new history step. */
  commit(next: T, opts?: { label?: string; transient?: boolean }): void;
  /** Replace the *current* entry in-place without pushing. Good for
   *  coalescing rapid, semantically-identical updates. */
  replace(next: T): void;
  undo(): T | undefined;
  redo(): T | undefined;
  /** Wipe history to a single entry at `state`. */
  reset(state: T): void;
  clear(): void;
}

export interface UseCanvasHistoryOptions {
  /** Max history entries retained. Older ones are dropped. Default 100. */
  limit?: number;
  /** Called whenever the live state changes (after commit / undo / redo). */
  onChange?: (state: unknown) => void;
}

interface Snapshot<T> {
  stack: HistoryEntry<T>[];
  cursor: number;
  /** Transient overlay — takes precedence over `stack[cursor].state`
   *  while set, without touching the stack. Cleared on non-transient
   *  commit, undo, redo or reset. */
  preview: T | null;
}

/** A general-purpose undo/redo stack. Hand it an immutable snapshot of
 *  your canvas state (items, connections, transform, whatever) and get
 *  back live state plus `undo/redo/commit/replace`.
 *
 *  Drag example — the "before drag" state stays on the stack so undo
 *  returns to it:
 *
 *  ```tsx
 *  onDrag(next)     → history.commit(next, { transient: true });
 *  onDragEnd(final) → history.commit(final, { label: "move" });
 *  ``` */
export function useCanvasHistory<T>(
  initial: T,
  options: UseCanvasHistoryOptions = {},
): CanvasHistoryApi<T> {
  const { limit = 100, onChange } = options;
  const [snapshot, setSnapshot] = useState<Snapshot<T>>(() => ({
    stack: [{ state: initial, t: Date.now() }],
    cursor: 0,
    preview: null,
  }));

  const snapRef = useRef(snapshot);
  snapRef.current = snapshot;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const update = useCallback(
    (next: Snapshot<T>) => {
      if (next.stack.length > limit) {
        const drop = next.stack.length - limit;
        next = {
          ...next,
          stack: next.stack.slice(drop),
          cursor: Math.max(0, next.cursor - drop),
        };
      }
      setSnapshot(next);
      onChangeRef.current?.(
        next.preview ?? next.stack[next.cursor]?.state,
      );
    },
    [limit],
  );

  const api = useMemo<CanvasHistoryApi<T>>(() => {
    const commit: CanvasHistoryApi<T>["commit"] = (next, opts) => {
      const cur = snapRef.current;
      if (opts?.transient) {
        update({ ...cur, preview: next });
        return;
      }
      // Non-transient: push a new entry, clear any preview.
      const stack = [
        ...cur.stack.slice(0, cur.cursor + 1),
        { state: next, label: opts?.label, t: Date.now() },
      ];
      update({ stack, cursor: stack.length - 1, preview: null });
    };

    const replace: CanvasHistoryApi<T>["replace"] = (next) => {
      const cur = snapRef.current;
      const stack = cur.stack.slice();
      stack[cur.cursor] = {
        ...stack[cur.cursor],
        state: next,
        t: Date.now(),
      };
      update({ ...cur, stack, preview: null });
    };

    const undo: CanvasHistoryApi<T>["undo"] = () => {
      const cur = snapRef.current;
      // If we have a preview, discarding it IS the undo action.
      if (cur.preview !== null) {
        update({ ...cur, preview: null });
        return cur.stack[cur.cursor]?.state;
      }
      if (cur.cursor <= 0) return undefined;
      const ncursor = cur.cursor - 1;
      update({ stack: cur.stack, cursor: ncursor, preview: null });
      return cur.stack[ncursor]?.state;
    };

    const redo: CanvasHistoryApi<T>["redo"] = () => {
      const cur = snapRef.current;
      if (cur.cursor >= cur.stack.length - 1) return undefined;
      const ncursor = cur.cursor + 1;
      update({ stack: cur.stack, cursor: ncursor, preview: null });
      return cur.stack[ncursor]?.state;
    };

    const reset: CanvasHistoryApi<T>["reset"] = (state) => {
      update({ stack: [{ state, t: Date.now() }], cursor: 0, preview: null });
    };

    const clear: CanvasHistoryApi<T>["clear"] = () =>
      reset(
        snapRef.current.preview ??
          snapRef.current.stack[snapRef.current.cursor].state,
      );

    return {
      get state() {
        const s = snapRef.current;
        return s.preview ?? s.stack[s.cursor].state;
      },
      get canUndo() {
        const s = snapRef.current;
        return s.preview !== null || s.cursor > 0;
      },
      get canRedo() {
        return snapRef.current.cursor < snapRef.current.stack.length - 1;
      },
      get stack() {
        return snapRef.current.stack;
      },
      get cursor() {
        return snapRef.current.cursor;
      },
      get hasPreview() {
        return snapRef.current.preview !== null;
      },
      commit,
      replace,
      undo,
      redo,
      reset,
      clear,
    };
  }, [update]);

  return api;
}
