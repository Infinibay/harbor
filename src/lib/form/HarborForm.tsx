import {
  useMemo,
  type FormHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import type { Issue, Schema } from "../schema";
import { HarborFormContext, type FormContextValue } from "./context";
import { useForm, type UseFormOptions } from "./useForm";

export interface HarborFormProps<T>
  extends Omit<
    FormHTMLAttributes<HTMLFormElement>,
    "onSubmit" | "onInvalid" | "children" | "defaultValue"
  > {
  schema: Schema<T>;
  initial: T;
  onSubmit: (values: T) => void | Promise<void>;
  /** Called with the full issue list when submit is blocked by schema
   *  validation. Distinct from the native form `onInvalid` event (which
   *  the built-in HTML validator would fire — we suppress that by
   *  setting `noValidate` on the form element). */
  onSubmitError?: (issues: Issue[]) => void;
  mode?: UseFormOptions<T>["mode"];
  reValidateMode?: UseFormOptions<T>["reValidateMode"];
  /** Forward a ref to the underlying <form> element. React 19-style —
   *  ref is just a regular prop on function components. */
  ref?: Ref<HTMLFormElement>;
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
 *  (`reValidateMode="onChange"`). Both are overridable.
 *
 *  `forwardRef` is intentionally NOT used — wrapping a generic function
 *  with `forwardRef` erases the type parameter, so `onSubmit(v)` lands
 *  as `unknown` at the call site. React 19 treats `ref` as a normal
 *  prop on function components, which preserves inference. */
export function HarborForm<T>({
  schema,
  initial,
  onSubmit,
  onSubmitError,
  mode,
  reValidateMode,
  children,
  className,
  ref,
  ...rest
}: HarborFormProps<T>) {
  const form = useForm<T>({ schema, initial, mode, reValidateMode });

  const ctx = useMemo<FormContextValue<T>>(() => ({ ...form }), [form]);

  const submit = useMemo(
    () => form.handleSubmit(onSubmit, onSubmitError),
    [form, onSubmit, onSubmitError],
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
}
