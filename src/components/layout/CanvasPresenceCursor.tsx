import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useCanvas } from "./Canvas";
import type { PresenceUser } from "../../lib/useCanvasPresence";

export interface CanvasPresenceCursorProps {
  user: PresenceUser;
  /** Spring stiffness for smoothing (the feel you want from remote
   *  cursors is slightly laggy but silky). */
  stiffness?: number;
  damping?: number;
  /** Show the name label next to the cursor. Default true. */
  showLabel?: boolean;
  /** When the user is marked away (no cursor), fade the whole thing out. */
  awayOpacity?: number;
}

/** Renders one remote user's cursor at their world-space position,
 *  smoothed via a per-cursor spring. The cursor *glyph* stays pixel-
 *  accurate regardless of zoom (inverse-scaled through the Canvas
 *  context), while the position follows world coordinates.
 *
 *  ```tsx
 *  {presence.users.map((u) => (
 *    <CanvasPresenceCursor key={u.id} user={u} />
 *  ))}
 *  ``` */
export function CanvasPresenceCursor({
  user,
  stiffness = 260,
  damping = 28,
  showLabel = true,
  awayOpacity = 0.35,
}: CanvasPresenceCursorProps) {
  const ctx = useCanvas();
  const fallbackZoom = useMotionValue(1);
  const zoom = ctx?.zoom ?? fallbackZoom;
  const inverse = useTransform(zoom, (z) => 1 / z);

  const x = useMotionValue(user.cursor?.x ?? 0);
  const y = useMotionValue(user.cursor?.y ?? 0);
  const opacity = useMotionValue(user.cursor ? 1 : awayOpacity);

  useEffect(() => {
    const controls: { stop(): void }[] = [];
    if (user.cursor) {
      controls.push(
        animate(x, user.cursor.x, { type: "spring", stiffness, damping }),
      );
      controls.push(
        animate(y, user.cursor.y, { type: "spring", stiffness, damping }),
      );
      controls.push(animate(opacity, 1, { duration: 0.2 }));
    } else {
      controls.push(animate(opacity, awayOpacity, { duration: 0.3 }));
    }
    return () => controls.forEach((c) => c.stop());
  }, [user.cursor?.x, user.cursor?.y, stiffness, damping, x, y, opacity, awayOpacity, user.cursor]);

  return (
    <motion.div
      data-canvas-bounds=""
      data-canvas-id={`presence:${user.id}`}
      data-canvas-x={user.cursor?.x ?? 0}
      data-canvas-y={user.cursor?.y ?? 0}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        x,
        y,
        opacity,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <motion.div
        style={{
          scale: inverse,
          transformOrigin: "0 0",
          color: user.color,
        }}
        className="flex items-start gap-1.5"
      >
        <svg width={18} height={18} viewBox="0 0 24 24" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>
          <path
            d="M4 3 L4 18 L9 13 L12 20 L14 19 L11 12 L18 12 Z"
            fill="currentColor"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth={0.8}
          />
        </svg>
        {showLabel && user.name ? (
          <span
            className="mt-3 px-1.5 py-0.5 text-[10px] font-semibold rounded-md text-white whitespace-nowrap shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
            style={{ background: user.color }}
          >
            {user.name}
          </span>
        ) : null}
      </motion.div>
    </motion.div>
  );
}
