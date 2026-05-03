import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { FlameGraph, type FlameFrame } from "./FlameGraph";

const frames: FlameFrame[] = [
  { id: "root", label: "main()", value: 100 },
  { id: "child1", parent: "root", label: "foo()", value: 60 },
  { id: "child2", parent: "root", label: "bar()", value: 40 },
  { id: "grandchild", parent: "child1", label: "baz()", value: 30 },
];

describe("FlameGraph", () => {
  it("renders frame labels", () => {
    const { container } = renderWithHarbor(<FlameGraph frames={frames} />);
    expect(container.textContent).toContain("main()");
    expect(container.textContent).toContain("foo()");
    expect(container.textContent).toContain("bar()");
  });

  it("renders the hint text when no frame is hovered", () => {
    const { container } = renderWithHarbor(<FlameGraph frames={frames} />);
    expect(container.textContent).toContain("Hover a frame");
  });

  it("renders 'No frames to render' for empty frames", () => {
    const { container } = renderWithHarbor(<FlameGraph frames={[]} />);
    expect(container.textContent).toContain("No frames to render");
  });

  it("renders a single root frame", () => {
    const single: FlameFrame[] = [
      { id: "root", label: "root()", value: 100 },
    ];
    const { container } = renderWithHarbor(<FlameGraph frames={single} />);
    expect(container.textContent).toContain("root()");
  });

  it("fires onFrameClick when a frame is clicked", async () => {
    const onClick = vi.fn();
    const { user } = renderWithHarbor(
      <FlameGraph frames={frames} onFrameClick={onClick} />,
    );
    // Click on the root frame
    const rootFrame = screen.getByTitle(/main\(\)/);
    await user.click(rootFrame);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "root" }),
    );
  });

  it("shows breadcrumbs after clicking a zoomable frame", async () => {
    const { user } = renderWithHarbor(<FlameGraph frames={frames} />);
    // Click root frame to zoom in
    const rootFrame = screen.getByTitle(/main\(\)/);
    await user.click(rootFrame);
    // Should now show breadcrumb with "root" button and "main()" 
    expect(screen.getByText("root")).toBeTruthy();
  });

  it("renders root button for zoom-out navigation", async () => {
    const { user } = renderWithHarbor(<FlameGraph frames={frames} />);
    const rootFrame = screen.getByTitle(/main\(\)/);
    await user.click(rootFrame);
    const rootBtn = screen.getByText("root");
    expect(rootBtn).toBeTruthy();
    // Click root button to zoom out
    await user.click(rootBtn);
  });

  it("uses custom formatValue", () => {
    const { container } = renderWithHarbor(
      <FlameGraph frames={frames} formatValue={(v) => `${v}ms`} />,
    );
    expect(container.textContent).toContain("ms");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <FlameGraph frames={frames} className="my-flame" />,
    );
    const wrapper = container.querySelector(".my-flame");
    expect(wrapper).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<FlameGraph frames={frames} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
