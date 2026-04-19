import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { StatusDot, type Status } from "../display/StatusDot";
import { Terminal } from "./Terminal";

/** Contract any backend must implement to drive VMConsole's content
 *  pane. Meant to be structurally compatible with `xterm.js`'s Terminal
 *  + addon combo — wiring it up is `adapter.mount(divEl)` in one line. */
export interface TerminalAdapter {
  mount(el: HTMLElement): void;
  unmount(): void;
  write(data: string): void;
  onData(cb: (data: string) => void): () => void;
  resize(cols: number, rows: number): void;
  focus?(): void;
}

export interface VMConsoleProps {
  /** VM / host name shown in the title bar. */
  name: string;
  /** Subtitle (IP, region, OS, …). */
  subtitle?: string;
  /** Connection status. Default "online". */
  status?: Status;
  /** Terminal adapter — bring your own xterm.js / ttyd / whatever.
   *  When omitted, the component renders a static placeholder. */
  terminal?: TerminalAdapter;
  /** Current resolution to display ("80×24"). */
  resolution?: string;
  /** Top-right slot for extra actions (power, migrate, snapshot…). */
  actions?: ReactNode;
  onDisconnect?: () => void;
  onConnect?: () => void;
  /** Called when the user clicks the fullscreen button. Harbor just
   *  requests fullscreen on the root element; the parent can override. */
  onFullscreen?: () => void;
  height?: number;
  /** Placeholder content shown when no adapter is wired. */
  placeholder?: ReactNode;
  className?: string;
}

/** Chrome wrapper around a terminal backend. When a `TerminalAdapter`
 *  is provided, the content area becomes the terminal; otherwise
 *  Harbor's static `Terminal` renders as a teaser with a "Connect"
 *  button that calls `onConnect`. */
export function VMConsole({
  name,
  subtitle,
  status = "online",
  terminal,
  resolution,
  actions,
  onDisconnect,
  onConnect,
  onFullscreen,
  height = 420,
  placeholder,
  className,
}: VMConsoleProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [connected, setConnected] = useState(Boolean(terminal));

  useEffect(() => {
    const mount = mountRef.current;
    if (!terminal || !mount) return;
    terminal.mount(mount);
    setConnected(true);
    return () => {
      terminal.unmount();
      setConnected(false);
    };
  }, [terminal]);

  function handleFullscreen() {
    if (onFullscreen) {
      onFullscreen();
      return;
    }
    const el = rootRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen().catch(() => {});
    }
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "rounded-xl border border-white/10 bg-black/80 overflow-hidden flex flex-col",
        className,
      )}
    >
      <div className="flex items-center gap-3 px-3 h-9 border-b border-white/10 bg-white/[0.02]">
        <StatusDot status={connected ? status : "offline"} label={null} size={8} />
        <div className="flex flex-col gap-0 min-w-0">
          <div className="text-xs text-white font-medium truncate">{name}</div>
          {subtitle ? (
            <div className="text-[10px] text-white/50 truncate">{subtitle}</div>
          ) : null}
        </div>
        <span className="flex-1" />
        {resolution ? (
          <span className="text-[10px] text-white/40 tabular-nums font-mono">
            {resolution}
          </span>
        ) : null}
        {actions}
        {connected ? (
          <button
            onClick={() => {
              onDisconnect?.();
              setConnected(false);
            }}
            className="text-[10px] uppercase tracking-widest text-rose-300 hover:text-rose-200 px-1.5"
          >
            Disconnect
          </button>
        ) : onConnect ? (
          <button
            onClick={onConnect}
            className="text-[10px] uppercase tracking-widest text-fuchsia-200 hover:text-white px-1.5"
          >
            Connect
          </button>
        ) : null}
        <button
          onClick={handleFullscreen}
          title="Fullscreen"
          className="text-white/50 hover:text-white px-1"
        >
          ⛶
        </button>
      </div>
      <div style={{ height }} className="relative">
        {terminal ? (
          <div ref={mountRef} className="w-full h-full" />
        ) : (
          <div className="w-full h-full p-3 flex flex-col">
            {placeholder ? (
              placeholder
            ) : (
              <Terminal
                title={name}
                lines={[
                  { id: 1, kind: "info", text: "Terminal not connected." },
                  { id: 2, kind: "info", text: "Pass `terminal={yourAdapter}` to wire a backend." },
                  { id: 3, kind: "cmd", text: "" },
                ]}
                height={height - 14}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
