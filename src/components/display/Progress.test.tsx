import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Progress } from "./Progress";

describe("Progress", () => {
  it("renders determinate bar", () => {
    const { container } = renderWithHarbor(<Progress value={50} />);
    const bar = container.querySelector("[class*='rounded-full']");
    expect(bar).toBeTruthy();
  });

  it("renders label", () => {
    renderWithHarbor(<Progress value={50} label="Upload" />);
    expect(screen.getByText("Upload")).toBeInTheDocument();
  });

  it("shows percentage when showValue=true", () => {
    const { container } = renderWithHarbor(<Progress value={42} showValue />);
    expect(container.textContent).toContain("42%");
  });

  it("uses custom valueSlot", () => {
    const { container } = renderWithHarbor(
      <Progress value={50} valueSlot={<span>Custom</span>} />,
    );
    expect(container.textContent).toContain("Custom");
  });

  it("renders indeterminate mode", () => {
    const { container } = renderWithHarbor(<Progress indeterminate />);
    // Indeterminate uses a sliding bar with x animation
    expect(container.textContent).toBeTruthy();
  });

  it("renders shimmer when shimmer=true", () => {
    const { container } = renderWithHarbor(<Progress value={50} shimmer />);
    const shimmer = container.querySelector(".shimmer");
    expect(shimmer).toBeTruthy();
  });

  it("clamps value above 100", () => {
    const { container } = renderWithHarbor(<Progress value={200} showValue />);
    expect(container.textContent).toContain("100%");
  });

  it("clamps value below 0", () => {
    const { container } = renderWithHarbor(<Progress value={-10} showValue />);
    expect(container.textContent).toContain("0%");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(<Progress className="my-prog" />);
    expect(container.querySelector(".my-prog")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<Progress value={75} label="Progress" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
