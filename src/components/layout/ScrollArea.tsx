import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  maxHeight?: number | string;
  thumbTone?: "purple" | "white";
}

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  function ScrollArea(
    {
      children,
      className,
      maxHeight = 280,
      thumbTone = "purple",
      ...rest
    },
    _ref,
  ) {
    const viewport = useRef<HTMLDivElement | null>(null);
    const [thumb, setThumb] = useState({ top: 0, height: 0 });
    const [visible, setVisible] = useState(false);
    const [scrolling, setScrolling] = useState(false);
    const hideTimer = useRef<number | null>(null);

    function recompute() {
      const el = viewport.current;
      if (!el) return;
      const trackH = el.clientHeight;
      const contentH = el.scrollHeight;
      const ratio = trackH / contentH;
      if (ratio >= 1) {
        setThumb({ top: 0, height: 0 });
        return;
      }
      const h = Math.max(24, trackH * ratio);
      const max = trackH - h;
      const top = (el.scrollTop / (contentH - trackH)) * max;
      setThumb({ top, height: h });
    }

    useEffect(() => {
      recompute();
      const el = viewport.current;
      if (!el) return;
      const onScroll = () => {
        recompute();
        setVisible(true);
        setScrolling(true);
        if (hideTimer.current) clearTimeout(hideTimer.current);
        hideTimer.current = window.setTimeout(() => {
          setScrolling(false);
          hideTimer.current = window.setTimeout(() => setVisible(false), 600);
        }, 400);
      };
      const ro = new ResizeObserver(() => recompute());
      ro.observe(el);
      el.addEventListener("scroll", onScroll);
      return () => {
        ro.disconnect();
        el.removeEventListener("scroll", onScroll);
      };
    }, []);

    const thumbBg =
      thumbTone === "purple"
        ? "linear-gradient(180deg,#a855f7,#38bdf8)"
        : "rgba(255,255,255,0.5)";

    return (
      <div
        className={cn("relative overflow-hidden rounded-xl", className)}
        style={{ maxHeight }}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => {
          if (!scrolling) setVisible(false);
        }}
        {...rest}
      >
        <div
          ref={viewport}
          className="overflow-auto h-full pr-3"
          style={{ scrollbarWidth: "none" }}
        >
          <style>{`.scroll-no-native::-webkit-scrollbar{display:none}`}</style>
          <div className="scroll-no-native">{children}</div>
        </div>
        <motion.div
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="absolute right-1 top-0 w-1.5 rounded-full pointer-events-none"
          style={{
            top: thumb.top,
            height: thumb.height,
            background: thumbBg,
          }}
        />
      </div>
    );
  },
);
