import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface WindowFrameProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  toolbar?: ReactNode;
  statusBar?: ReactNode;
  /** How traffic-light controls look. */
  chromeStyle?: "macos" | "windows";
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  className?: string;
  bodyClassName?: string;
}

export function WindowFrame({
  title,
  subtitle,
  icon,
  children,
  toolbar,
  statusBar,
  chromeStyle = "macos",
  onClose,
  onMinimize,
  onMaximize,
  className,
  bodyClassName,
}: WindowFrameProps) {
  return (
    <motion.div
      layout
      className={cn(
        "relative flex flex-col rounded-xl overflow-hidden border border-white/10 bg-[#0f0f16] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      <div
        className={cn(
          "group relative flex items-center gap-3 px-3 select-none",
          chromeStyle === "macos" ? "h-8 bg-[#1b1b24]" : "h-9 bg-[#17171f]",
          "border-b border-white/[0.06]",
        )}
      >
        {chromeStyle === "macos" ? (
          <div className="flex items-center gap-[7px]">
            <TrafficLight
              tone="red"
              onClick={onClose}
              glyph={
                <svg viewBox="0 0 10 10" width="5.5" height="5.5">
                  <path
                    d="M2.6 2.6l4.8 4.8M7.4 2.6l-4.8 4.8"
                    stroke="rgba(0,0,0,0.55)"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
            <TrafficLight
              tone="yellow"
              onClick={onMinimize}
              glyph={
                <svg viewBox="0 0 10 10" width="5.5" height="5.5">
                  <path
                    d="M2.2 5h5.6"
                    stroke="rgba(0,0,0,0.55)"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
            <TrafficLight
              tone="green"
              onClick={onMaximize}
              glyph={
                <svg viewBox="0 0 10 10" width="5.5" height="5.5">
                  <path
                    d="M3 3h2.5v2.5M7 7H4.5V4.5"
                    stroke="rgba(0,0,0,0.55)"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              }
            />
          </div>
        ) : null}
        <div className="absolute inset-x-0 flex items-center gap-2 justify-center pointer-events-none">
          {icon ? <span className="text-white/55">{icon}</span> : null}
          {title ? (
            <span className="text-[13px] font-medium text-white/80 tracking-tight truncate max-w-[60%]">
              {title}
            </span>
          ) : null}
          {subtitle ? (
            <span className="text-[11px] text-white/35 truncate">
              {subtitle}
            </span>
          ) : null}
        </div>
        <div className="flex-1" />
        {chromeStyle === "windows" ? (
          <div className="relative flex items-center gap-0.5 -mr-3">
            <WinChromeBtn onClick={onMinimize} label="Minimize">
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path d="M2 5h6" stroke="currentColor" strokeWidth="1" />
              </svg>
            </WinChromeBtn>
            <WinChromeBtn onClick={onMaximize} label="Maximize">
              <svg width="10" height="10" viewBox="0 0 10 10">
                <rect
                  x="2"
                  y="2"
                  width="6"
                  height="6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </WinChromeBtn>
            <WinChromeBtn onClick={onClose} label="Close" danger>
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path
                  d="M2 2l6 6M8 2l-6 6"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </WinChromeBtn>
          </div>
        ) : null}
      </div>
      {toolbar ? (
        <div className="border-b border-white/8 px-2 py-1.5 bg-white/[0.02]">
          {toolbar}
        </div>
      ) : null}
      <div className={cn("flex-1 overflow-auto", bodyClassName)}>
        {children}
      </div>
      {statusBar ? (
        <div className="border-t border-white/8 px-3 py-1 bg-white/[0.02]">
          {statusBar}
        </div>
      ) : null}
    </motion.div>
  );
}

const trafficTones = {
  red: { base: "#ff5f57", rim: "#e0443e", hi: "#ff8f8a" },
  yellow: { base: "#febc2e", rim: "#dea123", hi: "#ffd16e" },
  green: { base: "#28c840", rim: "#1aab2e", hi: "#64e074" },
};

function TrafficLight({
  tone,
  onClick,
  glyph,
}: {
  tone: keyof typeof trafficTones;
  onClick?: () => void;
  glyph?: ReactNode;
}) {
  const c = trafficTones[tone];
  return (
    <button
      onClick={onClick}
      className="relative w-3 h-3 rounded-full grid place-items-center active:brightness-90"
      style={{
        background: `radial-gradient(circle at 35% 30%, ${c.hi} 0%, ${c.base} 55%, ${c.rim} 100%)`,
        boxShadow: `inset 0 0 0 0.5px ${c.rim}, inset 0 -0.5px 0.5px rgba(0,0,0,0.35)`,
      }}
    >
      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-100">
        {glyph}
      </span>
    </button>
  );
}

function WinChromeBtn({
  children,
  onClick,
  label,
  danger,
}: {
  children: ReactNode;
  onClick?: () => void;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "w-8 h-7 grid place-items-center text-white/70",
        danger ? "hover:bg-rose-500/70 hover:text-white" : "hover:bg-white/10",
      )}
    >
      {children}
    </button>
  );
}
