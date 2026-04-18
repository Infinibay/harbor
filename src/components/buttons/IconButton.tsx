import {
  forwardRef,
  useRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { motion, useTransform } from "framer-motion";
import { cn } from "../../lib/cn";
import { useCursorProximity } from "../../lib/cursor";

type Size = "sm" | "md" | "lg";
type Variant = "solid" | "ghost" | "glass";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "ref"> {
  size?: Size;
  variant?: Variant;
  label: string;
  icon: ReactNode;
  reactive?: boolean;
}

const sizes: Record<Size, string> = {
  sm: "w-8 h-8 rounded-lg",
  md: "w-10 h-10 rounded-xl",
  lg: "w-12 h-12 rounded-2xl",
};

const variants: Record<Variant, string> = {
  solid: "bg-white/10 hover:bg-white/15 text-white border border-white/10",
  ghost: "hover:bg-white/10 text-white/75 hover:text-white",
  glass: "glass text-white hover:bg-white/10",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      size = "md",
      variant = "solid",
      label,
      icon,
      reactive = true,
      className,
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
      90,
    );
    const x = useTransform(nx, (v) => (reactive ? v * 1.25 : 0));
    const y = useTransform(ny, (v) => (reactive ? v * 1.25 : 0));
    const iconRotate = useTransform(nx, (v) => (reactive ? v * 2 : 0));
    const glowOpacity = useTransform(proximity, (v) =>
      reactive ? v * 0.5 : 0,
    );
    const glowBg = useTransform(
      [localX, localY] as any,
      ([lx, ly]: any) =>
        `radial-gradient(60px circle at ${lx * 100}% ${ly * 100}%, rgba(255,255,255,0.4), transparent 55%)`,
    );

    return (
      <motion.button
        ref={setRefs}
        aria-label={label}
        title={label}
        style={{ x, y }}
        whileTap={{ scale: 0.88, rotate: -5 }}
        whileHover={{ scale: 1.06 }}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
        className={cn(
          "relative overflow-hidden grid place-items-center outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60 transition-colors",
          sizes[size],
          variants[variant],
          className,
        )}
        {...(rest as any)}
      >
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
