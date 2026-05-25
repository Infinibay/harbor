/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import {
  AgentWorkflow,
  AgentTimeline,
  ApprovalCard,
  CitationPanel,
  EvalTable,
  ModelPicker,
  PromptComposer,
  RunLog,
  TokenMeter,
  ToolCallTrace,
} from "./AgentWorkflow";

const models = [
  { id: "triage", label: "Triage", description: "Fast classification and next action." },
  { id: "review", label: "Review", description: "Slower run for policy and diff checks." },
  { id: "eval", label: "Eval", description: "Regression and quality scoring." },
];

function AgentWorkflowDemo(props: {
  scenario?: "deploy" | "incident";
  disabled?: boolean;
  pendingApproval?: boolean;
  onSubmit?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  const scenario = props.scenario ?? "deploy";
  const isIncident = scenario === "incident";
  const initialPrompt = isIncident
    ? "Review the current checkout incident and draft the next operator action."
    : "Review the billing permissions diff and identify release blockers.";
  const [prompt, setPrompt] = useState(
    initialPrompt,
  );
  const [model, setModel] = useState(isIncident ? "triage" : "review");
  const [decision, setDecision] = useState<"pending" | "approved" | "rejected">(
    props.pendingApproval === false ? "approved" : "pending",
  );
  const [runs, setRuns] = useState(1);

  useEffect(() => {
    setPrompt(initialPrompt);
    setModel(isIncident ? "triage" : "review");
    setDecision(props.pendingApproval === false ? "approved" : "pending");
    setRuns(1);
  }, [initialPrompt, isIncident, props.pendingApproval]);

  const approvalOpen = props.pendingApproval !== false && decision === "pending";
  const actionLabel = isIncident ? "page provider owner" : "approve release";
  const runLog = [
    { id: "1", message: isIncident ? "Loaded checkout-api metrics" : "Loaded release diff" },
    {
      id: "2",
      message: isIncident
        ? "Payment provider timeout rate is above paging threshold"
        : "Admin role gains billing write permission",
      level: "warn" as const,
    },
    {
      id: "3",
      message: isIncident
        ? "No database errors found in the same window"
        : "No migration or webhook changes detected",
    },
    ...(runs > 1
      ? [
          {
            id: "rerun",
            message: `Manual rerun ${runs} with ${model} model: ${prompt.slice(0, 72)}`,
          },
        ]
      : []),
    ...(decision === "approved"
      ? [{ id: "approved", message: `Operator approved: ${actionLabel}` }]
      : []),
    ...(decision === "rejected"
      ? [{ id: "rejected", message: `Operator rejected: ${actionLabel}`, level: "error" as const }]
      : []),
  ];

  return (
    <AgentWorkflow
      mainLabel={isIncident ? "Incident run" : "Release review"}
      sidebarLabel="Evidence and checks"
      sidebar={
        <>
          <TokenMeter used={isIncident ? 8200 : 11400} limit={32000} />
          <AgentTimeline
            items={[
              { id: "queued", title: "Queued", status: "complete", timestamp: "09:41" },
              {
                id: "evidence",
                title: isIncident ? "Collected logs" : "Checked diff",
                description: isIncident ? "Metrics and logs attached" : "Files and permission changes attached",
                status: "complete",
                timestamp: "09:42",
              },
              {
                id: "approval",
                title: decision === "pending" ? "Human approval" : "Decision captured",
                description:
                  decision === "pending"
                    ? "Waiting for operator decision"
                    : decision === "approved"
                      ? `Approved to ${actionLabel}`
                      : `Rejected request to ${actionLabel}`,
                status: decision === "pending" ? "blocked" : decision === "approved" ? "complete" : "error",
                timestamp: "09:43",
              },
            ]}
          />
          <CitationPanel
            citations={[
              {
                id: "runbook",
                label: isIncident ? "Checkout incident runbook" : "Release approval checklist",
                excerpt: isIncident ? "Paging threshold and owner escalation path." : "Required checks before billing permission changes.",
              },
              {
                id: "source",
                label: isIncident ? "checkout-api logs" : "billing roles diff",
                excerpt: isIncident ? "Timeout distribution for the last 15 minutes." : "Permission delta generated from the release branch.",
              },
            ]}
          />
          <EvalTable
            results={[
              { id: "grounded", name: "Evidence attached", score: "pass", status: "pass" },
              {
                id: "risk",
                name: isIncident ? "Escalation threshold" : "Permission risk",
                score: isIncident ? "warn" : "review",
                status: "warn",
              },
            ]}
          />
        </>
      }
    >
        <div className="rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel)] p-3">
          <div className="text-sm font-medium text-[rgb(var(--harbor-text))]">
            {isIncident ? "Checkout incident review" : "Release change review"}
          </div>
          <div className="mt-1 text-xs leading-relaxed text-[rgb(var(--harbor-text-muted))]">
            {isIncident
              ? "Operator-facing run state for a P2 checkout incident. The UI shows trace evidence before asking for action."
              : "Engineering approval surface for a permissions-related release. The UI keeps the proposed action next to logs and citations."}
          </div>
        </div>
        <PromptComposer
          value={prompt}
          onChange={setPrompt}
          onSubmit={() => {
            setRuns((current) => current + 1);
            props.onSubmit?.();
          }}
          disabled={props.disabled}
          actions={<ModelPicker models={models} value={model} onChange={setModel} />}
        />
        <ToolCallTrace
          name={isIncident ? "logs.query" : "git.diff"}
          status="success"
          duration={isIncident ? "1.2s" : "420ms"}
          input={
            isIncident
              ? '{"service":"checkout-api","window":"15m","level":"error"}'
              : '{"base":"main","head":"release/billing-roles"}'
          }
          output={
            isIncident
              ? "18 payment_provider_timeout errors; p95 latency 2.8s; no failed webhooks"
              : "3 files changed; adds billing:write to Admin; no schema migration"
          }
        />
        {approvalOpen ? (
          <ApprovalCard
            title={isIncident ? "Page payment provider owner?" : "Approve release candidate?"}
            description={
              isIncident
                ? "Suggested action is based on current error rate and the incident runbook."
                : "Suggested action is blocked until a human confirms the permission change is expected."
            }
            onApprove={() => {
              setDecision("approved");
              props.onApprove?.();
            }}
            onReject={() => {
              setDecision("rejected");
              props.onReject?.();
            }}
          />
        ) : null}
        {decision !== "pending" ? (
          <div className="rounded-[var(--harbor-target-radius)] border border-[color:var(--harbor-border-default)] bg-[var(--harbor-surface-panel-muted)] px-3 py-2 text-sm text-[rgb(var(--harbor-text))]">
            Decision: {decision === "approved" ? "approved" : "rejected"}. The application can now continue, queue a human follow-up, or persist an audit event.
          </div>
        ) : null}
        <RunLog entries={runLog} />
    </AgentWorkflow>
  );
}

export const playground = {
  component: AgentWorkflowDemo as never,
  importPath: "@infinibay/harbor/dev",
  controls: {
    scenario: { type: "select", options: ["deploy", "incident"], default: "deploy" },
    disabled: { type: "boolean", default: false },
    pendingApproval: { type: "boolean", default: true },
  },
  variants: [
    { label: "Deploy review", props: { scenario: "deploy", pendingApproval: true } },
    { label: "Incident", props: { scenario: "incident", pendingApproval: true } },
    { label: "Readonly", props: { disabled: true, pendingApproval: false } },
  ],
  events: [
    { name: "onSubmit", signature: "() => void" },
    { name: "onApprove", signature: "() => void" },
    { name: "onReject", signature: "() => void" },
  ],
  notes:
    "Use AgentWorkflow primitives for concrete operator surfaces: evidence, trace, approval, logs, and quality checks. Keep business logic and automation state in your app.",
};
