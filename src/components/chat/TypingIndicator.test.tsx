import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { TypingIndicator } from "./TypingIndicator";

describe("TypingIndicator", () => {
  it("renders the bouncing dots", () => {
    const { container } = renderWithHarbor(<TypingIndicator />);
    // 3 dot spans inside
    const dots = container.querySelectorAll(".rounded-full.bg-white\\/70");
    expect(dots.length).toBe(3);
  });

  it("renders name when provided", () => {
    renderWithHarbor(<TypingIndicator name="Alice" />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("does not render name when not provided", () => {
    const { container } = renderWithHarbor(<TypingIndicator />);
    const nameSpan = container.querySelector(".text-white\\/60");
    expect(nameSpan).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <TypingIndicator className="my-indicator" />,
    );
    const el = container.querySelector(".my-indicator");
    expect(el).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<TypingIndicator name="Bob" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
