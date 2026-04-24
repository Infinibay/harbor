import {
  forwardRef,
  useMemo,
  type FormHTMLAttributes,
  type ReactNode,
} from "react";
import type { Issue, Schema } from "../schema";
import { HarborFormContext, type FormContextValue } from "./context";
import { useForm, type UseFormOptions } from "./useForm";

export interface HarborFormProps<T>
  extends Omit<
    FormHTMLAttributes<HTMLFormElement>,
    "onSubmit" | "children" | "defaultValue"
  > {
  schema: Schema<T>;
  initial: T;
  onSubmit: (values: T) => void | Promise<void>;
  onInvalid?: (issues: Issue[]) => void;
  mode?: UseFormOptions<T>["mode"];
  reValidateMode?: UseFormOptions<T>["reValidateMode"];
  children: ReactNode;
}

/** Schema-driven form orchestration. Wrap inputs in `HarborField` to
 *  auto-wire values, errors, and required-state without prop drilling.
 *
 *  ```tsx
 *  const schema = f.object({
 *    email: f.string().email().required(),
 *    age:   f.number().min(18),
 *  });
 *
 *  <HarborForm schema={schema} initial={{ email: "", age: 18 }} onSubmit={save}>
 *    <HarborField name="email" label="Email"><TextField /></HarborField>
 *    <HarborField name="age" label="Age"><NumberField /></HarborField>
 *    <ActionRow><Button type="submit">Save</Button></ActionRow>
 *  </HarborForm>
 *  ```
 *
 *  Validation runs on submit by default (`mode="onSubmit"`); once a
 *  field has shown an error, further edits re-validate live
 *  (`reValidateMode="onChange"`). Both are overridable. */
export const HarborForm = forwardRef(function HarborForm<T>(
  {
    schema,
    initial,
    onSubmit,
    onInvalid,
    mode,
    reValidateMode,
    children,
    className,
    ...rest
  }: HarborFormProps<T>,
  ref: React.Ref<HTMLFormElement>,
) {
  const form = useForm<T>({ schema, initial, mode, reValidateMode });

  const ctx = useMemo<FormContextValue<T>>(() => ({ ...form }), [form]);

  const submit = useMemo(
    () => form.handleSubmit(onSubmit, onInvalid),
    [form, onSubmit, onInvalid],
  );

  return (
    <HarborFormContext.Provider value={ctx}>
      <form
        ref={ref}
        onSubmit={submit}
        noValidate
        className={className}
        {...rest}
      >
        {children}
      </form>
    </HarborFormContext.Provider>
  );
});
