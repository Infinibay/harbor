/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";
import { ProductShell, type ProductShellKind } from "./ProductShell";

const queueRows = [
  {
    id: "REQ-1042",
    title: "Billing export access",
    owner: "M. Chen",
    status: "Needs review",
    sla: "2h",
  },
  {
    id: "REQ-1041",
    title: "Production read role",
    owner: "A. Singh",
    status: "Blocked",
    sla: "4h",
  },
  {
    id: "REQ-1038",
    title: "Invoice admin role",
    owner: "L. Park",
    status: "Approved",
    sla: "Done",
  },
];

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-[color:var(--harbor-border-subtle)] bg-[var(--harbor-surface-panel-muted)] px-2 py-1 text-xs text-[color:var(--harbor-text-secondary)]">
      {children}
    </span>
  );
}

function ProductShellDemo(props: {
  kind?: ProductShellKind;
  sidebar?: boolean;
  mobileNavigation?: boolean;
  detailPanel?: boolean;
  mobileDetailPanel?: boolean;
  statusBar?: boolean;
}) {
  const kind = props.kind ?? "dashboard";
  return (
    <div className="w-full max-w-[980px] overflow-hidden rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-default)]">
      <ProductShell
        kind={kind}
        style={{ minHeight: 520 }}
        sidebarClassName="!w-44"
        detailPanelClassName="!w-56"
        mainLabel="Access review workspace"
        sidebarLabel="Operations navigation"
        detailPanelLabel="Selected request"
        sidebar={
          props.sidebar !== false ? (
            <div className="space-y-2 p-3">
              <div className="mb-4 text-sm font-semibold">Ops Console</div>
              {["Review queue", "Approvals", "Roles", "Audit log"].map((item, index) => (
                <div
                  key={item}
                  aria-current={index === 0 ? "page" : undefined}
                  className="rounded-[var(--harbor-target-radius)] px-3 py-2 text-sm text-[color:var(--harbor-text-secondary)] hover:bg-[var(--harbor-state-hover)] aria-[current=page]:bg-[var(--harbor-state-selected)] aria-[current=page]:text-[var(--harbor-state-selected-fg)]"
                >
                  {item}
                </div>
              ))}
            </div>
          ) : undefined
        }
        mobileNavigation={
          props.mobileNavigation !== false ? (
            <div className="flex gap-2 overflow-x-auto">
              {["Review", "Approvals", "Roles", "Audit"].map((item, index) => (
                <button
                  key={item}
                  type="button"
                  aria-current={index === 0 ? "page" : undefined}
                  className="whitespace-nowrap rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-subtle)] bg-[var(--harbor-surface-panel-muted)] px-3 py-1.5 text-sm text-[color:var(--harbor-text-secondary)] aria-[current=page]:bg-[var(--harbor-state-selected)] aria-[current=page]:text-[var(--harbor-state-selected-fg)]"
                >
                  {item}
                </button>
              ))}
            </div>
          ) : undefined
        }
        topbar={
          <div className="flex items-center justify-between px-4 py-3">
            <div className="font-medium">Access operations</div>
            <div className="flex items-center gap-2">
              <Pill>⌘K</Pill>
              <Pill>4 pending</Pill>
            </div>
          </div>
        }
        breadcrumbs="Security / Access / Review queue"
        toolbar={
          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel)] px-3 py-1.5 text-sm">
              Needs review
            </button>
            <button className="rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel)] px-3 py-1.5 text-sm">
              Assign owner
            </button>
            <button className="rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel)] px-3 py-1.5 text-sm">
              Export CSV
            </button>
          </div>
        }
        header={
          <div>
            <h2 className="text-xl font-semibold">Access review queue</h2>
            <p className="mt-1 text-sm text-[color:var(--harbor-text-secondary)]">
              Review permission requests and keep decisions auditable.
            </p>
          </div>
        }
        detailPanel={
          props.detailPanel !== false ? (
            <div className="space-y-3 p-4 text-sm">
              <div className="font-medium">REQ-1042</div>
              <p className="text-[color:var(--harbor-text-secondary)]">
                Billing export access requested by Finance. Requires Security approval before the 2h SLA expires.
              </p>
              <div className="rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-subtle)] bg-[var(--harbor-surface-panel-muted)] p-3">
                Evidence attached: ticket, manager approval, audit scope.
              </div>
            </div>
          ) : undefined
        }
        mobileDetailPanel={
          props.mobileDetailPanel !== false ? (
            <div className="rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-subtle)] bg-[var(--harbor-surface-panel-muted)] p-3 text-sm">
              <div className="font-medium">REQ-1042 summary</div>
              <p className="mt-1 text-[color:var(--harbor-text-secondary)]">
                Finance request, 2h SLA, manager approval attached.
              </p>
            </div>
          ) : undefined
        }
        statusBar={
          props.statusBar !== false ? (
            <div className="flex justify-between text-xs text-[color:var(--harbor-text-tertiary)]">
              <span>Queue synced 2m ago</span>
              <span>2 requests breach SLA today</span>
            </div>
          ) : undefined
        }
      >
        <div className="space-y-3">
          {queueRows.map((row) => (
            <div key={row.id} className="rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-subtle)] bg-[var(--harbor-surface-panel)] p-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium">{row.title}</div>
                  <div className="mt-1 font-mono text-xs text-[color:var(--harbor-text-tertiary)]">
                    {row.id} · {row.owner}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[color:var(--harbor-text-secondary)]">{row.status}</div>
                  <div className="mt-1 text-xs text-[color:var(--harbor-text-tertiary)]">{row.sla}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ProductShell>
    </div>
  );
}

export const playground = {
  component: ProductShellDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    kind: {
      type: "select",
      default: "dashboard",
      options: ["dashboard", "admin", "workbench", "editor"],
    },
    sidebar: { type: "boolean", default: true },
    mobileNavigation: { type: "boolean", default: true },
    detailPanel: { type: "boolean", default: true },
    mobileDetailPanel: { type: "boolean", default: true },
    statusBar: { type: "boolean", default: true },
  },
  variants: [
    { label: "Review queue", props: { kind: "admin", sidebar: true, mobileNavigation: true, detailPanel: true, mobileDetailPanel: true } },
    { label: "No detail", props: { kind: "dashboard", sidebar: true, mobileNavigation: true, detailPanel: false, mobileDetailPanel: false } },
    { label: "Workbench", props: { kind: "workbench", sidebar: true, mobileNavigation: true, detailPanel: true, mobileDetailPanel: true } },
  ],
  notes:
    "Use ProductShell when the workflow needs persistent navigation, command entry, breadcrumbs, task actions, a detail inspector, and status feedback around the main surface.",
};
