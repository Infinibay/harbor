import { type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface FormSectionProps {
  title?: ReactNode;
  description?: ReactNode;
  /** Two-column layout: title/description on the left, fields on the right. */
  columns?: boolean;
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** A titled section within a form. Use `columns` for the GitHub/Vercel
 *  settings-style layout with the header to the left. */
export function FormSection({
  title,
  description,
  columns,
  actions,
  className,
  children,
}: FormSectionProps) {
  const header =
    title || description ? (
      <header className="flex flex-col gap-1">
        {title ? (
          <h3 className="text-[color:var(--harbor-text-primary)] text-base font-semibold">{title}</h3>
        ) : null}
        {description ? (
          <p className="text-sm text-[color:var(--harbor-text-tertiary)]">{description}</p>
        ) : null}
      </header>
    ) : null;

  if (columns) {
    return (
      <section
        className={cn(
          "grid grid-cols-1 gap-[calc(var(--harbor-target-gap)*1.5)] py-[var(--harbor-target-panel-padding)] md:grid-cols-[minmax(0,18rem)_1fr] md:gap-[calc(var(--harbor-target-gap)*3)]",
          className,
        )}
      >
        {header}
        <div className="flex min-w-0 flex-col gap-[var(--harbor-target-gap)]">
          {children}
          {actions ? <div className="pt-2">{actions}</div> : null}
        </div>
      </section>
    );
  }

  return (
    <section className={cn("flex flex-col gap-[var(--harbor-target-gap)]", className)}>
      {header}
      {children}
      {actions ? <div className="pt-2">{actions}</div> : null}
    </section>
  );
}
