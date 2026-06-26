import {
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";
import { useZIndex } from "../../lib/layer";

type Side = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: ReactNode;
  side?: Side;
  delay?: number;
  children: ReactElement<TooltipTriggerProps>;
}

type TooltipTriggerProps = {
  onMouseEnter?: (event: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
};

type TriggerElement = ReactElement<TooltipTriggerProps> & {
  ref?: Ref<HTMLElement>;
};

function assignRef(ref: Ref<HTMLElement> | undefined, el: HTMLElement | null) {
  if (typeof ref === "function") ref(el);
  else if (ref) ref.current = el;
}

export function Tooltip({
  content,
  side = "top",
  delay = 250,
  children,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const timer = useRef<number | null>(null);
  const target = useRef<HTMLElement | null>(null);
  const tooltipZ = useZIndex(Z.TOOLTIP);

  const place = useCallback(() => {
    const el = target.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const offset = 10;
    if (side === "top") setPos({ x: cx, y: r.top - offset });
    else if (side === "bottom") setPos({ x: cx, y: r.bottom + offset });
    else if (side === "left") setPos({ x: r.left - offset, y: cy });
    else setPos({ x: r.right + offset, y: cy });
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

  // eslint-disable-next-line react-hooks/refs
  const child = cloneElement(children, {
    ref: (el: HTMLElement | null) => {
      target.current = el;
      assignRef((children as TriggerElement).ref, el);
    },
    onMouseEnter: (e: MouseEvent<HTMLElement>) => {
      children.props.onMouseEnter?.(e);
      timer.current = window.setTimeout(() => setOpen(true), delay);
    },
    onMouseLeave: (e: MouseEvent<HTMLElement>) => {
      children.props.onMouseLeave?.(e);
      if (timer.current) clearTimeout(timer.current);
      setOpen(false);
    },
    onFocus: (e: FocusEvent<HTMLElement>) => {
      children.props.onFocus?.(e);
      setOpen(true);
    },
    onBlur: (e: FocusEvent<HTMLElement>) => {
      children.props.onBlur?.(e);
      setOpen(false);
    },
  } as Partial<TooltipTriggerProps> & { ref: Ref<HTMLElement> });

  const translate = {
    top: "-50%, -100%",
    bottom: "-50%, 0",
    left: "-100%, -50%",
    right: "0, -50%",
  }[side];

  return (
    <>
      {child}
      <Portal>
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              style={{
                position: "fixed",
                left: pos.x,
                top: pos.y,
                translate,
                zIndex: tooltipZ,
                pointerEvents: "none",
              }}
              className="px-2.5 py-1.5 rounded-lg border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel)] text-[rgb(var(--harbor-text))] text-xs shadow-xl whitespace-nowrap"
            >
              {content}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Portal>
    </>
  );
}
