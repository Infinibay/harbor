import {
  forwardRef,
  useRef,
  type ComponentPropsWithoutRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { motion, useMotionTemplate, useTransform } from "framer-motion";
import { cn } from "../../lib/cn";
import { useCursorProximity } from "../../lib/cursor";
import { useReducedMotionPreference } from "../../lib/a11y";

type Size = "sm" | "md" | "lg";
type Variant = "solid" | "ghost" | "glass";
type MotionButtonProps = ComponentPropsWithoutRef<typeof motion.button>;

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "ref"> {
  size?: Size;
  variant?: Variant;
  label: string;
  icon: ReactNode;
  reactive?: boolean;
  /** Disable cursor-reactive lean + inner glow. Alias for `reactive={false}`
   *  intended for dense contexts (tables, toolbars) where the magnetic
   *  effect feels jumpy. When `size="sm"` and `quiet` is unspecified,
   *  defaults to true. */
  quiet?: boolean;
}

const sizes: Record<Size, string> = {
  sm: "w-8 h-8 rounded-lg",
  md: "w-10 h-10 rounded-xl",
  lg: "w-12 h-12 rounded-2xl",
};

const variants: Record<Variant, string> = {
  solid:
    "border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel-muted)] text-[rgb(var(--harbor-text))] hover:bg-[var(--harbor-state-hover)] hover:border-[color:var(--harbor-border-strong)]",
  ghost:
    "bg-transparent text-[rgb(var(--harbor-text-muted))] hover:bg-[var(--harbor-state-hover)] hover:text-[rgb(var(--harbor-text))]",
  glass:
    "border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-toolbar)] text-[rgb(var(--harbor-text))] backdrop-blur-xl hover:bg-[var(--harbor-state-hover)]",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      size = "md",
      variant = "solid",
      label,
      icon,
      reactive,
      quiet,
      className,
      ...rest
    },
    ref,
  ) {
    // Default behavior: sm size runs quiet (dense contexts), md/lg reactive.
    const isQuiet = quiet ?? (reactive === false ? true : size === "sm");
    const reducedMotion = useReducedMotionPreference();
    const reactiveOn = (reactive ?? !isQuiet) && !reducedMotion;
    const localRef = useRef<HTMLButtonElement | null>(null);
    const setRefs = (el: HTMLButtonElement | null) => {
      localRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref)
        (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el;
    };

    const { nx, ny, localX, localY, proximity } = useCursorProximity(
      localRef,
      90,
    );
    const x = useTransform(nx, (v) => (reactiveOn ? v * 1.25 : 0));
    const y = useTransform(ny, (v) => (reactiveOn ? v * 1.25 : 0));
    const iconRotate = useTransform(nx, (v) => (reactiveOn ? v * 2 : 0));
    const glowOpacity = useTransform(proximity, (v) =>
      reactiveOn ? v * 0.5 : 0,
    );
    const glowX = useTransform(localX, (v) => `${v * 100}%`);
    const glowY = useTransform(localY, (v) => `${v * 100}%`);
    const glowBg = useMotionTemplate`radial-gradient(60px circle at ${glowX} ${glowY}, rgb(var(--harbor-accent-2) / 0.22), transparent 55%)`;

    return (
      <motion.button
        ref={setRefs}
        aria-label={label}
        title={label}
        style={{ x, y }}
        whileTap={reducedMotion ? undefined : { scale: 0.88, rotate: -5 }}
        whileHover={reducedMotion ? undefined : { scale: 1.06 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className={cn(
          "relative overflow-hidden grid place-items-center outline-none focus-visible:shadow-[var(--harbor-focus-shadow)] transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          sizes[size],
          variants[variant],
          className,
        )}
        {...(rest as unknown as MotionButtonProps)}
      >
        {reactiveOn ? (
          <motion.span
            aria-hidden
            style={{
              opacity: glowOpacity,
              background: glowBg,
              borderRadius: "inherit",
            }}
            className="absolute inset-0 pointer-events-none mix-blend-soft-light"
          />
        ) : null}
        <motion.span
          style={{ rotate: iconRotate }}
          className="relative grid place-items-center"
        >
          {icon}
        </motion.span>
      </motion.button>
    );
  },
);
