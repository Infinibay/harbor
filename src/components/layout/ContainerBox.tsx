import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface ContainerBoxProps {
  children: ReactNode;
  /** Named container — lets CSS `@container` queries target by name. */
  name?: string;
  /** `inline-size` (default, horizontal) or `size` (both axes). */
  type?: "inline-size" | "size" | "normal";
  className?: string;
  style?: CSSProperties;
}

/**
 * Declare a CSS container-query context on a wrapper.
 *
 * Anything inside can use a CSS container query — i.e. an "@container
 * (min-width: 400px)" block — to respond to the CONTAINER size instead of
 * the viewport. Much more robust for components that get placed in
 * sidebars, modals, or split panes where the viewport isn't the right
 * thing to measure.
 *
 * Put the rule in a stylesheet or an inline style element. If you prefer
 * JS-side logic, pair this with the useContainerSize / useContainerAbove
 * hooks from lib/useContainerSize.ts.
 */
export const ContainerBox = forwardRef<HTMLDivElement, ContainerBoxProps>(
  function ContainerBox(
    { children, name, type = "inline-size", className, style },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        style={{
          ...style,
          containerType: type,
          containerName: name,
        }}
      >
        {children}
      </div>
    );
  },
);
