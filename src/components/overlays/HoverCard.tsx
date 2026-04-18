import {
  cloneElement,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";

export interface HoverCardProps {
  children: ReactElement<any>;
  content: ReactNode;
  side?: "top" | "bottom";
  delay?: number;
  className?: string;
}

export function HoverCard({
  children,
  content,
  side = "bottom",
  delay = 300,
  className,
}: HoverCardProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const target = useRef<HTMLElement | null>(null);
  const timer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  function place() {
    const el = target.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cardW = 280;
    const cardH = 140;
    let x = r.left + r.width / 2 - cardW / 2;
    let y = side === "bottom" ? r.bottom + 10 : r.top - cardH - 10;
    if (x < 8) x = 8;
    if (x + cardW > window.innerWidth - 8) x = window.innerWidth - cardW - 8;
    setPos({ x, y });
  }

  useEffect(() => {
    if (!open) return;
    place();
    const on = () => place();
    window.addEventListener("scroll", on, true);
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on, true);
      window.removeEventListener("resize", on);
    };
  }, [open, side]);

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }
  function scheduleClose() {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  }

  const child = cloneElement(children, {
    ref: (el: HTMLElement | null) => {
      target.current = el;
      const ref = (children as any).ref;
      if (typeof ref === "function") ref(el);
      else if (ref) (ref as any).current = el;
    },
    onMouseEnter: (e: any) => {
      children.props.onMouseEnter?.(e);
      cancelClose();
      timer.current = window.setTimeout(() => setOpen(true), delay);
    },
    onMouseLeave: (e: any) => {
      children.props.onMouseLeave?.(e);
      if (timer.current) clearTimeout(timer.current);
      scheduleClose();
    },
  } as any);

  return (
    <>
      {child}
      <Portal>
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: side === "top" ? 6 : -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
              style={{
                position: "fixed",
                left: pos.x,
                top: pos.y,
                width: 280,
                zIndex: Z.HOVER_CARD,
              }}
              className={cn(
                "rounded-2xl bg-[#14141c] border border-white/10 shadow-2xl p-4",
                className,
              )}
            >
              {content}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Portal>
    </>
  );
}
