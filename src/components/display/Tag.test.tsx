import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Tag } from "./Tag";

describe("Tag", () => {
  it("renders children text", () => {
    const { container } = renderWithHarbor(<Tag>React</Tag>);
    expect(container.textContent).toContain("React");
  });

  it("renders icon when provided", () => {
    const { container } = renderWithHarbor(
      <Tag icon={<span data-testid="icon">⚡</span>}>Fast</Tag>,
    );
    expect(container.querySelector("[data-testid='icon']")).toBeTruthy();
  });

  it("renders remove button when onRemove provided", () => {
    const { container } = renderWithHarbor(<Tag onRemove={vi.fn()}>Removable</Tag>);
    const btn = container.querySelector("button");
    expect(btn).toBeTruthy();
    expect(btn?.textContent).toContain("×");
  });

  it("fires onRemove when × button is clicked", async () => {
    const onRemove = vi.fn();
    const { user } = renderWithHarbor(<Tag onRemove={onRemove}>Remove me</Tag>);
    const btn = screen.getByText("Remove me").closest("span")?.querySelector("button")!;
    await user.click(btn);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("does not render remove button when onRemove not provided", () => {
    const { container } = renderWithHarbor(<Tag>No remove</Tag>);
    expect(container.querySelector("button")).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(<Tag className="my-tag">Test</Tag>);
    expect(container.querySelector(".my-tag")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<Tag>Accessible</Tag>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
