import { useContext, useEffect, useRef } from "react";
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
  /** Debounce in ms between last edit and save. Default `800`. */
  delay?: number;
  /** Skip saving when invalid. Default `true`. */
  onlyWhenValid?: boolean;
  /** Save implementation. Receives the latest values. */
  save: (values: T) => void | Promise<void>;
}

/** Debounced autosave. Fires `save(values)` whenever values change and
 *  stay quiet for `delay` ms. Clears the timer on unmount to avoid a
 *  post-unmount save racing with navigation. */
export function useFormAutosave<T = unknown>(
  options: AutosaveOptions<T>,
): void {
  const { values, isValid } = useHarborForm<T>();
  const { delay = 800, onlyWhenValid = true, save } = options;
  const saveRef = useRef(save);
  saveRef.current = save;
  const timer = useRef<number | null>(null);
  const lastSavedSnapshot = useRef<T | undefined>(undefined);

  useEffect(() => {
    // Snapshot compared structurally so autosave doesn't re-fire when
    // the form commits the same payload again (e.g. after a failed
    // save followed by a no-op edit).
    if (onlyWhenValid && !isValid) return;
    if (snapshotEqual(lastSavedSnapshot.current, values)) return;

    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      lastSavedSnapshot.current = values;
      void saveRef.current(values);
    }, delay);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [values, isValid, onlyWhenValid, delay]);
}

function snapshotEqual(a: unknown, b: unknown): boolean {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return a === b;
  }
}
