import { cloneElement, isValidElement, type ReactNode } from "react";
import { FormField, type FormFieldProps } from "../../components/inputs/FormField";
import { useHarborForm } from "./hooks";
import { getByPath, stringToPath } from "./paths";

export interface HarborFieldProps
  extends Omit<FormFieldProps, "error" | "required" | "children"> {
  /** Dot-path into the form values (`"email"`, `"user.name"`,
   *  `"tags.0"`). */
  name: string;
  /** Overrides the `required` flag that the schema would otherwise
   *  provide. Rarely needed. */
  required?: boolean;
  children: ReactNode;
}

/** Field wrapper that wires a control into the enclosing `HarborForm`.
 *
 *  - Reads `value` / `error` / `touched` by `name`
 *  - Renders a `FormField` that owns the label + error + helper
 *  - Clones the child control with `value` + `onChange` + `onBlur` so
 *    controlled inputs (`TextField`, `Select`, `NumberField`, …) work
 *    without extra glue.
 *
 *  If the child isn't a single element (e.g. a fragment), the form
 *  state is still available through the context — child components can
 *  reach for `useHarborForm()` themselves. */
export function HarborField({
  name,
  label,
  helper,
  optional,
  layout,
  labelless,
  className,
  required: requiredOverride,
  children,
}: HarborFieldProps) {
  const form = useHarborForm();
  const path = stringToPath(name);
  const value = getByPath(form.values, path);
  // HarborField shows whatever error is currently in form state. The
  // form itself decides when to populate state.errors based on `mode`:
  //
  //   - mode="onSubmit": errors surface only after the first submit.
  //   - mode="onBlur":   errors surface after a field is blurred.
  //   - mode="onChange": errors surface on every keystroke.
  //
  // Gating display here on `touched || submitCount > 0` would
  // double-filter and hide legitimate errors in onChange mode.
  const error = form.errors[name];

  const child = isValidElement<Record<string, unknown>>(children)
    ? cloneElement(children, {
        value: value ?? "",
        onChange: makeOnChange(children, (v) =>
          form.setValue(name, v, { touch: false }),
        ),
        onBlur: makeOnBlur(children, () => form.touch(name)),
      })
    : children;

  return (
    <FormField
      label={label}
      helper={helper}
      error={error}
      required={requiredOverride}
      optional={optional}
      layout={layout}
      labelless={labelless}
      className={className}
    >
      {child}
    </FormField>
  );
}

// Clone handlers without stomping on the caller's own onChange/onBlur.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeOnChange(el: any, set: (v: unknown) => void) {
  const prev = el.props?.onChange;
  return (arg: unknown) => {
    prev?.(arg);
    // Support two shapes: native-style onChange(event) where the value
    // lives on event.target.value, and value-style onChange(v).
    if (
      arg &&
      typeof arg === "object" &&
      "target" in (arg as object) &&
      (arg as { target: unknown }).target &&
      typeof ((arg as { target: { value?: unknown } }).target.value) !==
        "undefined"
    ) {
      set((arg as { target: { value: unknown } }).target.value);
    } else {
      set(arg);
    }
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeOnBlur(el: any, touch: () => void) {
  const prev = el.props?.onBlur;
  return (arg: unknown) => {
    prev?.(arg);
    touch();
  };
}
