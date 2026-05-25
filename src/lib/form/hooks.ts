import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { HarborFormContext, type FormContextValue } from "./context";
import { getByPath, stringToPath } from "./paths";

/** Access the enclosing `HarborForm`. Throws in development if called
 *  outside a form — prevents accidental silent no-ops. */
export function useHarborForm<T = unknown>(): FormContextValue<T> {
  const ctx = useContext(HarborFormContext);
  if (!ctx) {
    throw new Error(
      "useHarborForm: must be rendered inside a <HarborForm>.",
    );
  }
  return ctx as FormContextValue<T>;
}

export function useFormValue<V = unknown>(path: string): V {
  const { values } = useHarborForm();
  return getByPath(values, stringToPath(path)) as V;
}

export function useFormError(path: string): string | undefined {
  const { errors } = useHarborForm();
  return errors[path];
}

export interface FormStatus {
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  submitCount: number;
}

export function useFormStatus(): FormStatus {
  const { isSubmitting, isValid, dirty, submitCount } = useHarborForm();
  const isDirty = Object.values(dirty).some(Boolean);
  return { isSubmitting, isValid, isDirty, submitCount };
}

export interface AutosaveOptions<T> {
  enabled?: boolean;
  /** Debounce in ms between last edit and save. Default `800`. */
  delay?: number;
  /** Skip saving when invalid. Default `true`. */
  onlyWhenValid?: boolean;
  /** Save initial values without waiting for a dirty edit. Default `false`. */
  saveOnMount?: boolean;
  /** Save implementation. Receives the latest values. */
  save: (values: T) => void | Promise<void>;
  onSuccess?: (values: T) => void;
  onError?: (error: unknown, values: T) => void;
}

export interface AutosaveStatus {
  isSaving: boolean;
  pending: boolean;
  lastSavedAt: Date | null;
  error: unknown;
  flush: () => Promise<void>;
}

export interface AsyncFieldValidationOptions<V = unknown> {
  path: string;
  validate: (value: V) => Promise<true | string> | true | string;
  delay?: number;
  enabled?: boolean;
}

export function useAsyncFieldValidation<V = unknown>({
  path,
  validate,
  delay = 350,
  enabled = true,
}: AsyncFieldValidationOptions<V>): void {
  const form = useHarborForm();
  const value = getByPath(form.values, stringToPath(path)) as V;
  const validateRef = useRef(validate);
  validateRef.current = validate;

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      void Promise.resolve(validateRef.current(value)).then((result) => {
        if (cancelled) return;
        form.setError(path, result === true ? null : result);
      });
    }, delay);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [delay, enabled, form, path, value]);
}

/** Debounced autosave. Fires `save(values)` whenever values change and
 *  stay quiet for `delay` ms. Clears the timer on unmount to avoid a
 *  post-unmount save racing with navigation. */
export function useFormAutosave<T = unknown>(
  options: AutosaveOptions<T>,
): AutosaveStatus {
  const form = useHarborForm<T>();
  const { values, isValid, dirty } = form;
  const { reset } = form;
  const {
    enabled = true,
    delay = 800,
    onlyWhenValid = true,
    saveOnMount = false,
    save,
    onSuccess,
    onError,
  } = options;
  const saveRef = useRef(save);
  saveRef.current = save;
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const isValidRef = useRef(isValid);
  isValidRef.current = isValid;
  const timer = useRef<number | null>(null);
  const mounted = useRef(true);
  const lastSavedSnapshot = useRef<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [pending, setPending] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<unknown>(null);
  const isDirty = Object.values(dirty).some(Boolean);

  const runSave = useCallback(async () => {
    if (!enabled) return;
    if (onlyWhenValid && !isValidRef.current) return;
    const current = valuesRef.current;
    const snapshot = stableSnapshot(current);
    if (lastSavedSnapshot.current === snapshot) return;

    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    if (mounted.current) {
      setPending(false);
      setIsSaving(true);
    }
    try {
      await saveRef.current(current);
      lastSavedSnapshot.current = snapshot;
      if (stableSnapshot(valuesRef.current) === snapshot) {
        reset(current);
      }
      if (mounted.current) {
        setError(null);
        setLastSavedAt(new Date());
      }
      onSuccessRef.current?.(current);
    } catch (err) {
      if (mounted.current) setError(err);
      onErrorRef.current?.(err, current);
    } finally {
      if (mounted.current) setIsSaving(false);
    }
  }, [enabled, onlyWhenValid, reset]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    // Snapshot compared structurally so autosave doesn't re-fire when
    // the form commits the same payload again (e.g. after a failed
    // save followed by a no-op edit).
    const snapshot = stableSnapshot(values);
    if (!saveOnMount && !isDirty && lastSavedSnapshot.current === undefined) {
      lastSavedSnapshot.current = snapshot;
      return;
    }
    if (!saveOnMount && !isDirty) return;
    if (onlyWhenValid && !isValid) return;
    if (lastSavedSnapshot.current === snapshot) return;

    if (timer.current) window.clearTimeout(timer.current);
    setPending(true);
    timer.current = window.setTimeout(() => void runSave(), delay);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [delay, enabled, isDirty, isValid, onlyWhenValid, runSave, saveOnMount, values]);

  return { isSaving, pending, lastSavedAt, error, flush: runSave };
}

