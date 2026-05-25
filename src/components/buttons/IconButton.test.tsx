import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("renders with aria-label", () => {
    renderWithHarbor(<IconButton label="Settings" icon={<span>⚙</span>} />);
    expect(
      screen.getByRole("button", { name: "Settings" }),
    ).toBeInTheDocument();
  });

  it("renders the icon", () => {
    renderWithHarbor(
      <IconButton label="Settings" icon={<span data-testid="icon">⚙</span>} />,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    const { user } = renderWithHarbor(
      <IconButton label="Go" icon={<span>→</span>} onClick={onClick} />,
    );
    await user.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("supports disabled prop", async () => {
    const onClick = vi.fn();
    const { user } = renderWithHarbor(
      <IconButton label="Go" icon={<span>→</span>} disabled onClick={onClick} />,
    );
    const btn = screen.getByRole("button", { name: "Go" });
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards ref to the underlying button", () => {
    const ref: React.RefObject<HTMLButtonElement | null> = { current: null };
    renderWithHarbor(
      <IconButton label="Ref" icon={<span>R</span>} ref={ref} />,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("applies size class", () => {
    const { container } = renderWithHarbor(
      <IconButton label="Small" icon={<span>S</span>} size="sm" />,
    );
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("w-8");
  });

  it("applies variant class", () => {
    const { container } = renderWithHarbor(
      <IconButton label="Ghost" icon={<span>G</span>} variant="ghost" />,
    );
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("hover:bg-[var(--harbor-state-hover)]");
  });

  it("has title attribute matching label", () => {
    renderWithHarbor(<IconButton label="Tooltip" icon={<span>T</span>} />);
    expect(screen.getByRole("button")).toHaveAttribute("title", "Tooltip");
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <IconButton label="Accessible" icon={<span>A</span>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
