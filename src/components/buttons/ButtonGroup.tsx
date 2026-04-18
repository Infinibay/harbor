import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface ButtonGroupProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  attached?: boolean;
  className?: string;
}

/** Group buttons horizontally.
 *
 * `attached` (default true) removes inner borders so the buttons look
 * segmented — use for toolbar-style groupings. Set to false for simple
 * spacing.
 */
export function ButtonGroup({
  children,
  size,
  attached = true,
  className,
}: ButtonGroupProps) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<
    { size?: string; className?: string }
  >[];

  if (!attached) {
    return (
      <div className={cn("inline-flex items-center gap-2", className)}>
        {size
          ? items.map((c, i) => cloneElement(c, { key: i, size: c.props.size ?? size }))
          : children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center [&>*]:rounded-none [&>*:first-child]:rounded-l-lg [&>*:last-child]:rounded-r-lg [&>*+*]:-ml-px",
        className,
      )}
    >
      {items.map((c, i) =>
        cloneElement(c, {
          key: i,
          size: c.props.size ?? size,
          className: cn(c.props.className, "relative z-0 focus-within:z-[1] hover:z-[1]"),
        }),
      )}
    </div>
  );
}