export interface DirtyGuardOptions {
  enabled?: boolean;
  message?: string;
}

export function useFormDirtyGuard({
  enabled = true,
  message = "You have unsaved changes.",
}: DirtyGuardOptions = {}): void {
  const { dirty } = useHarborForm();
  const isDirty = Object.values(dirty).some(Boolean);

  useEffect(() => {
    if (!enabled || !isDirty) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [enabled, isDirty, message]);
}

export interface FieldArrayHelpers<TItem> {
  items: TItem[];
  append: (item: TItem) => void;
  insert: (index: number, item: TItem) => void;
  remove: (index: number) => void;
  move: (from: number, to: number) => void;
  replace: (next: TItem[]) => void;
}

export function useFieldArray<TItem = unknown>(path: string): FieldArrayHelpers<TItem> {
  const form = useHarborForm();
  const value = getByPath(form.values, stringToPath(path));
  const items = useMemo(
    () => (Array.isArray(value) ? (value as TItem[]) : []),
    [value],
  );

  const replace = useCallback(
    (next: TItem[]) => form.setValue(path, next, { touch: true, validate: true }),
    [form, path],
  );

  return {
    items,
    append: (item) => replace([...items, item]),
    insert: (index, item) => {
      const next = [...items];
      next.splice(index, 0, item);
      replace(next);
    },
    remove: (index) => replace(items.filter((_, i) => i !== index)),
    move: (from, to) => {
      const next = [...items];
      const [item] = next.splice(from, 1);
      if (item === undefined) return;
      next.splice(to, 0, item);
      replace(next);
    },
    replace,
  };
}

export function useServerErrors() {
  const { setServerErrors, clearErrors } = useHarborForm();
  return { setServerErrors, clearServerErrors: clearErrors };
}

export interface FormWizardStep {
  id: string;
  label?: string;
  fields?: string[];
}

export interface FormWizardOptions {
  steps: FormWizardStep[];
  initialStep?: number | string;
  validateOnNext?: boolean;
}

export interface FormWizardState {
  steps: FormWizardStep[];
  step: FormWizardStep;
  stepIndex: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  progress: number;
  stepErrors: Record<string, string>;
  canGoNext: boolean;
  goTo: (step: number | string) => boolean;
  next: () => boolean;
  previous: () => boolean;
  validateStep: (step?: number | string) => boolean;
}

export function useFormWizard({
  steps,
  initialStep = 0,
  validateOnNext = true,
}: FormWizardOptions): FormWizardState {
  const form = useHarborForm();
  const initialIndex =
    typeof initialStep === "number"
      ? initialStep
      : Math.max(0, steps.findIndex((step) => step.id === initialStep));
  const [stepIndex, setStepIndex] = useState(() =>
    clamp(initialIndex, 0, Math.max(0, steps.length - 1)),
  );
  const safeStepIndex = clamp(stepIndex, 0, Math.max(0, steps.length - 1));
  const step = steps[safeStepIndex] ?? { id: "__empty__" };

  function resolveStepIndex(target: number | string | undefined): number {
    if (target === undefined) return safeStepIndex;
    if (typeof target === "number") return clamp(target, 0, Math.max(0, steps.length - 1));
    const found = steps.findIndex((item) => item.id === target);
    return found >= 0 ? found : safeStepIndex;
  }

  const validateStep = useCallback(
    (target?: number | string) => {
      const targetStep = steps[resolveStepIndex(target)];
      const fields = targetStep?.fields ?? [];
      for (const field of fields) form.touch(field);
      if (fields.length === 0) return true;
      const issues = form.validate();
      const failingFields = new Set(
        issues.map((issue) => issue.path.join(".")).filter(Boolean),
      );
      return fields.every((field) => !failingFields.has(field));
    },
    [form, safeStepIndex, steps],
  );

  const goTo = useCallback(
    (target: number | string) => {
      const nextIndex = resolveStepIndex(target);
      if (nextIndex > safeStepIndex && validateOnNext && !validateStep()) {
        return false;
      }
      setStepIndex(nextIndex);
      return true;
    },
    [safeStepIndex, validateOnNext, validateStep],
  );

  const next = useCallback(
    () => goTo(Math.min(safeStepIndex + 1, Math.max(0, steps.length - 1))),
    [goTo, safeStepIndex, steps.length],
  );

  const previous = useCallback(
    () => {
      setStepIndex((current) => clamp(current - 1, 0, Math.max(0, steps.length - 1)));
      return true;
    },
    [steps.length],
  );

  const stepErrors = useMemo(() => {
    const fields = step.fields ?? [];
    return Object.fromEntries(
      fields
        .map((field) => [field, form.errors[field]] as const)
        .filter(([, error]) => error !== undefined),
    );
  }, [form.errors, step.fields]);

  return {
    steps,
    step,
    stepIndex: safeStepIndex,
    isFirstStep: safeStepIndex === 0,
    isLastStep: safeStepIndex >= steps.length - 1,
    progress: steps.length <= 1 ? 1 : (safeStepIndex + 1) / steps.length,
    stepErrors,
    canGoNext: Object.keys(stepErrors).length === 0,
    goTo,
    next,
    previous,
    validateStep,
  };
}


function stableSnapshot(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
