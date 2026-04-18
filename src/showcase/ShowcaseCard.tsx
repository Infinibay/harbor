import {
  useRef,
  type PropsWithChildren,
  type MouseEvent,
  type ReactNode,
} from "react";
import { cn } from "../lib/cn";

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

export function Demo({
  title,
  hint,
  wide,
  calm,
  children,
  actions,
}: PropsWithChildren<{
  title: string;
  hint?: string;
  wide?: boolean;
  /** Disable spotlight + glow-border. Use for reading-focused demos where
   *  the purple light hurts text legibility (Prose, Article cards, etc). */
  calm?: boolean;
  actions?: ReactNode;
}>) {
  const ref = useRef<HTMLDivElement | null>(null);
  function onMove(e: MouseEvent<HTMLDivElement>) {
    if (calm) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        "glass rounded-2xl p-5 flex flex-col gap-4 min-h-[160px]",
        calm ? "border border-white/8" : "spotlight glow-border",
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
        {actions}
      </header>
      <div className="flex-1 flex items-center justify-center">{children}</div>
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
