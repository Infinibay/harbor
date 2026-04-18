import {
  createContext,
  useContext,
  useId,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";

interface FormFieldCtx {
  id: string;
  describedBy?: string;
  invalid: boolean;
  required: boolean;
}

const FormFieldContext = createContext<FormFieldCtx | null>(null);

/** Read the enclosing FormField's auto-generated id + ARIA attrs, so a
 *  custom input can wire `id` and `aria-describedby` without prop
 *  drilling. Returns `null` outside of a FormField. */
export function useFormField(): FormFieldCtx | null {
  return useContext(FormFieldContext);
}

export interface FormFieldProps {
  label?: ReactNode;
  helper?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  optional?: boolean;
  /** `stacked` (default) = label above field; `inline` = label left, field right. */
  layout?: "stacked" | "inline";
  /** Suppress the label→input association (useful when the child itself
   *  renders the label — e.g. a Switch where the label sits next to the
   *  control). */
  labelless?: boolean;
  className?: string;
  children: ReactNode;
}

/** A labelled form row: label + any input + helper + error, with ids and
 *  `aria-describedby` wired automatically for native inputs via context.
 *
 *  ```tsx
 *  <FormField label="Email" required error={err} helper="We won't share">
 *    <TextField type="email" />
 *  </FormField>
 *  ```
 */
export function FormField({
  label,
  helper,
  error,
  required,
  optional,
  layout = "stacked",
  labelless,
  className,
  children,
}: FormFieldProps) {
  const auto = useId();
  const id = `ff-${auto}`;
  const helperId = helper ? `${id}-h` : undefined;
  const errorId = error ? `${id}-e` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  const ctx: FormFieldCtx = {
    id,
    describedBy,
    invalid: Boolean(error),
    required: Boolean(required),
  };

  const labelEl = label ? (
    <label
      htmlFor={labelless ? undefined : id}
      className="text-sm text-white/75 flex items-center gap-1 select-none"
    >
      <span>{label}</span>
      {required ? (
        <span className="text-rose-300" aria-hidden>
          *
        </span>
      ) : null}
      {optional ? (
        <span className="text-white/30 text-xs font-normal">(optional)</span>
      ) : null}
    </label>
  ) : null;

  const message = (
    <AnimatePresence initial={false} mode="wait">
      {error ? (
        <motion.p
          key="err"
          id={errorId}
          initial={{ opacity: 0, y: -3, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -3, height: 0 }}
          className="text-xs text-rose-300"
        >
          {error}
        </motion.p>
      ) : helper ? (
        <motion.p
          key="help"
          id={helperId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-xs text-white/40"
        >
          {helper}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );

  return (
    <FormFieldContext.Provider value={ctx}>
      {layout === "inline" ? (
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-[minmax(0,14rem)_1fr] gap-x-6 gap-y-1.5 items-start",
            className,
          )}
        >
          <div className="md:pt-2">{labelEl}</div>
          <div className="flex flex-col gap-1.5 min-w-0">
            {children}
            {message}
          </div>
        </div>
      ) : (
        <div className={cn("flex flex-col gap-1.5 min-w-0", className)}>
          {labelEl}
          {children}
          {message}
        </div>
      )}
    </FormFieldContext.Provider>
  );
}
