import {
  createContext,
  useContext,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";

interface LabelLaneCtx {
  active: true;
}

const LabelLaneContext = createContext<LabelLaneCtx | null>(null);

/** Read the enclosing `LabelLane` context. Returns `null` outside a lane.
 *  FormField uses this to switch its inline layout into col-subgrid mode
 *  so the label column width is shared across all rows. */
export function useLabelLane(): LabelLaneCtx | null {
  return useContext(LabelLaneContext);
}

export interface LabelLaneProps {
  children: ReactNode;
  /** Minimum label column width. Accepts any valid CSS length. Default
   *  `"0"` — lets short labels collapse. */
  labelMin?: string;
  /** Maximum label column width. Default `"auto"` — auto-sizes to fit the
   *  widest label across all rows. Pass a value like `"14rem"` to cap it. */
  labelMax?: string;
  /** Horizontal gap between the label and control columns in Tailwind
   *  spacing units. Default `6` (24px). */
  gapX?: 3 | 4 | 5 | 6 | 8 | 10 | 12;
  /** Vertical gap between rows in Tailwind spacing units. Default `4`. */
  gapY?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const GAP_X_CLASS: Record<number, string> = {
  3: "md:gap-x-3",
  4: "md:gap-x-4",
  5: "md:gap-x-5",
  6: "md:gap-x-6",
  8: "md:gap-x-8",
  10: "md:gap-x-10",
  12: "md:gap-x-12",
};
const GAP_Y_CLASS: Record<number, string> = {
  2: "gap-y-2",
  3: "gap-y-3",
  4: "gap-y-4",
  5: "gap-y-5",
  6: "gap-y-6",
};

/** Two-column form layout where every `FormField` inside shares the same
 *  auto-sized label column. Removes the "guess a label width" problem —
 *  no matter how short or long the labels are, their controls all start
 *  at the same X.
 *
 *  ```tsx
 *  <LabelLane>
 *    <FormField label="Name"><TextField /></FormField>
 *    <FormField label="Email address"><TextField /></FormField>
 *    <FormField label="Phone"><TextField /></FormField>
 *  </LabelLane>
 *  ```
 *
 *  Collapses to stacked label-above-control below `md`. Works with any
 *  input (FormField passes its children straight through). */
export function LabelLane({
  children,
  labelMin = "0",
  labelMax = "auto",
  gapX = 6,
  gapY = 4,
  className,
}: LabelLaneProps) {
  const style = {
    "--lane-cols": `minmax(${labelMin},${labelMax}) minmax(0,1fr)`,
  } as CSSProperties;

  return (
    <LabelLaneContext.Provider value={{ active: true }}>
      <div
        style={style}
        className={cn(
          "grid grid-cols-1 md:grid-cols-[var(--lane-cols)]",
          "items-start min-w-0",
          GAP_X_CLASS[gapX],
          GAP_Y_CLASS[gapY],
          className,
        )}
      >
        {children}
      </div>
    </LabelLaneContext.Provider>
  );
}
