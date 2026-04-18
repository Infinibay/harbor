import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface CloseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "solid";
}

const sizes = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-sm",
  lg: "w-10 h-10 text-base",
};

const variants = {
  ghost: "text-white/50 hover:text-white hover:bg-white/5",
  solid:
    "text-white/75 bg-white/[0.04] border border-white/10 hover:text-white hover:bg-white/10",
};

/** Standardized × close button. Good for dialog headers, toast dismiss,
 *  removable chips, etc. */
export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
  function CloseButton(
    { size = "md", variant = "ghost", className, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label="Close"
        data-cursor="button"
        className={cn(
          "grid place-items-center rounded-lg transition-colors",
          sizes[size],
          variants[variant],
          className,
        )}
        {...rest}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 3l6 6M9 3l-6 6" />
        </svg>
      </button>
    );
  },
);
