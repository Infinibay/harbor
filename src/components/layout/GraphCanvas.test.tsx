import { describe, expect, it, vi } from "vitest";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { GraphCanvas } from "./GraphCanvas";
import { GraphNode } from "./GraphNode";

describe("GraphCanvas", () => {
  const nodes = [
    {
      id: "source",
      x: 80,
      y: 120,
      ports: [
        { id: "out", side: "right" as const, color: "#34d399" },
        { id: "error", side: "bottom" as const, color: "#fb7185" },
      ],
      data: { label: "Source" },
    },
    {
      id: "branch",
      x: 380,
      y: 120,
      ports: [
        { id: "in", side: "left" as const, color: "#38bdf8" },
        { id: "true", side: "right" as const, color: "#34d399" },
        { id: "fallback", side: "right" as const, color: "#fbbf24" },
      ],
      data: { label: "Branch" },
    },
  ];

  it("renders controlled nodes and port-aware edges", () => {
    const { container } = renderWithHarbor(
      <div style={{ height: 480 }}>
        <GraphCanvas
          nodes={nodes}
          edges={[{ id: "edge-1", from: "source", fromPort: "out", to: "branch", toPort: "in" }]}
          selectedIds={["branch"]}
          renderNode={({ node, selected }) => (
            <GraphNode
              title={node.data.label}
              selected={selected}
              ports={node.ports}
            />
          )}
        />
      </div>,
    );

    expect(container.textContent).toContain("Source");
    expect(container.textContent).toContain("Branch");
    expect(container.querySelector("[aria-label='fallback']")).toBeTruthy();
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("notifies when a node is selected", async () => {
    const onSelectedIdsChange = vi.fn();
    const { user, container } = renderWithHarbor(
      <div style={{ height: 480 }}>
        <GraphCanvas
          nodes={nodes}
          edges={[]}
          selectedIds={[]}
          onSelectedIdsChange={onSelectedIdsChange}
          renderNode={({ node }) => <GraphNode title={node.data.label} ports={node.ports} />}
        />
      </div>,
    );

    await user.click(container.querySelector("button")!);
    expect(onSelectedIdsChange).toHaveBeenCalledWith(["source"]);
  });
});
