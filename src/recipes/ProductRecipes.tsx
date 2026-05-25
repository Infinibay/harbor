/* eslint-disable react-refresh/only-export-components */
import { useState } from "react";
import { Button } from "../components/buttons/Button";
import { RoleBadge } from "../components/display/RoleBadge";
import {
  AuditLog,
  DataWorkspace,
  PermissionMatrix,
  type PermissionCell,
} from "../components/data";
import type { ColumnDef } from "../components/data/table/types";
import {
  AgentTimeline,
  ApprovalCard,
  CitationPanel,
  EvalTable,
  ModelPicker,
  PromptComposer,
  TokenMeter,
  ToolCallTrace,
} from "../components/dev/AgentWorkflow";
import {
  AdminShell,
  DashboardShell,
  WorkbenchShell,
} from "../components/layout/ProductShell";
import { HarborField, HarborForm, useFieldArray } from "../lib/form";
import { f } from "../lib/schema";
import { TextField } from "../components/inputs/TextField";

interface AccountRow {
  id: string;
  name: string;
  role: string;
  status: string;
}

const accountRows: AccountRow[] = [
  { id: "u1", name: "Ada Lovelace", role: "Owner", status: "Active" },
  { id: "u2", name: "Grace Hopper", role: "Engineer", status: "Invited" },
  { id: "u3", name: "Katherine Johnson", role: "Auditor", status: "Active" },
];

const accountColumns: ColumnDef<AccountRow>[] = [
  { id: "name", header: "Name", sortable: true },
  { id: "role", header: "Role", sortable: true },
  { id: "status", header: "Status", sortable: true },
];

const roleRows = [
  { id: "owner", name: "Owner", role: "4 members", status: "Full access" },
  { id: "admin", name: "Admin", role: "8 members", status: "Privileged" },
  { id: "auditor", name: "Auditor", role: "3 members", status: "Read only" },
];

const settingsSchema = f.object({
  workspace: f.string().min(2).required(),
  owner: f.string().email().required(),
  domains: f.array(f.string()),
});

function RecipeSidebar({ active }: { active: string }) {
  const items = ["Overview", "Accounts", "Billing", "Settings"];
  return (
    <nav aria-label="Recipe navigation" className="space-y-1 p-3">
      {items.map((item) => (
        <a
          key={item}
          href={`#${item.toLowerCase()}`}
          aria-current={item === active ? "page" : undefined}
          className="block rounded-[var(--harbor-target-radius)] px-3 py-2 text-sm text-[rgb(var(--harbor-text-muted))] hover:bg-[var(--harbor-state-hover)] aria-[current=page]:bg-[var(--harbor-state-selected)] aria-[current=page]:text-[var(--harbor-state-selected-fg)]"
        >
          {item}
        </a>
      ))}
    </nav>
  );
}

