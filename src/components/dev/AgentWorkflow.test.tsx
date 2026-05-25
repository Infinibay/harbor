import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import {
  AgentWorkflow,
  AgentTimeline,
  ApprovalCard,
  CitationPanel,
  DiffApproval,
  EvalTable,
  ModelPicker,
  PromptComposer,
  RunLog,
  TokenMeter,
  ToolCallTrace,
} from "./AgentWorkflow";

describe("AgentWorkflow", () => {
  it("renders the workflow layout with optional context sidebar", () => {
    renderWithHarbor(
      <AgentWorkflow
        mainLabel="Release review"
        sidebarLabel="Evidence"
        sidebar={<TokenMeter used={1200} limit={4000} />}
      >
        <ToolCallTrace name="git.diff" status="success" output="No migrations" />
      </AgentWorkflow>,
    );

    expect(screen.getByLabelText("Release review")).toHaveTextContent("git.diff");
    expect(screen.getByRole("complementary", { name: "Evidence" })).toContainElement(
      screen.getByRole("progressbar", { name: "Tokens" }),
    );
  });

  it("submits a prompt when content is present", async () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    const { user } = renderWithHarbor(
      <PromptComposer
        value="Summarize this trace"
        onChange={onChange}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Run" }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("reports model changes", async () => {
    const onChange = vi.fn();
    const { user } = renderWithHarbor(
      <ModelPicker
        value="fast"
        onChange={onChange}
        models={[
          { id: "fast", label: "Fast", description: "Low latency" },
          { id: "deep", label: "Deep" },
        ]}
      />,
    );

    await user.click(screen.getByLabelText("Model"));
    await user.click(screen.getByRole("button", { name: "Deep" }));

    expect(onChange).toHaveBeenCalledWith("deep");
  });

  it("renders timeline, trace, citations, log, token meter and evals", () => {
    renderWithHarbor(
      <>
        <AgentTimeline
          items={[
            {
              id: "plan",
              title: "Plan",
              status: "complete",
              description: "Found workflow",
            },
          ]}
        />
        <ToolCallTrace
          name="search_files"
          status="success"
          input="query"
          output="result"
          duration="12ms"
        />
        <CitationPanel
          citations={[
            {
              id: "doc",
              label: "Docs",
              href: "https://example.com",
              excerpt: "Reference",
            },
          ]}
        />
        <RunLog entries={[{ id: "1", message: "Started" }]} />
        <TokenMeter used={250} limit={1000} />
        <EvalTable
          results={[{ id: "a", name: "Grounding", score: "92%", status: "pass" }]}
        />
      </>,
    );

    expect(screen.getByText("Plan")).toBeInTheDocument();
    expect(screen.getByText("search_files")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "https://example.com",
    );
    expect(screen.getByLabelText("Run log")).toHaveTextContent("Started");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "250");
    expect(screen.getByText("Grounding")).toBeInTheDocument();
  });

  it("clamps token meter progress semantics when usage exceeds the limit", () => {
    renderWithHarbor(<TokenMeter used={1200} limit={1000} />);

    const meter = screen.getByRole("progressbar", { name: "Tokens" });
    expect(meter).toHaveAttribute("aria-valuenow", "1000");
    expect(meter).toHaveAttribute("aria-valuemax", "1000");
  });

  it("fires approval callbacks", async () => {
    const onApprove = vi.fn();
    const onReject = vi.fn();
    const { user } = renderWithHarbor(
      <ApprovalCard
        title="Run migration?"
        onApprove={onApprove}
        onReject={onReject}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Approve" }));
    await user.click(screen.getByRole("button", { name: "Reject" }));

    expect(onApprove).toHaveBeenCalledTimes(1);
    expect(onReject).toHaveBeenCalledTimes(1);
  });

  it("composes diff review with approval actions", async () => {
    const onApprove = vi.fn();
    const onReject = vi.fn();
    const { user } = renderWithHarbor(
      <DiffApproval
        before={"const a = 1;"}
        after={"const a = 2;"}
        onApprove={onApprove}
        onReject={onReject}
      />,
    );

    expect(screen.getByText("const a = 1;")).toBeInTheDocument();
    expect(screen.getByText("const a = 2;")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Approve" }));

    expect(onApprove).toHaveBeenCalledTimes(1);
  });

  it("a11y: no violations for a composed agent workflow", async () => {
    const { container } = renderWithHarbor(
      <section aria-label="Agent workflow">
        <PromptComposer value="Run check" onChange={() => {}} onSubmit={() => {}} />
        <ModelPicker
          value="fast"
          onChange={() => {}}
          models={[{ id: "fast", label: "Fast" }]}
        />
        <ApprovalCard title="Approve deploy?" onApprove={() => {}} onReject={() => {}} />
        <TokenMeter used={100} limit={500} />
      </section>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
