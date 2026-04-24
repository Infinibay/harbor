import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface ActionRowProps {
  children: ReactNode;
  /** Horizontal alignment of the action buttons.
   *  - `"end"` (default) — right-aligned. OK / Cancel at the bottom of a form.
   *  - `"start"` — left-aligned. Toolbar-style actions.
   *  - `"center"` — centered. Onboarding CTAs, dialog actions.
   *  - `"between"` — first child pushed to the far left (destructive / tertiary),
   *     remaining children grouped on the right. */
  align?: "start" | "center" | "end" | "between";
  /** Gap between buttons in Tailwind spacing units. Default `3` (12px). */
  gap?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Stack vertically (each child taking the full width) below this
   *  breakpoint. Useful for mobile where side-by-side buttons feel cramped.
   *  Default `undefined` — stays horizontal on all sizes. */
  stackBelow?: "sm" | "md" | "lg";
  /** When `stackBelow` is set, reverse the child order when stacked so the
   *  primary action ends up on top. Default `true`. */
  reverseOnStack?: boolean;
  /** Add a subtle top border — the standard "form footer" treatment.
   *  Default `false`. */
  divide?: boolean;
  className?: string;
}

const GAP_CLASS: Record<number, string> = {
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
};

const JUSTIFY_CLASS: Record<NonNullable<ActionRowProps["align"]>, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

const STACK_FLOW: Record<NonNullable<ActionRowProps["stackBelow"]>, string> = {
  sm: "flex-col sm:flex-row",
  md: "flex-col md:flex-row",
  lg: "flex-col lg:flex-row",
};

const STACK_REVERSE: Record<NonNullable<ActionRowProps["stackBelow"]>, string> = {
  sm: "flex-col-reverse sm:flex-row",
  md: "flex-col-reverse md:flex-row",
  lg: "flex-col-reverse lg:flex-row",
};

const STACK_WIDTH: Record<NonNullable<ActionRowProps["stackBelow"]>, string> = {
  sm: "[&>*]:w-full sm:[&>*]:w-auto",
  md: "[&>*]:w-full md:[&>*]:w-auto",
  lg: "[&>*]:w-full lg:[&>*]:w-auto",
};

/** Horizontal row of action buttons with the correct alignment, gap, and
 *  responsive stacking for form / dialog footers.
 *
 *  ```tsx
 *  <ActionRow align="end" stackBelow="sm" divide>
 *    <Button variant="ghost">Cancel</Button>
 *    <Button>Save changes</Button>
 *  </ActionRow>
 *
 *  // Destructive split — delete on the left, primary on the right:
 *  <ActionRow align="between">
 *    <Button variant="danger">Delete workspace</Button>
 *    <div className="flex gap-3">
 *      <Button variant="ghost">Cancel</Button>
 *      <Button>Save</Button>
 *    </div>
 *  </ActionRow>
 *  ```
 */
export function ActionRow({
  children,
  align = "end",
  gap = 3,
  stackBelow,
  reverseOnStack = true,
  divide = false,
  className,
}: ActionRowProps) {
  const flowCls = stackBelow
    ? reverseOnStack
      ? STACK_REVERSE[stackBelow]
      : STACK_FLOW[stackBelow]
    : "flex-row";

  return (
    <div
      className={cn(
        "flex items-center flex-wrap min-w-0",
        flowCls,
        GAP_CLASS[gap],
        JUSTIFY_CLASS[align],
        stackBelow ? STACK_WIDTH[stackBelow] : null,
        divide && "border-t border-white/10 pt-4 mt-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
