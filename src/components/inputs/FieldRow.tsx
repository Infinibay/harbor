import {
  createContext,
  useContext,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";

interface FieldRowCtx {
  subgrid: true;
}

const FieldRowContext = createContext<FieldRowCtx | null>(null);

/** Read the enclosing `FieldRow` context. Returns `null` outside a row.
 *  Field primitives (FormField, FieldSpacer, …) use this to switch their
 *  layout into subgrid mode so labels, controls, and messages line up
 *  across sibling fields without manual empty placeholders. */
export function useFieldRow(): FieldRowCtx | null {
  return useContext(FieldRowContext);
}

export interface FieldRowProps {
  children: ReactNode;
  /** Explicit `grid-template-columns` at the horizontal breakpoint. When
   *  omitted, every child gets an equal-width column (`auto-cols-fr`).
   *  Examples: `"1fr 1fr"`, `"2fr 1fr auto"`, `"minmax(0,14rem) 1fr auto"`. */
  template?: string;
  /** Horizontal gap between columns in Tailwind spacing units. Default `4` (16px). */
  gapX?: 1 | 2 | 3 | 4 | 5 | 6 | 8;
  /** Reserve the message row even when no child is showing an error / helper,
   *  so validation errors appearing later don't shift the layout.
   *  Default `true`. */
  reserveMessage?: boolean;
  /** Vertically align controls across columns when control heights differ
   *  (e.g. a `<Textarea>` next to a `<TextField>`). Default `"start"`. */
  controlAlign?: "start" | "center" | "end";
  className?: string;
}

const GAP_X_CLASS: Record<number, string> = {
  1: "md:gap-x-1",
  2: "md:gap-x-2",
  3: "md:gap-x-3",
  4: "md:gap-x-4",
  5: "md:gap-x-5",
  6: "md:gap-x-6",
  8: "md:gap-x-8",
};

/** Horizontal row of form fields whose labels, controls, and messages
 *  snap to the same three baselines across columns.
 *
 *  Stacks vertically below `md` (768px); becomes a 3-row CSS subgrid at
 *  `md` and above. Any `FormField` / `FieldSpacer` / `FieldRow.Slot`
 *  inside automatically participates — no manual row wiring needed.
 *
 *  ```tsx
 *  <FieldRow template="1fr 1fr auto">
 *    <FormField label="First name"><TextField /></FormField>
 *    <FormField label="Last name" error="Required"><TextField /></FormField>
 *    <FieldRow.Action>
 *      <Button>Search</Button>
 *    </FieldRow.Action>
 *  </FieldRow>
 *  ```
 *
 *  The button gets no label and no message row of its own, yet ends up
 *  vertically aligned with the input controls of its labeled siblings. */
export function FieldRow({
  children,
  template,
  gapX = 4,
  reserveMessage = true,
  controlAlign = "start",
  className,
}: FieldRowProps) {
  const style: CSSProperties | undefined = template
    ? ({ "--fr-cols": template } as CSSProperties)
    : undefined;

  const alignCls =
    controlAlign === "center"
      ? "md:items-center"
      : controlAlign === "end"
        ? "md:items-end"
        : "md:items-start";

  return (
    <FieldRowContext.Provider value={{ subgrid: true }}>
      <div
        style={style}
        className={cn(
          "flex flex-col gap-4 min-w-0",
          "md:grid",
          template
            ? "md:grid-cols-[var(--fr-cols)]"
            : "md:grid-flow-col md:auto-cols-fr",
          reserveMessage
            ? "md:grid-rows-[auto_auto_minmax(1.125rem,auto)]"
            : "md:grid-rows-[auto_auto_auto]",
          GAP_X_CLASS[gapX],
          "md:gap-y-1.5",
          alignCls,
          className,
        )}
      >
        {children}
      </div>
    </FieldRowContext.Provider>
  );
}

export interface FieldRowSlotProps {
  children: ReactNode;
  /** Which subgrid rows to occupy. Default `"control"` (just the input row) —
   *  so a button placed here aligns bottom-with-input instead of drifting
   *  up to the label row. */
  row?: "control" | "label+control" | "control+message" | "full";
  /** Vertical alignment within the cell. Default `"end"` (bottom-aligned with
   *  the `44px` input baseline). */
  align?: "start" | "center" | "end" | "stretch";
  /** Column span when building a non-uniform template. Default `1`. */
  span?: 1 | 2 | 3 | 4;
  className?: string;
}

const ROW_CLASS: Record<NonNullable<FieldRowSlotProps["row"]>, string> = {
  control: "md:row-start-2 md:row-end-3",
  "label+control": "md:row-start-1 md:row-end-3",
  "control+message": "md:row-start-2 md:row-end-4",
  full: "md:row-start-1 md:row-end-4",
};

const SELF_ALIGN_CLASS: Record<NonNullable<FieldRowSlotProps["align"]>, string> = {
  start: "md:self-start",
  center: "md:self-center",
  end: "md:self-end",
  stretch: "md:self-stretch",
};

const SPAN_CLASS: Record<NonNullable<FieldRowSlotProps["span"]>, string> = {
  1: "",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
};

function FieldRowSlot({
  children,
  row = "control",
  align = "end",
  span = 1,
  className,
}: FieldRowSlotProps) {
  return (
    <div
      className={cn(
        "min-w-0",
        ROW_CLASS[row],
        SELF_ALIGN_CLASS[align],
        SPAN_CLASS[span],
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Generic subgrid slot — lets you place arbitrary content (buttons,
 *  static text, secondary controls) into one or more rows of the parent
 *  `FieldRow` without inheriting FormField's label / message structure. */
FieldRow.Slot = FieldRowSlot;

/** Shorthand for the common case: a button that should sit on the input
 *  baseline of its labeled siblings. Equivalent to
 *  `<FieldRow.Slot row="control" align="end" />`. */
FieldRow.Action = function FieldRowAction(
  props: Omit<FieldRowSlotProps, "row">,
) {
  return <FieldRowSlot row="control" {...props} />;
};
