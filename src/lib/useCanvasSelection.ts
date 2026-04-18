import { useCallback, useMemo, useRef, useState } from "react";

export interface CanvasSelectionApi {
  /** Current selected IDs. */
  readonly ids: ReadonlySet<string>;
  readonly size: number;
  readonly isEmpty: boolean;
  has(id: string): boolean;

  /** Replace the selection. Accepts any iterable. */
  set(ids: Iterable<string>): void;
  add(id: string): void;
  remove(id: string): void;
  toggle(id: string): void;
  clear(): void;

  /** Pointer handler — wire this to each item's `onMouseDown`. Encapsulates
   *  the canvas-style click semantics:
   *    - plain click: replace selection with `[id]`
   *    - shift-click: toggle `id` (add if absent, remove if present)
   *    - cmd/ctrl-click: toggle `id` (same as shift on canvases)
   *
   *  If the click falls on an already-selected item with no modifiers,
   *  selection is left alone (so drag-to-move works across the group). */
  onPointerDown(id: string, e: { shiftKey: boolean; metaKey: boolean; ctrlKey: boolean }): void;
}

export interface UseCanvasSelectionOptions {
  /** Initial selection for uncontrolled mode. */
  defaultIds?: Iterable<string>;
  /** Controlled selection — when set, the hook is stateless and mirrors
   *  this value. Pair with `onChange`. */
  ids?: ReadonlySet<string> | string[];
  /** Emitted whenever the selection changes (both modes). */
  onChange?: (ids: Set<string>) => void;
}

function toSet(input: Iterable<string> | undefined): Set<string> {
  return new Set(input ?? []);
}

/** Canvas-style multi-select: one source of truth for which items are
 *  selected, with idiomatic pointer handling (plain / shift / cmd).
 *
 *  Compose with `CanvasMarquee`'s `onSelection` to get drag-select, and
 *  with `CanvasSelectionBox` to render the bbox + handles over the
 *  current selection. */
export function useCanvasSelection(
  options: UseCanvasSelectionOptions = {},
): CanvasSelectionApi {
  const { defaultIds, ids: controlled, onChange } = options;
  const isControlled = controlled !== undefined;

  const [internal, setInternal] = useState<Set<string>>(() => toSet(defaultIds));

  // Normalize the live selection source.
  const live: Set<string> = useMemo(() => {
    if (!isControlled) return internal;
    if (controlled instanceof Set) return controlled;
    return new Set(controlled as string[]);
  }, [isControlled, controlled, internal]);

  // Keep a ref so methods can read the latest without re-creating on
  // every render (stable callback identities → cleaner memoization for
  // children).
  const liveRef = useRef(live);
  liveRef.current = live;

  const commit = useCallback(
    (next: Set<string>) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const api = useMemo<CanvasSelectionApi>(() => {
    const set = (ids: Iterable<string>) => commit(new Set(ids));
    const add = (id: string) => {
      const next = new Set(liveRef.current);
      next.add(id);
      commit(next);
    };
    const remove = (id: string) => {
      if (!liveRef.current.has(id)) return;
      const next = new Set(liveRef.current);
      next.delete(id);
      commit(next);
    };
    const toggle = (id: string) => {
      const next = new Set(liveRef.current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      commit(next);
    };
    const clear = () => commit(new Set());

    return {
      get ids() {
        return liveRef.current;
      },
      get size() {
        return liveRef.current.size;
      },
      get isEmpty() {
        return liveRef.current.size === 0;
      },
      has: (id) => liveRef.current.has(id),
      set,
      add,
      remove,
      toggle,
      clear,
      onPointerDown(id, e) {
        const modifier = e.shiftKey || e.metaKey || e.ctrlKey;
        if (modifier) {
          toggle(id);
          return;
        }
        if (liveRef.current.has(id)) return; // keep group drag intact
        set([id]);
      },
    };
  }, [commit]);

  return api;
}
