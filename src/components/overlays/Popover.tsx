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
import { Z } from "../../lib/z";
import { Portal } from "../../lib/Portal";

type Side = "top" | "bottom" | "left" | "right";
type Align = "start" | "center" | "end";

export interface PopoverProps {
  children: ReactElement<any>;
  content: ReactNode;
  side?: Side;
  align?: Align;
  className?: string;
}

export function Popover({
  children,
  content,
  side = "bottom",
  align = "center",
  className,
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLElement | null>(null);
  const popRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!open) return;
    function place() {
      const a = anchorRef.current;
      const p = popRef.current;
      if (!a || !p) return;
      const ar = a.getBoundingClientRect();
      const pr = p.getBoundingClientRect();
      let x = 0;
      let y = 0;
      const gap = 8;
      if (side === "bottom") {
        y = ar.bottom + gap;
        x =
          align === "start"
            ? ar.left
            : align === "end"
              ? ar.right - pr.width
              : ar.left + ar.width / 2 - pr.width / 2;
      } else if (side === "top") {
        y = ar.top - pr.height - gap;
        x =
          align === "start"
            ? ar.left
            : align === "end"
              ? ar.right - pr.width
              : ar.left + ar.width / 2 - pr.width / 2;
      } else if (side === "right") {
        x = ar.right + gap;
        y = ar.top + ar.height / 2 - pr.height / 2;
      } else {
        x = ar.left - pr.width - gap;
        y = ar.top + ar.height / 2 - pr.height / 2;
      }
      setPos({ x, y });
    }
    place();
    const on = () => place();
    window.addEventListener("scroll", on, true);
    window.addEventListener("resize", on);
    function click(e: MouseEvent) {
      if (
        !popRef.current?.contains(e.target as Node) &&
        !anchorRef.current?.contains(e.target as Node)
      )
        setOpen(false);
    }
    document.addEventListener("mousedown", click);
    return () => {
      window.removeEventListener("scroll", on, true);
      window.removeEventListener("resize", on);
      document.removeEventListener("mousedown", click);
    };
  }, [open, side, align]);

  const child = cloneElement(children, {
    ref: (el: HTMLElement | null) => {
      anchorRef.current = el;
      const ref = (children as any).ref;
      if (typeof ref === "function") ref(el);
      else if (ref) (ref as any).current = el;
    },
    onClick: (e: any) => {
      children.props.onClick?.(e);
      setOpen((o) => !o);
    },
  } as any);

  return (
    <>
      {child}
      <Portal>
        <AnimatePresence>
          {open ? (
            <motion.div
              ref={popRef}
              initial={{ opacity: 0, scale: 0.96, y: side === "top" ? 4 : -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                position: "fixed",
                left: pos.x,
                top: pos.y,
                zIndex: Z.POPOVER,
              }}
              className={cn(
                "rounded-xl bg-[#14141c] border border-white/10 shadow-2xl p-3",
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
