import {
  forwardRef,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  motion,
  AnimatePresence,
  useMotionTemplate,
  useTransform,
} from "framer-motion";
import { cn } from "../../lib/cn";
import { useCursorProximity } from "../../lib/cursor";
import { useReducedMotionPreference } from "../../lib/a11y";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  | "glass"
  | "link";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "ref"> {
  variant?: Variant;
  size?: Size;
  /** When true, pulls strongly toward the cursor. Otherwise a subtle lean. */
  magnetic?: boolean;
  /** Disable the subtle cursor-reactive lean + inner glow. */
  reactive?: boolean;
  ripple?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  align?: "start" | "center" | "end";
}

type MotionButtonProps = ComponentPropsWithoutRef<typeof motion.button>;

const variants: Record<Variant, string> = {
  primary:
    "bg-[rgb(var(--harbor-brand))] text-[rgb(var(--harbor-brand-fg))] shadow-[0_8px_24px_-8px_rgb(var(--harbor-brand)/0.42)] hover:bg-[rgb(var(--harbor-accent-2))]",
  secondary:
    "border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel-muted)] text-[rgb(var(--harbor-text))] hover:bg-[var(--harbor-state-hover)] hover:border-[color:var(--harbor-border-strong)]",
  ghost:
    "bg-transparent text-[rgb(var(--harbor-text-muted))] hover:bg-[var(--harbor-state-hover)] hover:text-[rgb(var(--harbor-text))]",
  destructive:
    "border border-[rgb(var(--harbor-danger)/0.32)] bg-[rgb(var(--harbor-danger)/0.12)] text-[rgb(var(--harbor-danger))] hover:bg-[rgb(var(--harbor-danger)/0.18)]",
  glass:
    "border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-toolbar)] text-[rgb(var(--harbor-text))] shadow-[0_8px_24px_-8px_rgb(var(--harbor-bg)/0.45)] backdrop-blur-xl hover:bg-[var(--harbor-state-hover)]",
  link:
    "bg-transparent text-[var(--harbor-text-link)] underline-offset-2 hover:underline hover:text-[rgb(var(--harbor-accent))]",
};

const glowColors: Record<Variant, string> = {
  primary: "rgb(var(--harbor-brand-fg) / 0.24)",
  secondary: "rgb(var(--harbor-accent-2) / 0.20)",
  ghost: "rgb(var(--harbor-accent-2) / 0.16)",
  destructive: "rgb(var(--harbor-danger) / 0.24)",
  glass: "rgb(var(--harbor-accent-2) / 0.18)",
  link: "rgb(var(--harbor-accent) / 0.18)",
};

const sizes: Record<Size, string> = {
  sm: "h-[calc(var(--harbor-target-control-height)-8px)] px-[calc(var(--harbor-target-control-padding-x)-2px)] text-xs rounded-[var(--harbor-target-radius)] gap-1.5",
  md: "h-[var(--harbor-target-control-height)] px-[var(--harbor-target-control-padding-x)] text-[length:var(--harbor-target-font-size)] rounded-[var(--harbor-target-radius)] gap-2",
  lg: "h-[calc(var(--harbor-target-control-height)+8px)] px-[calc(var(--harbor-target-control-padding-x)+8px)] text-base rounded-[var(--harbor-target-radius)] gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      magnetic = false,
      reactive = true,
      ripple = true,
      loading = false,
      icon,
      iconRight,
      fullWidth = false,
      align = "center",
      children,
      className,
      onClick,
      disabled,
      ...rest
    },
    ref,
  ) {
    const localRef = useRef<HTMLButtonElement | null>(null);
    const reducedMotion = useReducedMotionPreference();
    const setRefs = (el: HTMLButtonElement | null) => {
      localRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref)
        (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el;
    };

    const { nx, ny, localX, localY, proximity } = useCursorProximity(
      localRef,
      magnetic ? 160 : 100,
    );
    const leanStrength = magnetic ? 8 : 1.5;
    const x = useTransform(nx, (v) => (reactive ? v * leanStrength : 0));
    const y = useTransform(ny, (v) => (reactive ? v * leanStrength : 0));
    const glowOpacity = useTransform(proximity, (v) =>
      reactive ? v * 0.55 : 0,
    );
    const glowX = useTransform(localX, (v) => `${v * 100}%`);
    const glowY = useTransform(localY, (v) => `${v * 100}%`);
    const glowBg = useMotionTemplate`radial-gradient(90px circle at ${glowX} ${glowY}, ${glowColors[variant]}, transparent 60%)`;

    const [ripples, setRipples] = useState<
      { id: number; x: number; y: number }[]
    >([]);

    function handleClick(e: MouseEvent<HTMLButtonElement>) {
      if (ripple && localRef.current) {
        const r = localRef.current.getBoundingClientRect();
        const id = Date.now() + Math.random();
        setRipples((prev) => [
          ...prev,
          { id, x: e.clientX - r.left, y: e.clientY - r.top },
        ]);
        setTimeout(
          () => setRipples((prev) => prev.filter((p) => p.id !== id)),
          620,
        );
      }
      onClick?.(e);
    }

    return (
      <motion.button
        ref={setRefs}
        onClick={handleClick}
        style={{ x, y }}
        whileTap={disabled || loading || reducedMotion ? undefined : { scale: 0.94 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        disabled={disabled || loading}
        className={cn(
          "relative overflow-hidden font-medium select-none whitespace-nowrap",
          fullWidth ? "flex w-full" : "inline-flex",
          "items-center",
          align === "start"
            ? "justify-start"
            : align === "end"
              ? "justify-end"
              : "justify-center",
          "transition-colors outline-none focus-visible:shadow-[var(--harbor-focus-shadow)]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          sizes[size],
          variants[variant],
          className,
        )}
        {...(rest as unknown as MotionButtonProps)}
      >
        {/* inner light that follows the cursor */}
        {reactive && !reducedMotion ? (
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

        <AnimatePresence>
          {loading ? (
            <motion.span
              key="spin"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="absolute inset-0 grid place-items-center"
            >
              <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            </motion.span>
          ) : null}
        </AnimatePresence>

        <motion.span
          className="relative inline-flex items-center justify-center"
          animate={{ opacity: loading ? 0 : 1 }}
          style={{ gap: "inherit" }}
        >
          {icon}
          {children}
          {iconRight}
        </motion.span>

        {!reducedMotion && ripples.map((r) => (
          <motion.span
            key={r.id}
            initial={{ width: 0, height: 0, opacity: 0.45 }}
            animate={{ width: 360, height: 360, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              translate: "-50% -50%",
              borderRadius: 999,
              background: "currentColor",
              opacity: 0.25,
              pointerEvents: "none",
            }}
          />
        ))}
      </motion.button>
    );
  },
);