function DomainFields() {
  const domains = useFieldArray<string>("domains");
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Allowed domains</div>
      <ul className="space-y-1">
        {domains.items.map((domain, index) => (
          <li
            key={`${domain}-${index}`}
            className="flex items-center justify-between rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-subtle)] px-3 py-2 text-sm"
          >
            {domain}
            <button
              type="button"
              className="rounded-[var(--harbor-target-radius)] px-2 py-1 text-xs text-[rgb(var(--harbor-danger))] outline-none hover:bg-[var(--harbor-state-hover)] focus-visible:shadow-[var(--harbor-focus-shadow)]"
              onClick={() => domains.remove(index)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <Button type="button" variant="secondary" onClick={() => domains.append("example.com")}>
        Add domain
      </Button>
    </div>
  );
}

export function AdminCrudRecipe() {
  return (
    <AdminShell
      sidebar={<RecipeSidebar active="Accounts" />}
      topbar={<div className="px-4 py-3 font-medium">Admin console</div>}
      breadcrumbs={<span>Admin / Accounts</span>}
      detailPanel={<div className="p-4 text-sm">Select a user to review permissions and recent activity.</div>}
      statusBar={<div className="text-xs">3 users · 1 invite pending</div>}
      mainLabel="Admin CRUD recipe"
    >
      <DataWorkspace
        title="Accounts"
        description="Create, review, and govern workspace members."
        actions={<Button size="sm">New member</Button>}
        savedViews={[
          { id: "all", label: "All", count: 3 },
          { id: "active", label: "Active", count: 2 },
          { id: "invited", label: "Invited", count: 1 },
        ]}
        activeViewId="all"
        selectedCount={1}
        bulkActions={[{ id: "disable", label: "Disable", danger: true, onClick: () => {} }]}
        rows={accountRows}
        columns={accountColumns}
        rowId={(row) => row.id}
      />
    </AdminShell>
  );
}

export function SettingsConsoleRecipe() {
  return (
    <AdminShell
      sidebar={<RecipeSidebar active="Settings" />}
      topbar={<div className="px-4 py-3 font-medium">Settings</div>}
      mainLabel="Settings recipe"
    >
      <HarborForm
        schema={settingsSchema}
        initial={{ workspace: "Harbor", owner: "owner@example.com", domains: ["harborui.com"] }}
        onSubmit={() => {}}
      >
        <div className="grid max-w-2xl gap-4 rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel)] p-4">
          <HarborField name="workspace" label="Workspace">
            <TextField />
          </HarborField>
          <HarborField name="owner" label="Owner email">
            <TextField />
          </HarborField>
          <DomainFields />
          <div>
            <Button type="submit">Save settings</Button>
          </div>
        </div>
      </HarborForm>
    </AdminShell>
  );
}

export function BillingAccountRecipe() {
  return (
    <DashboardShell
      sidebar={<RecipeSidebar active="Billing" />}
      topbar={<div className="px-4 py-3 font-medium">Billing</div>}
      mainLabel="Billing recipe"
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <DataWorkspace
          title="Invoices"
          metrics={[
            { label: "MRR", value: "$18.4k", tone: "success" },
            { label: "Past due", value: "$820", tone: "warning" },
          ]}
          rows={[
            { id: "i1", name: "May invoice", role: "$249", status: "Paid" },
            { id: "i2", name: "June invoice", role: "$249", status: "Open" },
          ]}
          columns={accountColumns}
          rowId={(row) => row.id}
        />
        <aside
          aria-label="Current plan"
          className="rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel)] p-4"
        >
          <h2 className="font-semibold">Plan</h2>
          <p className="mt-1 text-sm text-[rgb(var(--harbor-text-muted))]">Team plan · 24 seats</p>
          <Button className="mt-4" variant="secondary">
            Manage plan
          </Button>
        </aside>
      </div>
    </DashboardShell>
  );
}

export function AiAgentConsoleRecipe() {
  const [prompt, setPrompt] = useState("Audit checkout failures");
  const [model, setModel] = useState("fast");

  return (
    <WorkbenchShell
      sidebar={<RecipeSidebar active="Overview" />}
      topbar={<div className="px-4 py-3 font-medium">Agent console</div>}
      detailPanel={
        <CitationPanel
          citations={[
            {
              id: "runbook",
              label: "Runbook",
              excerpt: "Checkout incident playbook",
            },
          ]}
        />
      }
      detailPanelLabel="Agent context"
      mainLabel="AI agent console recipe"
    >
      <div className="grid gap-4 p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
          <PromptComposer value={prompt} onChange={setPrompt} onSubmit={() => {}} />
          <ModelPicker
            value={model}
            onChange={setModel}
            models={[
              { id: "fast", label: "Fast", description: "Low-latency triage" },
              { id: "deep", label: "Deep", description: "Long-context audit" },
            ]}
          />
        </div>
        <AgentTimeline
          items={[
            { id: "1", title: "Read checkout logs", status: "complete", timestamp: "09:12" },
            { id: "2", title: "Inspect Paddle config", status: "running", timestamp: "09:13" },
          ]}
        />
        <ToolCallTrace name="railway logs" status="success" output="POST /api/checkout 200" />
        <ApprovalCard title="Open Paddle dashboard?" onApprove={() => {}} onReject={() => {}} />
        <TokenMeter used={18420} limit={64000} label="Token usage" />
      </div>
    </WorkbenchShell>
  );
}

export function DataReviewQueueRecipe() {
  return (
    <DashboardShell
      sidebar={<RecipeSidebar active="Overview" />}
      topbar={<div className="px-4 py-3 font-medium">Review queue</div>}
      mainLabel="Data review recipe"
    >
      <DataWorkspace
        title="Verification queue"
        description="Review records that need human approval."
        savedViews={[
          { id: "needs-review", label: "Needs review", count: 18 },
          { id: "flagged", label: "Flagged", count: 4 },
        ]}
        activeViewId="needs-review"
        selectedCount={2}
        bulkActions={[
          { id: "approve", label: "Approve", onClick: () => {} },
          { id: "reject", label: "Reject", danger: true, onClick: () => {} },
        ]}
        detailPanel={<div className="p-4 text-sm">Record detail and audit trail.</div>}
        rows={accountRows}
        columns={accountColumns}
        rowId={(row) => row.id}
      />
    </DashboardShell>
  );
}

export function RbacAdminRecipe() {
  const [permissions, setPermissions] = useState<Record<string, PermissionCell>>({
    "owner:users": "allow",
    "owner:billing": "allow",
    "owner:audit": "allow",
    "admin:users": "allow",
    "admin:billing": "deny",
    "admin:audit": "allow",
    "auditor:users": "inherit",
    "auditor:billing": "deny",
    "auditor:audit": "allow",
  });

  function setPermission(principalId: string, resourceId: string, next: PermissionCell) {
    setPermissions((current) => ({
      ...current,
      [`${principalId}:${resourceId}`]: next,
    }));
  }

  return (
    <AdminShell
      sidebar={<RecipeSidebar active="Accounts" />}
      topbar={<div className="px-4 py-3 font-medium">RBAC admin</div>}
      breadcrumbs={<span>Admin / Roles</span>}
      detailPanel={
        <div className="space-y-3 p-4 text-sm">
          <div className="font-medium">Role summary</div>
          <RoleBadge role="owner" icon />
          <RoleBadge role="admin" icon />
          <RoleBadge role="custom" label="Auditor" icon />
        </div>
      }
      detailPanelLabel="RBAC role summary"
      mainLabel="RBAC admin recipe"
    >
      <div className="grid gap-4">
        <DataWorkspace
          title="Roles"
          description="Manage workspace roles, assignments, and permission posture."
          actions={<Button size="sm">New role</Button>}
          rows={roleRows}
          columns={accountColumns}
          rowId={(row) => row.id}
          showGlobalSearch={false}
          showColumnPicker={false}
          showExport={false}
        />
        <PermissionMatrix
          principals={[
            { id: "owner", label: "Owner", kind: "role", avatar: "OW" },
            { id: "admin", label: "Admin", kind: "role", avatar: "AD" },
            { id: "auditor", label: "Auditor", kind: "role", avatar: "AU" },
          ]}
          resources={[
            { id: "users", label: "Users", group: "Workspace" },
            { id: "billing", label: "Billing", group: "Workspace" },
            { id: "audit", label: "Audit log", group: "Security" },
          ]}
          value={permissions}
          onChange={setPermission}
          onBulkChange={(changes) => {
            setPermissions((current) => ({
              ...current,
              ...Object.fromEntries(
                changes.map((change) => [
                  `${change.principalId}:${change.resourceId}`,
                  change.value,
                ]),
              ),
            }));
          }}
        />
      </div>
    </AdminShell>
  );
}

export function AuditComplianceRecipe() {
  return (
    <AdminShell
      sidebar={<RecipeSidebar active="Overview" />}
      topbar={<div className="px-4 py-3 font-medium">Compliance</div>}
      breadcrumbs={<span>Security / Audit</span>}
      mainLabel="Audit compliance recipe"
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <DataWorkspace
          title="Compliance evidence"
          description="Collect controls, owners, and latest review status."
          metrics={[
            { label: "Controls", value: 42, tone: "info" },
            { label: "Exceptions", value: 2, tone: "warning" },
            { label: "Critical events", value: 1, tone: "danger" },
          ]}
          rows={[
            { id: "soc2", name: "SOC 2 access review", role: "Security", status: "Ready" },
            { id: "dpia", name: "DPIA data retention", role: "Legal", status: "Needs owner" },
          ]}
          columns={accountColumns}
          rowId={(row) => row.id}
        />
        <aside
          aria-label="Audit trail"
          className="rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel)] p-4"
        >
          <h2 className="mb-3 font-semibold">Audit trail</h2>
          <AuditLog
            entries={[
              {
                id: "a1",
                actor: { name: "Ada Lovelace" },
                verb: "approved",
                target: "SOC 2 access review",
                at: "2026-05-24T12:00:00Z",
                severity: "info",
                kind: "control",
                detail: "Quarterly access review completed.",
              },
              {
                id: "a2",
                actor: { name: "Grace Hopper" },
                verb: "flagged",
                target: "DPIA data retention",
                at: "2026-05-24T13:00:00Z",
                severity: "warn",
                kind: "privacy",
                diff: { from: "assigned", to: "needs owner" },
              },
            ]}
          />
        </aside>
      </div>
    </AdminShell>
  );
}

export function IncidentDashboardRecipe() {
  return (
    <DashboardShell
      sidebar={<RecipeSidebar active="Overview" />}
      topbar={<div className="px-4 py-3 font-medium">Incident command</div>}
      mainLabel="Incident dashboard recipe"
    >
      <div className="grid gap-4">
        <DataWorkspace
          title="Active incidents"
          metrics={[
            { label: "Open", value: 4, tone: "danger" },
            { label: "Acknowledged", value: 12, tone: "info" },
          ]}
          rows={[
            { id: "p1", name: "Checkout latency", role: "P1", status: "Investigating" },
            { id: "p2", name: "Webhook retries", role: "P2", status: "Monitoring" },
          ]}
          columns={accountColumns}
          rowId={(row) => row.id}
        />
        <EvalTable
          results={[
            { id: "slo", name: "SLO burn", score: "3.2x", status: "fail" },
            { id: "paging", name: "Paging policy", score: "ok", status: "pass" },
          ]}
        />
      </div>
    </DashboardShell>
  );
}

export const productRecipes = {
  AdminCrudRecipe,
  SettingsConsoleRecipe,
  BillingAccountRecipe,
  RbacAdminRecipe,
  AuditComplianceRecipe,
  AiAgentConsoleRecipe,
  DataReviewQueueRecipe,
  IncidentDashboardRecipe,
} as const;
