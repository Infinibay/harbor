import { useCallback, useMemo, useReducer, useRef } from "react";
import { runValidate, type Issue, type Schema } from "../schema";
import {
  type DirtyMap,
  type ErrorMap,
  type FormMethods,
  type FormState,
  type TouchedMap,
} from "./context";
import { getByPath, pathToString, setByPath, stringToPath } from "./paths";

export type ValidateMode = "onSubmit" | "onBlur" | "onChange";

export interface UseFormOptions<T> {
  schema: Schema<T>;
  initial: T;
  /** When to run validation initially. Default `"onSubmit"` — the form
   *  stays silent until the user tries to submit (common web pattern). */
  mode?: ValidateMode;
  /** When to re-validate after a field has emitted its first error.
   *  Default `"onChange"` — errors clear as the user types. */
  reValidateMode?: ValidateMode;
}

type Action<T> =
  | {
      type: "SET_VALUE";
      path: string;
      value: unknown;
      touch: boolean;
      validate: boolean;
    }
  | { type: "TOUCH"; path: string }
  | { type: "SET_ERRORS"; errors: ErrorMap }
  | { type: "CLEAR_ERRORS" }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_END" }
  | { type: "RESET"; initial: T };

interface InternalState<T> {
  values: T;
  initial: T;
  errors: ErrorMap;
  touched: TouchedMap;
  dirty: DirtyMap;
  isSubmitting: boolean;
  submitCount: number;
}

function init<T>(initial: T): InternalState<T> {
  return {
    values: initial,
    initial,
    errors: {},
    touched: {},
    dirty: {},
    isSubmitting: false,
    submitCount: 0,
  };
}

function reducer<T>(
  state: InternalState<T>,
  action: Action<T>,
): InternalState<T> {
  switch (action.type) {
    case "SET_VALUE": {
      const path = stringToPath(action.path);
      const nextValues = setByPath(state.values, path, action.value);
      const initialAtPath = getByPath(state.initial, path);
      const dirtyNow = !shallowEqual(action.value, initialAtPath);
      return {
        ...state,
        values: nextValues,
        touched: action.touch
          ? { ...state.touched, [action.path]: true }
          : state.touched,
        dirty: { ...state.dirty, [action.path]: dirtyNow },
      };
    }
    case "TOUCH":
      return { ...state, touched: { ...state.touched, [action.path]: true } };
    case "SET_ERRORS":
      return { ...state, errors: action.errors };
    case "CLEAR_ERRORS":
      return { ...state, errors: {} };
    case "SUBMIT_START":
      return { ...state, isSubmitting: true, submitCount: state.submitCount + 1 };
    case "SUBMIT_END":
      return { ...state, isSubmitting: false };
    case "RESET":
      return init(action.initial);
  }
}

function shallowEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => shallowEqual(v, b[i]));
  }
  if (typeof a === "object" && typeof b === "object") {
    const ak = Object.keys(a as object);
    const bk = Object.keys(b as object);
    if (ak.length !== bk.length) return false;
    return ak.every((k) =>
      shallowEqual(
        (a as Record<string, unknown>)[k],
        (b as Record<string, unknown>)[k],
      ),
    );
  }
  return false;
}

function issuesToMap(issues: readonly Issue[]): ErrorMap {
  const out: ErrorMap = {};
  for (const i of issues) {
    const key = pathToString(i.path);
    // First issue per path wins — keeps the UI focused on the most
    // specific problem rather than a cascade.
    if (out[key] === undefined) out[key] = i.message;
  }
  return out;
}

