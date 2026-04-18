import { cn } from "../../lib/cn";
import { Avatar } from "../display/Avatar";
import { Tooltip } from "../overlays/Tooltip";

export interface PresenceUser {
  id: string;
  name: string;
  color?: string;
  status?: "viewing" | "editing" | "idle";
}

export interface PresenceProps {
  users: PresenceUser[];
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Presence({ users, max = 4, size = "sm", className }: PresenceProps) {
  const shown = users.slice(0, max);
  const extra = users.length - shown.length;

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div className="flex -space-x-1.5">
        {shown.map((u) => (
          <Tooltip key={u.id} content={`${u.name}${u.status ? ` · ${u.status}` : ""}`}>
            <span className="relative">
              <Avatar
                name={u.name}
                size={size}
                status={u.status === "idle" ? "away" : "online"}
              />
              {u.status === "editing" ? (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-fuchsia-400 ring-2 ring-[#0a0a0f] animate-pulse" />
              ) : null}
            </span>
          </Tooltip>
        ))}
        {extra > 0 ? (
          <span className="w-7 h-7 rounded-full bg-white/10 border border-white/15 text-white/70 text-[11px] font-medium grid place-items-center">
            +{extra}
          </span>
        ) : null}
      </div>
      <span className="text-xs text-white/55">
        {users.length} {users.length === 1 ? "person" : "people"}
      </span>
    </div>
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
