import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ToggleButton } from "./ToggleButton";

describe("ToggleButton", () => {
  it("renders children text", () => {
    renderWithHarbor(<ToggleButton pressed={false}>Bold</ToggleButton>);
    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
  });

  it("reflects pressed state via aria-pressed", () => {
    const { rerender } = renderWithHarbor(
      <ToggleButton pressed={false}>Bold</ToggleButton>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");

    rerender(
      <ToggleButton pressed={true}>Bold</ToggleButton>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("fires onChange with toggled value on click", async () => {
    const onChange = vi.fn();
    const { user } = renderWithHarbor(
      <ToggleButton pressed={false} onChange={onChange}>
        Toggle
      </ToggleButton>,
    );
    await user.click(screen.getByRole("button", { name: "Toggle" }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("fires onChange with false when currently pressed", async () => {
    const onChange = vi.fn();
    const { user } = renderWithHarbor(
      <ToggleButton pressed={true} onChange={onChange}>
        Toggle
      </ToggleButton>,
    );
    await user.click(screen.getByRole("button", { name: "Toggle" }));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("renders icon when provided", () => {
    renderWithHarbor(
      <ToggleButton pressed={false} icon={<span data-testid="icon">B</span>}>
        Bold
      </ToggleButton>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("is disabled by the disabled prop", async () => {
    const onChange = vi.fn();
    const { user } = renderWithHarbor(
      <ToggleButton pressed={false} disabled onChange={onChange}>
        Bold
      </ToggleButton>,
    );
    const btn = screen.getByRole("button", { name: "Bold" });
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("applies pressed style when pressed=true", () => {
    const { container } = renderWithHarbor(
      <ToggleButton pressed={true}>Active</ToggleButton>,
    );
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("bg-fuchsia-500/20");
  });

  it("applies unpressed style when pressed=false", () => {
    const { container } = renderWithHarbor(
      <ToggleButton pressed={false}>Inactive</ToggleButton>,
    );
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("bg-white/[0.04]");
  });

  it("applies size class", () => {
    const { container } = renderWithHarbor(
      <ToggleButton pressed={false} size="lg">
        Large
      </ToggleButton>,
    );
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("h-11");
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <ToggleButton pressed={false}>Accessible</ToggleButton>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
