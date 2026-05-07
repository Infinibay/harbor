import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { FAB } from "./FAB";

describe("FAB", () => {
  it("renders with aria-label", () => {
    renderWithHarbor(<FAB icon={<span>+</span>} label="Add item" />);
    expect(
      screen.getByRole("button", { name: "Add item" }),
    ).toBeInTheDocument();
  });

  it("renders the icon", () => {
    renderWithHarbor(<FAB icon={<span data-testid="fab-icon">+</span>} label="Add" />);
    expect(screen.getByTestId("fab-icon")).toBeInTheDocument();
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    const { user } = renderWithHarbor(
      <FAB icon={<span>+</span>} label="Add" onClick={onClick} />,
    );
    await user.click(screen.getByRole("button", { name: "Add" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies position class", () => {
    const { container } = renderWithHarbor(
      <FAB icon={<span>+</span>} label="Add" position="bottom-left" />,
    );
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("fixed");
  });

  it("applies size class", () => {
    const { container } = renderWithHarbor(
      <FAB icon={<span>+</span>} label="Add" size="lg" />,
    );
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("w-14");
  });

  it("applies variant class", () => {
    const { container } = renderWithHarbor(
      <FAB icon={<span>+</span>} label="Add" variant="secondary" />,
    );
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("bg-surface-3");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <FAB icon={<span>+</span>} label="Add" className="my-fab" />,
    );
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("my-fab");
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <FAB icon={<span>+</span>} label="Accessible" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
