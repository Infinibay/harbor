import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { SplitPane } from "./SplitPane";

describe("SplitPane", () => {
  it("renders first and second panes", () => {
    const { container } = renderWithHarbor(
      <SplitPane first={<span>Left</span>} second={<span>Right</span>} />,
    );
    expect(container.textContent).toContain("Left");
    expect(container.textContent).toContain("Right");
  });

  it("renders role=separator", () => {
    const { container } = renderWithHarbor(
      <SplitPane first="A" second="B" />,
    );
    expect(container.querySelector("[role='separator']")).toBeTruthy();
  });

  it("sets aria-orientation to vertical for horizontal layout", () => {
    const { container } = renderWithHarbor(
      <SplitPane orientation="horizontal" first="A" second="B" />,
    );
    const sep = container.querySelector("[role='separator']");
    expect(sep?.getAttribute("aria-orientation")).toBe("vertical");
  });

  it("sets aria-orientation to horizontal for vertical layout", () => {
    const { container } = renderWithHarbor(
      <SplitPane orientation="vertical" first="A" second="B" />,
    );
    const sep = container.querySelector("[role='separator']");
    expect(sep?.getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("applies horizontal flex by default", () => {
    const { container } = renderWithHarbor(
      <SplitPane first="A" second="B" />,
    );
    const wrapper = container.querySelector(".flex");
    expect(wrapper).toBeTruthy();
  });

  it("applies flex-col for vertical orientation", () => {
    const { container } = renderWithHarbor(
      <SplitPane orientation="vertical" first="A" second="B" />,
    );
    const wrapper = container.querySelector(".flex-col");
    expect(wrapper).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <SplitPane first="A" second="B" className="my-split" />,
    );
    expect(container.querySelector(".my-split")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <SplitPane first={<span>First</span>} second={<span>Second</span>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
