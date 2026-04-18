import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";

export interface Notification {
  id: string;
  title: string;
  description?: string;
  time: string;
  unread?: boolean;
  icon?: React.ReactNode;
}

export interface NotificationBellProps {
  notifications: Notification[];
  onRead?: (id: string) => void;
  onReadAll?: () => void;
  className?: string;
}

export function NotificationBell({
  notifications,
  onRead,
  onReadAll,
  className,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const unread = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    if (!open) return;
    function place() {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const w = 360;
      let x = r.right - w;
      if (x < 8) x = 8;
      setPos({ x, y: r.bottom + 8 });
    }
    place();
    function click(e: MouseEvent) {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !anchorRef.current?.contains(e.target as Node)
      )
        setOpen(false);
    }
    document.addEventListener("mousedown", click);
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("mousedown", click);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  return (
    <>
      <motion.button
        ref={anchorRef}
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.92 }}
        aria-label="Notifications"
        className={cn(
          "relative w-10 h-10 rounded-xl grid place-items-center text-white/75 hover:bg-white/5 hover:text-white",
          className,
        )}
      >
        <motion.svg
          animate={unread > 0 ? { rotate: [0, -12, 10, -6, 4, 0] } : {}}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </motion.svg>
        {unread > 0 ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold text-white grid place-items-center"
            style={{
              background: "linear-gradient(135deg,#f43f5e,#d946ef)",
            }}
          >
            {unread > 9 ? "9+" : unread}
          </motion.span>
        ) : null}
      </motion.button>

      <Portal>
        <AnimatePresence>
          {open ? (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{
                position: "fixed",
                left: pos.x,
                top: pos.y,
                width: 360,
                zIndex: Z.POPOVER,
              }}
              className="rounded-2xl bg-[#14141c] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                <span className="text-sm font-semibold text-white">
                  Notifications
                </span>
                {unread > 0 && onReadAll ? (
                  <button
                    onClick={onReadAll}
                    className="text-xs text-fuchsia-300 hover:text-fuchsia-200"
                  >
                    Mark all read
                  </button>
                ) : null}
              </div>
              <ul className="max-h-80 overflow-auto">
                <AnimatePresence initial={false}>
                  {notifications.map((n) => (
                    <motion.li
                      key={n.id}
                      layout
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      onClick={() => onRead?.(n.id)}
                      className={cn(
                        "relative px-4 py-3 flex items-start gap-3 cursor-pointer border-b border-white/5 hover:bg-white/[0.03]",
                      )}
                    >
                      {n.unread ? (
                        <span className="absolute left-1.5 top-5 w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
                      ) : null}
                      {n.icon ? (
                        <div className="w-8 h-8 rounded-full bg-white/5 grid place-items-center text-white/70 shrink-0">
                          {n.icon}
                        </div>
                      ) : null}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white font-medium truncate">
                          {n.title}
                        </div>
                        {n.description ? (
                          <div className="text-xs text-white/55 mt-0.5 line-clamp-2">
                            {n.description}
                          </div>
                        ) : null}
                        <div className="text-[10px] text-white/40 mt-1">
                          {n.time}
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
                {notifications.length === 0 ? (
                  <li className="px-4 py-10 text-center text-white/40 text-sm">
                    You're all caught up
                  </li>
                ) : null}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Portal>
    </>
  );
}