export function useForm<T>(options: UseFormOptions<T>): FormState<T> & FormMethods<T> & {
  schema: Schema<T>;
  initial: T;
} {
  const { schema, initial, mode = "onSubmit", reValidateMode = "onChange" } =
    options;
  const [state, dispatch] = useReducer(
    reducer as (s: InternalState<T>, a: Action<T>) => InternalState<T>,
    initial,
    init,
  );

  // Ref mirror so async submit handlers see the latest values without
  // going stale through closures.
  const stateRef = useRef(state);
  stateRef.current = state;

  const runValidationInternal = useCallback(
    (values: T): Issue[] => runValidate(schema, values),
    [schema],
  );

  const setValue = useCallback<FormMethods<T>["setValue"]>(
    (path, value, opts) => {
      const touch = opts?.touch ?? false;
      const shouldValidate = opts?.validate ?? false;
      dispatch({ type: "SET_VALUE", path, value, touch, validate: shouldValidate });

      // Determine whether to re-run validation. We use a microtask so
      // we see the updated value already committed to the reducer.
      queueMicrotask(() => {
        const errorExists = stateRef.current.errors[path];
        const shouldRun =
          shouldValidate ||
          mode === "onChange" ||
          (errorExists && reValidateMode === "onChange");
        if (!shouldRun) return;
        const issues = runValidationInternal(stateRef.current.values);
        dispatch({ type: "SET_ERRORS", errors: issuesToMap(issues) });
      });
    },
    [mode, reValidateMode, runValidationInternal],
  );

  const touch = useCallback<FormMethods<T>["touch"]>(
    (path) => {
      dispatch({ type: "TOUCH", path });
      queueMicrotask(() => {
        const errorExists = stateRef.current.errors[path];
        const shouldRun =
          mode === "onBlur" ||
          (errorExists && reValidateMode === "onBlur");
        if (!shouldRun) return;
        const issues = runValidationInternal(stateRef.current.values);
        dispatch({ type: "SET_ERRORS", errors: issuesToMap(issues) });
      });
    },
    [mode, reValidateMode, runValidationInternal],
  );

  const setError = useCallback<FormMethods<T>["setError"]>((path, message) => {
    const cur = { ...stateRef.current.errors };
    if (message == null) delete cur[path];
    else cur[path] = message;
    dispatch({ type: "SET_ERRORS", errors: cur });
  }, []);

  const setErrors = useCallback<FormMethods<T>["setErrors"]>((issues) => {
    dispatch({ type: "SET_ERRORS", errors: issuesToMap(issues) });
  }, []);

  const clearErrors = useCallback<FormMethods<T>["clearErrors"]>(() => {
    dispatch({ type: "CLEAR_ERRORS" });
  }, []);

  const reset = useCallback<FormMethods<T>["reset"]>(
    (next) => {
      dispatch({ type: "RESET", initial: next ?? initial });
    },
    [initial],
  );

  const validate = useCallback<FormMethods<T>["validate"]>(
    (path) => {
      const issues = runValidationInternal(stateRef.current.values);
      dispatch({ type: "SET_ERRORS", errors: issuesToMap(issues) });
      if (path !== undefined) return issues.filter((i) => pathToString(i.path) === path);
      return issues;
    },
    [runValidationInternal],
  );

  const handleSubmit = useCallback<FormMethods<T>["handleSubmit"]>(
    (onValid, onInvalid) => async (e) => {
      e?.preventDefault?.();
      dispatch({ type: "SUBMIT_START" });
      try {
        const issues = runValidationInternal(stateRef.current.values);
        if (issues.length > 0) {
          dispatch({ type: "SET_ERRORS", errors: issuesToMap(issues) });
          onInvalid?.(issues);
          return;
        }
        dispatch({ type: "CLEAR_ERRORS" });
        await onValid(stateRef.current.values);
      } finally {
        dispatch({ type: "SUBMIT_END" });
      }
    },
    [runValidationInternal],
  );

  const isValid = useMemo(
    () => Object.keys(state.errors).length === 0,
    [state.errors],
  );

  return {
    schema,
    initial,
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    dirty: state.dirty,
    isSubmitting: state.isSubmitting,
    submitCount: state.submitCount,
    isValid,
    setValue,
    setError,
    setErrors,
    clearErrors,
    touch,
    reset,
    validate,
    handleSubmit,
  };
}
