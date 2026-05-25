# AgentWorkflow

Composable AI and devtools workflow primitives for prompts, model selection, agent progress, tool traces, approvals, citations, logs, tokens, and eval results.

## Import

```tsx
import {
  PromptComposer,
  ModelPicker,
  AgentTimeline,
  ToolCallTrace,
  ApprovalCard,
  CitationPanel,
  DiffApproval,
  RunLog,
  TokenMeter,
  EvalTable,
} from "@infinibay/harbor/dev";
```

## Example

```tsx
<AgentWorkflow
  mainLabel="Release review"
  sidebarLabel="Evidence and checks"
  sidebar={
    <>
      <TokenMeter used={18420} limit={64000} />
      <AgentTimeline items={runSteps} />
      <CitationPanel citations={citations} />
      <RunLog entries={runLog} />
      <EvalTable results={evalResults} />
    </>
  }
>
    <PromptComposer
      value={prompt}
      onChange={setPrompt}
      onSubmit={runAgent}
      actions={<ModelPicker models={models} value={model} onChange={setModel} />}
    />

    <AgentTimeline
      items={[
        { id: "plan", title: "Plan task", status: "complete", timestamp: "12:04" },
        { id: "search", title: "Search codebase", status: "running", timestamp: "12:05" },
        { id: "approve", title: "Await approval", status: "blocked" },
      ]}
    />

    <ToolCallTrace
      name="search_files"
      status="success"
      duration="420 ms"
      input={'{"query":"billing settings"}'}
      output="8 files ranked"
    />

    <DiffApproval
      before={oldConfig}
      after={nextConfig}
      onApprove={applyDiff}
      onReject={rejectDiff}
    />
</AgentWorkflow>
```

## Components

- `AgentWorkflow`: two-column workflow layout for the main run surface plus evidence/checks sidebar.
- `PromptComposer`: controlled prompt textarea with submit handling and a slot for model/tools/actions.
- `ModelPicker`: labeled select with model descriptions.
- `AgentTimeline`: ordered status timeline for queued, running, complete, blocked, and error steps.
- `ToolCallTrace`: collapsible input/output trace for tools, function calls, API calls, or shell steps.
- `ApprovalCard`: focused approve/reject decision surface.
- `CitationPanel`: source list with optional links and excerpts.
- `DiffApproval`: `DiffViewer` plus approval controls for proposed edits.
- `RunLog`: compact monospaced log stream.
- `TokenMeter`: accessible token budget progress bar.
- `EvalTable`: small result table for pass, warn, and fail checks.

## Props

Most components are intentionally controlled. Pass current values, callbacks, and already-shaped run state from your agent runtime.

`PromptComposer` calls `onSubmit` only when enabled and the prompt is not empty. `ModelPicker` expects stable model ids. `DiffApproval` renders a textual diff; use a richer editor outside Harbor if the user must edit the patch before approval.

## Gotchas

These primitives are not a generic chatbot shell. Compose them into concrete workflows: code review, data cleanup, support triage, incident automation, or approval-heavy agent runs.

Keep approvals explicit. For destructive actions, place `ApprovalCard` or `DiffApproval` near the tool trace that explains the change, and wire the approve/reject handlers to your runtime instead of auto-continuing.

For long logs or traces, virtualize outside `RunLog` or paginate the entries. `RunLog` is a compact display primitive, not a terminal emulator.
