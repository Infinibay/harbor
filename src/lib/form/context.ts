import { createContext } from "react";
import type { Issue, Schema } from "../schema";

export type ErrorMap = Record<string, string>;
export type TouchedMap = Record<string, boolean>;
export type DirtyMap = Record<string, boolean>;

export interface FormState<T> {
  values: T;
  errors: ErrorMap;
  touched: TouchedMap;
  dirty: DirtyMap;
  isSubmitting: boolean;
  submitCount: number;
  isValid: boolean;
}

export interface FormMethods<T> {
  setValue: (
    path: string,
    value: unknown,
    options?: { touch?: boolean; validate?: boolean },
  ) => void;
  setError: (path: string, message: string | null) => void;
  setErrors: (errors: Issue[]) => void;
  clearErrors: () => void;
  touch: (path: string) => void;
  reset: (next?: T) => void;
  validate: (path?: string) => Issue[];
  handleSubmit: (
    onValid: (values: T) => void | Promise<void>,
    onInvalid?: (issues: Issue[]) => void,
  ) => (e?: { preventDefault?: () => void }) => Promise<void>;
}

export interface FormContextValue<T = unknown>
  extends FormState<T>,
    FormMethods<T> {
  schema: Schema<T>;
  initial: T;
}

// `any` here is an intentional erasure at the context boundary —
// consumers reach for `useHarborForm<T>()` which re-types it. Storing
// the real generic would force every context consumer through a
// dynamic cast anyway.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HarborFormContext = createContext<FormContextValue<any> | null>(
  null,
);
