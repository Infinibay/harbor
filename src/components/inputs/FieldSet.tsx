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
        "border border-white/10 rounded-xl p-4 flex flex-col gap-4 min-w-0",
        className,
      )}
    >
      {legend ? (
        <legend className="px-2 -ml-1 text-[11px] uppercase tracking-wider text-white/60">
          {legend}
        </legend>
      ) : null}
      {description ? (
        <p className="text-sm text-white/50 -mt-2">{description}</p>
      ) : null}
      {children}
    </fieldset>
  );
}
