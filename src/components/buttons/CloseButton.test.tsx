import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { CloseButton } from "./CloseButton";

describe("CloseButton", () => {
  it("renders with aria-label Close", () => {
    renderWithHarbor(<CloseButton />);
    expect(
      screen.getByRole("button", { name: "Close" }),
    ).toBeInTheDocument();
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    const { user } = renderWithHarbor(<CloseButton onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is type=button", () => {
    renderWithHarbor(<CloseButton />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("supports disabled prop", async () => {
    const onClick = vi.fn();
    const { user } = renderWithHarbor(<CloseButton disabled onClick={onClick} />);
    const btn = screen.getByRole("button", { name: "Close" });
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards ref to the underlying button", () => {
    const ref: React.RefObject<HTMLButtonElement | null> = { current: null };
    renderWithHarbor(<CloseButton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("applies size variant classes", () => {
    const { container } = renderWithHarbor(<CloseButton size="sm" />);
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("w-6");
  });

  it("applies variant classes", () => {
    const { container } = renderWithHarbor(<CloseButton variant="solid" />);
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("bg-[var(--harbor-surface-panel-muted)]");
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<CloseButton />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
