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
  ghost:
    "bg-transparent text-[rgb(var(--harbor-text-muted))] hover:bg-[var(--harbor-state-hover)] hover:text-[rgb(var(--harbor-text))]",
  solid:
    "border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel-muted)] text-[rgb(var(--harbor-text-muted))] hover:bg-[var(--harbor-state-hover)] hover:text-[rgb(var(--harbor-text))]",
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
          "grid place-items-center rounded-lg outline-none transition-colors focus-visible:shadow-[var(--harbor-focus-shadow)] disabled:cursor-not-allowed disabled:opacity-50",
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
