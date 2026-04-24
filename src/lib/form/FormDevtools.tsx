import { useState } from "react";
import { cn } from "../cn";
import { useHarborForm } from "./hooks";

export interface FormDevtoolsProps {
  /** Where to dock the overlay. Default `"bottom-right"`. */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  /** Start collapsed. Default `true`. */
  defaultCollapsed?: boolean;
  className?: string;
}

/** Dev-only overlay that inspects the enclosing form's state (values,
 *  errors, touched, dirty, status). Renders nothing in production
 *  (`import.meta.env.DEV` gate) so it can stay in source.
 *
 *  Pair with `<HarborForm>`:
 *
 *  ```tsx
 *  <HarborForm …>
 *    …
 *    <FormDevtools />
 *  </HarborForm>
 *  ``` */
export function FormDevtools({
  position = "bottom-right",
  defaultCollapsed = true,
  className,
}: FormDevtoolsProps) {
  // Dev-only. In a production build import.meta.env.DEV is false and the
  // devtools are compiled out by the dead-code eliminator.
  if (typeof import.meta !== "undefined" && !import.meta.env?.DEV) {
    return null;
  }
  return (
    <FormDevtoolsImpl
      position={position}
      defaultCollapsed={defaultCollapsed}
      className={className}
    />
  );
}

function FormDevtoolsImpl({
  position,
  defaultCollapsed,
  className,
}: Required<Omit<FormDevtoolsProps, "className">> & { className?: string }) {
  const form = useHarborForm();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const posClass = {
    "bottom-right": "bottom-4 end-4",
    "bottom-left": "bottom-4 start-4",
    "top-right": "top-4 end-4",
    "top-left": "top-4 start-4",
  }[position];

  return (
    <div
      className={cn(
        "fixed z-[9999] rounded-xl bg-[#0f0f16]/90 border border-white/10 backdrop-blur text-[11px] font-mono shadow-2xl",
        "max-w-[380px]",
        posClass,
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-3 py-2 text-white/75 hover:text-white"
      >
        <span>
          <span className="text-fuchsia-300">form</span> ·{" "}
          {form.isSubmitting
            ? "submitting…"
            : form.isValid
              ? "valid"
              : `${Object.keys(form.errors).length} issue(s)`}
        </span>
        <span className="text-white/40">{collapsed ? "▸" : "▾"}</span>
      </button>
      {collapsed ? null : (
        <div className="px-3 pb-3 space-y-2 max-h-[60vh] overflow-auto">
          <Section label="values" value={form.values} />
          <Section label="errors" value={form.errors} />
          <Section label="touched" value={form.touched} />
          <Section label="dirty" value={form.dirty} />
          <Section
            label="status"
            value={{
              submitCount: form.submitCount,
              isSubmitting: form.isSubmitting,
              isValid: form.isValid,
            }}
          />
        </div>
      )}
    </div>
  );
}

function Section({ label, value }: { label: string; value: unknown }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-white/40">
        {label}
      </div>
      <pre className="whitespace-pre-wrap break-all text-white/85">
        {pretty(value)}
      </pre>
    </div>
  );
}

function pretty(v: unknown): string {
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}
