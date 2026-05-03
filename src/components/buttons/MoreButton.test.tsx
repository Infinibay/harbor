import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { MoreButton } from "./MoreButton";

describe("MoreButton", () => {
  it("renders with aria-label More actions", () => {
    renderWithHarbor(<MoreButton />);
    expect(
      screen.getByRole("button", { name: "More actions" }),
    ).toBeInTheDocument();
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    const { user } = renderWithHarbor(<MoreButton onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: "More actions" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is type=button", () => {
    renderWithHarbor(<MoreButton />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("supports disabled prop", async () => {
    const onClick = vi.fn();
    const { user } = renderWithHarbor(<MoreButton disabled onClick={onClick} />);
    const btn = screen.getByRole("button", { name: "More actions" });
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards ref to the underlying button", () => {
    const ref: React.RefObject<HTMLButtonElement | null> = { current: null };
    renderWithHarbor(<MoreButton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("applies size sm class", () => {
    const { container } = renderWithHarbor(<MoreButton size="sm" />);
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("w-7");
  });

  it("applies size md class by default", () => {
    const { container } = renderWithHarbor(<MoreButton />);
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("w-8");
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<MoreButton />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
