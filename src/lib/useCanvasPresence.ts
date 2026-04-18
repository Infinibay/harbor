import { useMemo } from "react";

export interface PresenceUser {
  id: string;
  name?: string;
  /** CSS color for the user's cursor / outlines. */
  color: string;
  /** Cursor position in world coordinates. Omit when the user is away. */
  cursor?: { x: number; y: number };
  /** IDs the remote user has selected. Render outlines or badges to
   *  show where someone else is working. */
  selection?: string[];
  /** Free-form extras your UI cares about. */
  meta?: Record<string, unknown>;
}

export interface UseCanvasPresenceOptions {
  users: ReadonlyArray<PresenceUser>;
}

export interface CanvasPresenceApi {
  /** Live array of users (memoized by stable-ish identity). */
  users: ReadonlyArray<PresenceUser>;
  /** Lookup by id. */
  byId(id: string): PresenceUser | undefined;
  /** IDs currently selected by someone *other* than `selfId`. */
  outsiderSelection(selfId?: string): Map<string, PresenceUser>;
}

/** Thin BYO-backend presence wrapper. You pass the latest array of
 *  remote users (from Liveblocks / Yjs / Supabase / whatever), the
 *  hook normalizes + memoizes it and gives you a tiny lookup API.
 *
 *  The actual motion smoothing lives in `CanvasPresenceCursor` so each
 *  cursor owns its own spring — there's no shared loop to fall behind. */
export function useCanvasPresence({ users }: UseCanvasPresenceOptions): CanvasPresenceApi {
  const map = useMemo(() => {
    const m = new Map<string, PresenceUser>();
    for (const u of users) m.set(u.id, u);
    return m;
  }, [users]);

  return useMemo<CanvasPresenceApi>(
    () => ({
      users,
      byId: (id) => map.get(id),
      outsiderSelection(selfId) {
        const out = new Map<string, PresenceUser>();
        for (const u of users) {
          if (!u.selection || u.id === selfId) continue;
          for (const id of u.selection) out.set(id, u);
        }
        return out;
      },
    }),
    [users, map],
  );
}
