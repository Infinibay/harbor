import {
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";

export interface HoverCardProps {
  children: ReactElement<HoverCardTriggerProps>;
  content: ReactNode;
  side?: "top" | "bottom";
  delay?: number;
  className?: string;
}

type HoverCardTriggerProps = {
  onMouseEnter?: (event: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
};

type TriggerElement = ReactElement<HoverCardTriggerProps> & {
  ref?: Ref<HTMLElement>;
};

function assignRef(ref: Ref<HTMLElement> | undefined, el: HTMLElement | null) {
  if (typeof ref === "function") ref(el);
  else if (ref) ref.current = el;
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

  const place = useCallback(() => {
    const el = target.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cardW = 280;
    const cardH = 140;
    let x = r.left + r.width / 2 - cardW / 2;
    const y = side === "bottom" ? r.bottom + 10 : r.top - cardH - 10;
    if (x < 8) x = 8;
    if (x + cardW > window.innerWidth - 8) x = window.innerWidth - cardW - 8;
    setPos({ x, y });
  }, [side]);

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
  }, [open, place]);

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }
  function scheduleClose() {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  }

  // eslint-disable-next-line react-hooks/refs
  const child = cloneElement(children, {
    ref: (el: HTMLElement | null) => {
      target.current = el;
      assignRef((children as TriggerElement).ref, el);
    },
    onMouseEnter: (e: MouseEvent<HTMLElement>) => {
      children.props.onMouseEnter?.(e);
      cancelClose();
      timer.current = window.setTimeout(() => setOpen(true), delay);
    },
    onMouseLeave: (e: MouseEvent<HTMLElement>) => {
      children.props.onMouseLeave?.(e);
      if (timer.current) clearTimeout(timer.current);
      scheduleClose();
    },
  } as Partial<HoverCardTriggerProps> & { ref: Ref<HTMLElement> });

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
                "rounded-2xl border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel)] p-4 text-[rgb(var(--harbor-text))] shadow-2xl",
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
