import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ExecutionTrace, GraphNode, GraphNodePalette, GraphPort } from "./GraphNode";

describe("GraphNode", () => {
  it("renders node metadata and ports", () => {
    const { container } = renderWithHarbor(
      <GraphNode
        title="Validate payload"
        subtitle="Filter"
        ports={[
          { id: "input", label: "input", side: "left", color: "#38bdf8" },
          { id: "match", label: "match", side: "right", color: "#34d399" },
          { id: "fallback", label: "fallback", side: "right", color: "#fbbf24" },
        ]}
      />,
    );

    expect(container.textContent).toContain("Validate payload");
    expect(container.textContent).toContain("Filter");
    expect(container.querySelector("[aria-label='input']")).toBeTruthy();
    expect(container.querySelector("[aria-label='match']")).toBeTruthy();
    expect(container.querySelector("[aria-label='fallback']")).toBeTruthy();
    expect(container.querySelector("[aria-label='match']")?.getAttribute("style")).toContain("rgb(52, 211, 153)");
  });

  it("keeps legacy input and output slots available", () => {
    const { container } = renderWithHarbor(
      <GraphNode
        title="Legacy slots"
        inputs={<GraphPort side="input" label="input" />}
        outputs={<GraphPort side="output" label="output" />}
      />,
    );

    expect(container.querySelector("[aria-label='input']")).toBeTruthy();
    expect(container.querySelector("[aria-label='output']")).toBeTruthy();
  });

  it("emits palette selections", async () => {
    const onSelect = vi.fn();
    const { user, container } = renderWithHarbor(
      <GraphNodePalette
        items={[{ id: "http", label: "HTTP request", description: "Call an API" }]}
        onAdd={onSelect}
      />,
    );

    await user.click(container.querySelector("button")!);
    expect(onSelect).toHaveBeenCalledWith({ id: "http", label: "HTTP request", description: "Call an API" });
  });

  it("sets drag data for palette items", () => {
    const setData = vi.fn();
    const { container } = renderWithHarbor(
      <GraphNodePalette
        items={[{ id: "filter", label: "Filter", description: "Branch condition" }]}
        onAdd={vi.fn()}
        draggableItems
        dragMimeType="application/x-test-node"
      />,
    );

    fireEvent.dragStart(container.querySelector("button")!, {
      dataTransfer: {
        effectAllowed: "move",
        setData,
      },
    });

    expect(setData).toHaveBeenCalledWith(
      "application/x-test-node",
      JSON.stringify({ id: "filter", label: "Filter", description: "Branch condition" }),
    );
    expect(setData).toHaveBeenCalledWith("text/plain", "Filter");
  });

  it("renders execution trace entries", () => {
    const { container } = renderWithHarbor(
      <ExecutionTrace
        items={[
          { id: "1", label: "Webhook", detail: "200 OK", status: "success" },
          { id: "2", label: "Transform", detail: "mapped fields", status: "running" },
        ]}
      />,
    );

    expect(container.textContent).toContain("Webhook");
    expect(container.textContent).toContain("200 OK");
    expect(container.textContent).toContain("Transform");
  });
});
