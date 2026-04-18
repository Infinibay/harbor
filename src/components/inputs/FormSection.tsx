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
          <h3 className="text-white text-base font-semibold">{title}</h3>
        ) : null}
        {description ? (
          <p className="text-sm text-white/50">{description}</p>
        ) : null}
      </header>
    ) : null;

  if (columns) {
    return (
      <section
        className={cn(
          "grid grid-cols-1 md:grid-cols-[minmax(0,18rem)_1fr] gap-5 md:gap-10 py-4",
          className,
        )}
      >
        {header}
        <div className="flex flex-col gap-4 min-w-0">
          {children}
          {actions ? <div className="pt-2">{actions}</div> : null}
        </div>
      </section>
    );
  }

  return (
    <section className={cn("flex flex-col gap-4", className)}>
      {header}
      {children}
      {actions ? <div className="pt-2">{actions}</div> : null}
    </section>
  );
}
