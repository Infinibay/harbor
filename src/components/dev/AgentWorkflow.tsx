import type { FormEvent, ReactNode } from "react";
import { cn } from "../../lib/cn";
import { DiffViewer } from "../data/DiffViewer";
import { Select } from "../inputs/Select";

export interface AgentWorkflowProps {
  children?: ReactNode;
  sidebar?: ReactNode;
  className?: string;
  mainClassName?: string;
  sidebarClassName?: string;
  mainLabel?: string;
  sidebarLabel?: string;
}

export function AgentWorkflow({
  children,
  sidebar,
  className,
  mainClassName,
  sidebarClassName,
  mainLabel = "Workflow",
  sidebarLabel = "Workflow context",
}: AgentWorkflowProps) {
  return (
    <section
      className={cn(
        "grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]",
        className,
      )}
    >
      <div aria-label={mainLabel} className={cn("space-y-4", mainClassName)}>
        {children}
      </div>
      {sidebar ? (
        <aside
          aria-label={sidebarLabel}
          className={cn("space-y-4", sidebarClassName)}
        >
          {sidebar}
        </aside>
      ) : null}
    </section>
  );
}

export interface PromptComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  actions?: ReactNode;
  className?: string;
}

export function PromptComposer({
  value,
  onChange,
  onSubmit,
  label = "Prompt",
  placeholder = "Ask the agent...",
  disabled,
  actions,
  className,
}: PromptComposerProps) {
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!disabled && value.trim()) onSubmit();
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        "rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel)] p-2",
        className,
      )}
    >
      <textarea
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={3}
        className="min-h-20 w-full resize-y rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-subtle)] bg-[var(--harbor-surface-sunken)] px-3 py-2 text-sm text-[rgb(var(--harbor-text))] outline-none placeholder:text-[rgb(var(--harbor-text-subtle))] focus-visible:shadow-[var(--harbor-focus-shadow)] disabled:cursor-not-allowed disabled:opacity-60"
      />
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="min-w-0">{actions}</div>
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="rounded-[var(--harbor-target-radius)] bg-[rgb(var(--harbor-accent))] px-3 py-1.5 text-sm font-medium text-[rgb(var(--harbor-brand-fg))] outline-none hover:brightness-110 focus-visible:shadow-[var(--harbor-focus-shadow)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Run
        </button>
      </div>
    </form>
  );
}

export interface ModelOption {
  id: string;
  label: string;
  description?: string;
}

export interface ModelPickerProps {
  models: ModelOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function ModelPicker({
  models,
  value,
  onChange,
  label = "Model",
  className,
}: ModelPickerProps) {
  const active = models.find((model) => model.id === value);

  return (
    <div className={cn("grid gap-1 text-sm", className)}>
      <span className="text-xs font-medium text-[rgb(var(--harbor-text-muted))]">
        {label}
      </span>
      <Select
        size="sm"
        value={value}
        onChange={onChange}
        aria-label={typeof label === "string" ? label : "Model"}
        options={models.map((model) => ({
          value: model.id,
          label: model.label,
          description: model.description,
        }))}
        placeholder={typeof label === "string" ? label : "Model"}
      />
      {active?.description ? (
        <span className="text-xs text-[rgb(var(--harbor-text-subtle))]">
          {active.description}
        </span>
      ) : null}
    </div>
  );
}

export interface AgentTimelineItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  status: "queued" | "running" | "complete" | "blocked" | "error";
  timestamp?: ReactNode;
}

const statusTone: Record<AgentTimelineItem["status"], string> = {
  queued: "bg-[var(--harbor-chart-neutral)]",
  running: "bg-[rgb(var(--harbor-info))]",
  complete: "bg-[rgb(var(--harbor-success))]",
  blocked: "bg-[rgb(var(--harbor-warning))]",
  error: "bg-[rgb(var(--harbor-danger))]",
};

