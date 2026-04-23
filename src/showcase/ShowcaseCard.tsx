import {
  useRef,
  useState,
  type PropsWithChildren,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";
import { CodeBlock } from "../components/dev/CodeBlock";

export function Group({
  id,
  title,
  desc,
  children,
}: PropsWithChildren<{ id: string; title: string; desc?: string }>) {
  return (
    <section id={id} className="scroll-mt-24 py-16">
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-fuchsia-300/70 mb-2">
        <span className="h-px w-8 bg-fuchsia-300/50" />
        {id}
      </div>
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      {desc ? <p className="mt-1.5 text-white/50">{desc}</p> : null}
      <div className="mt-8 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

export type DemoIntensity = "quiet" | "soft" | "strong";

export function Demo({
  title,
  hint,
  wide,
  calm,
  intensity,
  children,
  actions,
  source,
}: PropsWithChildren<{
  title: string;
  hint?: string;
  wide?: boolean;
  /** @deprecated use intensity="quiet" instead. */
  calm?: boolean;
  /** Spotlight tier:
   *  - `quiet`  : barely there. Reading content.
   *  - `soft`   : mid. Forms, tables, chat, text-heavy surfaces.
   *  - `strong` : default. Buttons, charts, visual demos. */
  intensity?: DemoIntensity;
  actions?: ReactNode;
  /** JSX source string to display under the preview. Injected
   *  automatically at build time by vite-plugin-demo-source from the
   *  element's children; set manually to override. */
  source?: string;
}>) {
  const level: DemoIntensity = intensity ?? (calm ? "quiet" : "strong");
  const ref = useRef<HTMLDivElement | null>(null);
  const [showSource, setShowSource] = useState(false);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }
  const surface =
    level === "quiet"
      ? "spotlight-quiet border border-white/8"
      : level === "soft"
        ? "spotlight-soft border border-white/8"
        : "spotlight glow-border";
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        "glass rounded-2xl p-5 flex flex-col gap-4 min-h-[160px]",
        surface,
        wide && "md:col-span-2",
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-white font-medium text-sm">{title}</h3>
          {hint ? (
            <p className="text-xs text-white/45 mt-0.5">{hint}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {actions}
          {source ? (
            <button
              type="button"
              onClick={() => setShowSource((v) => !v)}
              aria-pressed={showSource}
              aria-label={showSource ? "Hide source" : "Show source"}
              title={showSource ? "Hide source" : "Show source"}
              className={cn(
                "inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider",
                "px-2 py-1 rounded-md border transition-colors",
                showSource
                  ? "bg-white/10 text-white/90 border-white/20"
                  : "text-white/45 border-white/10 hover:text-white/80 hover:bg-white/5",
              )}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M4.5 3.5 2 6l2.5 2.5M7.5 3.5 10 6l-2.5 2.5" />
              </svg>
              Code
            </button>
          ) : null}
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center">{children}</div>
      {showSource && source ? (
        <CodeBlock code={source} lang="tsx" showLineNumbers={false} />
      ) : null}
    </div>
  );
}

export function Row({
  children,
  className,
  attention,
}: PropsWithChildren<{ className?: string; attention?: boolean }>) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3",
        attention && "attention-group",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Col({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("flex flex-col gap-3 w-full", className)}>
      {children}
    </div>
  );
}
