import {
  forwardRef,
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../../lib/cn";
import { IconTile } from "./IconTile";

type Variant = "default" | "glass" | "solid";

export interface CardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: Variant;
  interactive?: boolean;
  tilt?: boolean;
  spotlight?: boolean;
  glow?: boolean;
  selected?: boolean;
  disabled?: boolean;
  fullHeight?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
  leadingIcon?: ReactNode;
  leadingIconTone?: "neutral" | "sky" | "green" | "purple" | "amber" | "rose";
}

const variants: Record<Variant, string> = {
  default:
    "hbr-card bg-[rgb(var(--harbor-bg-elev-1))] border border-white/10",
  glass: "glass",
  solid: "bg-[#14141c] border border-white/8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant = "default",
    interactive = false,
    tilt = false,
    spotlight = true,
    glow = true,
    selected = false,
    disabled = false,
    fullHeight = false,
    title,
    description,
    header,
    footer,
    leadingIcon,
    leadingIconTone = "purple",
    children,
    className,
    ...rest
  },
  ref,
) {
  const localRef = useRef<HTMLDivElement | null>(null);
  const setRefs = (el: HTMLDivElement | null) => {
    localRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref)
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
  };

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 20 });
  const sry = useSpring(ry, { stiffness: 220, damping: 20 });
  const rotateX = useTransform(srx, (v) => (tilt ? -v * 8 : 0));
  const rotateY = useTransform(sry, (v) => (tilt ? v * 8 : 0));

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = localRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    rx.set(ny);
    ry.set(nx);
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  const { onClick: origOnClick, ...restSafe } = rest as any;
  const handleClick = disabled ? undefined : origOnClick;
  const inner = (
    <motion.div
      ref={setRefs}
      onMouseMove={disabled ? undefined : onMove}
      onMouseLeave={onLeave}
      onClick={handleClick}
      whileHover={interactive && !disabled ? { y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={
        tilt && !disabled
          ? {
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }
          : undefined
      }
      aria-selected={selected || undefined}
      aria-disabled={disabled || undefined}
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        "relative rounded-2xl p-5 overflow-hidden transition-colors",
        fullHeight && "h-full flex flex-col",
        variants[variant],
        spotlight && !disabled && "spotlight",
        glow && !disabled && "glow-border",
        interactive && !disabled && "cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        selected &&
          !disabled &&
          "border-[rgb(var(--harbor-accent))] bg-[rgb(var(--harbor-accent)/0.1)] ring-2 ring-[rgb(var(--harbor-accent)/0.3)]",
        className,
      )}
      {...restSafe}
    >
      {header ? <div className="mb-3">{header}</div> : null}
      {title || description || leadingIcon ? (
        <div
          className={cn(
            "mb-3",
            leadingIcon ? "flex items-start gap-3" : "",
          )}
        >
          {leadingIcon ? (
            <IconTile icon={leadingIcon} tone={leadingIconTone} size="md" />
          ) : null}
          <div className="min-w-0 flex-1">
            {title ? (
              <div className="mb-1 text-white font-medium">{title}</div>
            ) : null}
            {description ? (
              <div className="text-white/55 text-sm">{description}</div>
            ) : null}
          </div>
        </div>
      ) : null}
      <div className={cn(fullHeight && "flex-1 min-h-0")}>{children}</div>
      {footer ? (
        <div className={cn("mt-4", fullHeight && "mt-auto pt-4")}>{footer}</div>
      ) : null}
    </motion.div>
  );

  if (tilt)
    return (
      <div style={{ perspective: 1000 }} className="w-full">
        {inner}
      </div>
    );
  return inner;
});

export function CardGrid({
  children,
  className,
  cols = 2,
}: PropsWithChildren<{ className?: string; cols?: 1 | 2 | 3 | 4 }>) {
  const gridCols =
    cols === 1
      ? "grid-cols-1"
      : cols === 2
        ? "md:grid-cols-2"
        : cols === 3
          ? "md:grid-cols-3"
          : "md:grid-cols-4";
  return (
    <div className={cn("grid gap-4", gridCols, className)}>{children}</div>
  );
}
