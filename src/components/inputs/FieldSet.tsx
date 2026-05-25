import { type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface FieldSetProps {
  legend?: ReactNode;
  description?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Semantic `<fieldset>` for grouping related FormFields (e.g. an
 *  address block or notification preferences). Renders the legend
 *  as an inset chip over the border. */
export function FieldSet({
  legend,
  description,
  className,
  children,
}: FieldSetProps) {
  return (
    <fieldset
      className={cn(
        "flex min-w-0 flex-col gap-[var(--harbor-target-gap)] rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-field-border)] p-[var(--harbor-target-panel-padding)]",
        className,
      )}
    >
      {legend ? (
        <legend className="px-2 -ml-1 text-[11px] uppercase tracking-wider text-[color:var(--harbor-field-muted-fg)]">
          {legend}
        </legend>
      ) : null}
      {description ? (
        <p className="text-sm text-[color:var(--harbor-text-tertiary)] -mt-2">{description}</p>
      ) : null}
      {children}
    </fieldset>
  );
}