export function AgentTimeline({
  items,
  className,
}: {
  items: AgentTimelineItem[];
  className?: string;
}) {
  return (
    <ol className={cn("space-y-3", className)}>
      {items.map((item) => (
        <li key={item.id} className="grid grid-cols-[auto_1fr] gap-3">
          <span
            aria-hidden="true"
            className={cn("mt-1 h-2.5 w-2.5 rounded-full", statusTone[item.status])}
          />
          <div className="min-w-0">
            <div className="flex items-center justify-between gap-3">
              <div className="font-medium text-[rgb(var(--harbor-text))]">
                {item.title}
                <span className="sr-only"> {item.status}</span>
              </div>
              {item.timestamp ? (
                <div className="text-xs text-[rgb(var(--harbor-text-subtle))]">
                  {item.timestamp}
                </div>
              ) : null}
            </div>
            {item.description ? (
              <div className="mt-1 text-sm text-[rgb(var(--harbor-text-muted))]">
                {item.description}
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export interface ToolCallTraceProps {
  name: ReactNode;
  status: "pending" | "running" | "success" | "error";
  input?: ReactNode;
  output?: ReactNode;
  duration?: ReactNode;
  className?: string;
}

export function ToolCallTrace({
  name,
  status,
  input,
  output,
  duration,
  className,
}: ToolCallTraceProps) {
  return (
    <details
      className={cn(
        "rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel)]",
        className,
      )}
    >
      <summary className="flex cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm">
        <span className="font-medium">{name}</span>
        <span className="text-xs text-[rgb(var(--harbor-text-muted))]">
          {status}
          {duration ? ` · ${duration}` : ""}
        </span>
      </summary>
      <div className="grid gap-2 border-t border-[color:var(--harbor-border-subtle)] p-3 text-xs">
        {input ? <pre className="overflow-auto rounded bg-[var(--harbor-surface-sunken)] p-2">{input}</pre> : null}
        {output ? <pre className="overflow-auto rounded bg-[var(--harbor-surface-sunken)] p-2">{output}</pre> : null}
      </div>
    </details>
  );
}

export function ApprovalCard({
  title,
  description,
  approveLabel = "Approve",
  rejectLabel = "Reject",
  onApprove,
  onReject,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  approveLabel?: ReactNode;
  rejectLabel?: ReactNode;
  onApprove: () => void;
  onReject: () => void;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel)] p-3",
        className,
      )}
    >
      <div className="font-medium">{title}</div>
      {description ? (
        <div className="mt-1 text-sm text-[rgb(var(--harbor-text-muted))]">
          {description}
        </div>
      ) : null}
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={onApprove} className="rounded-[var(--harbor-target-radius)] bg-[rgb(var(--harbor-success))] px-3 py-1.5 text-sm text-black">
          {approveLabel}
        </button>
        <button type="button" onClick={onReject} className="rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-default)] px-3 py-1.5 text-sm text-[rgb(var(--harbor-danger))]">
          {rejectLabel}
        </button>
      </div>
    </section>
  );
}

export interface CitationItem {
  id: string;
  label: ReactNode;
  href?: string;
  excerpt?: ReactNode;
}

export function CitationPanel({
  citations,
  className,
}: {
  citations: CitationItem[];
  className?: string;
}) {
  return (
    <section className={cn("space-y-2", className)} aria-label="Citations">
      {citations.map((citation) => (
        <article key={citation.id} className="rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-default)] p-3">
          {citation.href ? (
            <a href={citation.href} className="font-medium text-[rgb(var(--harbor-accent-2))] underline-offset-4 hover:underline">
              {citation.label}
            </a>
          ) : (
            <div className="font-medium">{citation.label}</div>
          )}
          {citation.excerpt ? (
            <p className="mt-1 text-sm text-[rgb(var(--harbor-text-muted))]">
              {citation.excerpt}
            </p>
          ) : null}
        </article>
      ))}
    </section>
  );
}

export function DiffApproval({
  before,
  after,
  onApprove,
  onReject,
  className,
}: {
  before: string;
  after: string;
  onApprove: () => void;
  onReject: () => void;
  className?: string;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      <DiffViewer oldText={before} newText={after} />
      <ApprovalCard
        title="Apply proposed diff?"
        onApprove={onApprove}
        onReject={onReject}
      />
    </section>
  );
}

export function RunLog({
  entries,
  className,
}: {
  entries: Array<{ id: string; message: ReactNode; level?: "info" | "warn" | "error" }>;
  className?: string;
}) {
  return (
    <ul className={cn("font-mono text-xs", className)} aria-label="Run log">
      {entries.map((entry) => (
        <li key={entry.id} className="border-b border-[color:var(--harbor-border-subtle)] px-3 py-1.5">
          <span className="me-2 text-[rgb(var(--harbor-text-subtle))]">
            {entry.level ?? "info"}
          </span>
          {entry.message}
        </li>
      ))}
    </ul>
  );
}

export function TokenMeter({
  used,
  limit,
  label = "Tokens",
}: {
  used: number;
  limit: number;
  label?: ReactNode;
}) {
  const normalizedLimit = Math.max(0, limit);
  const normalizedUsed = Math.max(0, Math.min(used, normalizedLimit));
  const pct =
    normalizedLimit > 0
      ? Math.min(100, Math.round((normalizedUsed / normalizedLimit) * 100))
      : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-[rgb(var(--harbor-text-muted))]">
        <span>{label}</span>
        <span>{used.toLocaleString()} / {limit.toLocaleString()}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--harbor-state-active)]">
        <div
          role="progressbar"
          aria-label={typeof label === "string" ? label : "Tokens"}
          aria-valuenow={normalizedUsed}
          aria-valuemin={0}
          aria-valuemax={normalizedLimit}
          style={{ width: `${pct}%` }}
          className="h-full rounded-full bg-[rgb(var(--harbor-accent))]"
        />
      </div>
    </div>
  );
}

export interface EvalResult {
  id: string;
  name: ReactNode;
  score: ReactNode;
  status: "pass" | "warn" | "fail";
}

export function EvalTable({ results }: { results: EvalResult[] }) {
  return (
    <table className="w-full text-left text-sm">
      <thead className="text-xs text-[rgb(var(--harbor-text-muted))]">
        <tr>
          <th className="px-3 py-2 font-medium">Eval</th>
          <th className="px-3 py-2 font-medium">Score</th>
          <th className="px-3 py-2 font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result) => (
          <tr key={result.id} className="border-t border-[color:var(--harbor-border-subtle)]">
            <td className="px-3 py-2">{result.name}</td>
            <td className="px-3 py-2">{result.score}</td>
            <td className="px-3 py-2">{result.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
