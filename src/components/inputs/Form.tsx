import { forwardRef, type FormHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {}

/** A semantic `<form>` with default spacing. Pair with `FormSection`,
 *  `FieldSet`, and `FormField` to compose forms from any inputs. */
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  { className, ...rest },
  ref,
) {
  return (
    <form
      ref={ref}
      className={cn("flex flex-col gap-6 w-full min-w-0", className)}
      {...rest}
    />
  );
});
