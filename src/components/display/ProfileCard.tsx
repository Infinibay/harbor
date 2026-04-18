import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Avatar } from "./Avatar";

export interface ProfileStat {
  label: string;
  value: ReactNode;
}

export interface ProfileCardProps {
  name: string;
  handle?: string;
  role?: ReactNode;
  bio?: ReactNode;
  avatar?: string;
  banner?: string;
  status?: "online" | "away" | "busy" | "offline";
  stats?: ProfileStat[];
  actions?: ReactNode;
  className?: string;
}

export function ProfileCard({
  name,
  handle,
  role,
  bio,
  banner,
  status,
  stats,
  actions,
  className,
}: ProfileCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden",
        className,
      )}
    >
      <div
        className="h-24 relative"
        style={{
          background:
            banner ? `url(${banner}) center/cover` : "linear-gradient(135deg,#a855f7,#38bdf8 60%,#f472b6)",
        }}
      />
      <div className="px-5 pb-5 -mt-10">
        <div className="flex items-end justify-between">
          <div className="rounded-full ring-4 ring-[#0a0a0f]">
            <Avatar name={name} size="xl" status={status} />
          </div>
          {actions ? <div className="flex gap-2">{actions}</div> : null}
        </div>
        <div className="mt-3">
          <div className="text-white font-semibold text-lg tracking-tight">
            {name}
          </div>
          {handle || role ? (
            <div className="text-sm text-white/55 mt-0.5">
              {handle ? <span className="text-fuchsia-300">@{handle}</span> : null}
              {handle && role ? <span className="mx-1.5 text-white/25">·</span> : null}
              {role}
            </div>
          ) : null}
        </div>
        {bio ? (
          <div className="text-sm text-white/70 mt-3 leading-relaxed">{bio}</div>
        ) : null}
        {stats?.length ? (
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-white font-semibold text-base font-mono tabular-nums">
                  {s.value}
                </div>
                <div className="text-[11px] uppercase tracking-wider text-white/40">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
