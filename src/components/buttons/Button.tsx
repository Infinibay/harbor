import {
  forwardRef,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  motion,
  AnimatePresence,
  useTransform,
} from "framer-motion";
import { cn } from "../../lib/cn";
import { useCursorProximity } from "../../lib/cursor";

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

const variants: Record<Variant, string> = {
  primary:
    "bg-white text-black hover:bg-white/90 shadow-[0_8px_24px_-8px_rgba(255,255,255,0.25)]",
  secondary:
    "bg-white/10 text-white border border-white/15 hover:bg-white/15",
  ghost: "text-white/80 hover:text-white hover:bg-white/5",
  destructive:
    "bg-rose-500/15 text-rose-200 border border-rose-400/30 hover:bg-rose-500/25",
  glass:
    "glass text-white hover:bg-white/10 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.4)]",
  link: "text-fuchsia-300 hover:text-fuchsia-200 underline-offset-2 hover:underline bg-transparent",
};

const glowColors: Record<Variant, string> = {
  primary: "rgba(0, 0, 0, 0.15)",
  secondary: "rgba(255, 255, 255, 0.4)",
  ghost: "rgba(255, 255, 255, 0.35)",
  destructive: "rgba(244, 63, 94, 0.4)",
  glass: "rgba(255, 255, 255, 0.35)",
  link: "rgba(168, 85, 247, 0.25)",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
  md: "h-10 px-4 text-sm rounded-xl gap-2",
  lg: "h-12 px-6 text-base rounded-xl gap-2.5",
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
    const glowBg = useTransform(
      [localX, localY] as any,
      ([lx, ly]: any) =>
        `radial-gradient(90px circle at ${lx * 100}% ${ly * 100}%, ${glowColors[variant]}, transparent 60%)`,
    );

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
        whileTap={disabled || loading ? undefined : { scale: 0.94 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        disabled={disabled || loading}
        className={cn(
          "relative overflow-hidden font-medium select-none",
          fullWidth ? "flex w-full" : "inline-flex",
          "items-center",
          align === "start"
            ? "justify-start"
            : align === "end"
              ? "justify-end"
              : "justify-center",
          "transition-colors outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          sizes[size],
          variants[variant],
          className,
        )}
        {...(rest as any)}
      >
        {/* inner light that follows the cursor */}
        {reactive ? (
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

        {ripples.map((r) => (
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
