import type { CSSProperties } from "react";
import { cn } from "../../lib/cn";
import { useFieldRow } from "./FieldRow";

/** Standard input heights used across Harbor — picks the right vertical
 *  footprint without hard-coding a number. */
const CONTROL_HEIGHT: Record<NonNullable<FieldSpacerProps["match"]>, number> = {
  input: 44, // h-11 — TextField, Select, Combobox, DatePicker, …
  "button-sm": 32, // h-8
  "button-md": 40, // h-10
  "button-lg": 48, // h-12
  toggle: 32, // Switch, small toggle
};

export interface FieldSpacerProps {
  /** Reserve the label row above the control. Default `true` — the
   *  common case is a field that lacks a label but sits next to ones
   *  that have one. */
  hasLabel?: boolean;
  /** Reserve the message row below the control, so an error appearing
   *  elsewhere in the row doesn't nudge this spacer up. Default `false`. */
  hasMessage?: boolean;
  /** Match the height of a standard control in the design system.
   *  Falls back to the `height` prop when passed explicitly. */
  match?: "input" | "button-sm" | "button-md" | "button-lg" | "toggle";
  /** Explicit control height in pixels (overrides `match`). */
  height?: number;
  className?: string;
}

/** Invisible placeholder that occupies the same vertical footprint as a
 *  `FormField` — a label line, a control row, and optionally a message
 *  line — without rendering anything visible.
 *
 *  Use it for "dead space" gaps where a column in a form grid has no
 *  field to show, but you still want the neighbouring rows to line up.
 *
 *  ```tsx
 *  <FormGrid columns={3}>
 *    <FormField label="First name"><TextField /></FormField>
 *    <FormField label="Last name"><TextField /></FormField>
 *    <FieldSpacer />     // keeps the next row aligned
 *
 *    <FormField label="Street"><TextField /></FormField>
 *    <FormField label="City"><TextField /></FormField>
 *    <FormField label="ZIP"><TextField /></FormField>
 *  </FormGrid>
 *  ```
 *
 *  Inside a `FieldRow`, the spacer collapses to a 3-row subgrid span so
 *  it takes a column without producing visible content. */
export function FieldSpacer({
  hasLabel = true,
  hasMessage = false,
  match = "input",
  height,
  className,
}: FieldSpacerProps) {
  const inFieldRow = Boolean(useFieldRow());
  const h = height ?? CONTROL_HEIGHT[match];

  if (inFieldRow) {
    return (
      <div
        aria-hidden
        className={cn(
          "md:grid md:grid-rows-subgrid md:row-span-3 min-w-0",
          className,
        )}
      />
    );
  }

  const style: CSSProperties = { height: h };

  return (
    <div
      aria-hidden
      className={cn("flex flex-col gap-1.5 min-w-0 select-none", className)}
    >
      {hasLabel ? (
        <span className="text-sm invisible leading-none">&nbsp;</span>
      ) : null}
      <span className="invisible block" style={style} />
      {hasMessage ? (
        <span className="text-xs invisible leading-none">&nbsp;</span>
      ) : null}
    </div>
  );
}
