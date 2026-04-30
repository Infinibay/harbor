import {
  Children,
  createContext,
  isValidElement,
  useContext,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";
import { Avatar } from "../display/Avatar";
import { Tooltip } from "../overlays/Tooltip";

/* ------------------------------------------------------------------ *
 *  Presence — composable.
 *
 *  Recommended composable API:
 *
 *    <Presence max={4} size="sm">
 *      <PresenceUser name="Ana" status="editing" />
 *      <PresenceUser name="Bruno" status="viewing" />
 *      <PresenceUser name="Cinto" status="idle" />
 *      <PresenceUser name="Diego" />
 *    </Presence>
 *
 *  The legacy `users={[…]}` prop still works — it maps to the same
 *  subcomponents internally — so existing call sites don't have to
 *  migrate immediately.
 * ------------------------------------------------------------------ */

export type PresenceStatus = "viewing" | "editing" | "idle";

export interface PresenceProps {
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  children?: ReactNode;
}

type Ctx = { size: "sm" | "md" | "lg" };
const PresenceCtx = createContext<Ctx | null>(null);

function usePresenceCtx(component: string): Ctx {
  const ctx = useContext(PresenceCtx);
  if (!ctx) {
    throw new Error(`<${component}> must be rendered inside <Presence>.`);
  }
  return ctx;
}

export function Presence({
  max = 4,
  size = "sm",
  className,
  children,
}: PresenceProps) {
  const allChildren: ReactElement[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child)) allChildren.push(child);
  });

  const total = allChildren.length;
  const shown = allChildren.slice(0, max);
  const extra = Math.max(0, total - shown.length);

  return (
    <PresenceCtx.Provider value={{ size }}>
      <div className={cn("inline-flex items-center gap-2", className)}>
        <div className="flex -space-x-1.5">
          {shown}
          {extra > 0 ? (
            <span className="w-7 h-7 rounded-full bg-white/10 border border-white/15 text-white/70 text-[11px] font-medium grid place-items-center">
              +{extra}
            </span>
          ) : null}
        </div>
        <span className="text-xs text-white/55">
          {total} {total === 1 ? "person" : "people"}
        </span>
      </div>
    </PresenceCtx.Provider>
  );
}

export interface PresenceUserProps {
  name: string;
  color?: string;
  status?: PresenceStatus;
}

/**
 * Single user pip inside `<Presence>`. Reads size from the parent
 * via context — pass it on `<Presence size>`, not here.
 */
export function PresenceUser({ name, status }: PresenceUserProps) {
  const { size } = usePresenceCtx("PresenceUser");
  return (
    <Tooltip content={`${name}${status ? ` · ${status}` : ""}`}>
      <span className="relative">
        <Avatar
          name={name}
          size={size}
          status={status === "idle" ? "away" : "online"}
        />
        {status === "editing" ? (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-fuchsia-400 ring-2 ring-[#0a0a0f] animate-pulse" />
        ) : null}
      </span>
    </Tooltip>
  );
}

export interface CollabCursorProps {
  x: number;
  y: number;
  name: string;
  color?: string;
}

export function CollabCursor({ x, y, name, color = "#a855f7" }: CollabCursorProps) {
  return (
    <div
      className="pointer-events-none absolute top-0 left-0 z-[1000]"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        transition: "transform 120ms ease-out",
      }}
    >
      <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
        <path
          d="M1 1l14 8-6 2-2 6-6-16z"
          fill={color}
          stroke="#000"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="absolute top-4 left-4 whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-medium text-white"
        style={{ background: color }}
      >
        {name}
      </span>
    </div>
  );
}
