import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface MoreButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  orientation?: "vertical" | "horizontal";
  size?: "sm" | "md";
}

/** Standardized kebab (⋮) / meatball (⋯) trigger.
 *
 * Pair it with a Menu, Popover, or DropdownMenu as trigger. */
export const MoreButton = forwardRef<HTMLButtonElement, MoreButtonProps>(
  function MoreButton(
    { orientation = "vertical", size = "md", className, ...rest },
    ref,
  ) {
    const dim = size === "sm" ? "w-7 h-7" : "w-8 h-8";
    return (
      <button
        ref={ref}
        type="button"
        aria-label="More actions"
        data-cursor="button"
        className={cn(
          "grid place-items-center rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors",
          dim,
          className,
        )}
        {...rest}
      >
        <span
          className="inline-block"
          style={{
            transform: orientation === "horizontal" ? "rotate(90deg)" : undefined,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.75" />
            <circle cx="12" cy="12" r="1.75" />
            <circle cx="12" cy="19" r="1.75" />
          </svg>
        </span>
      </button>
    );
  },
);
