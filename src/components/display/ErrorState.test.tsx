import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("renders default title", () => {
    renderWithHarbor(<ErrorState />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders custom title", () => {
    renderWithHarbor(<ErrorState title="Custom error" />);
    expect(screen.getByText("Custom error")).toBeInTheDocument();
  });

  it("renders description", () => {
    renderWithHarbor(<ErrorState description="Try again later" />);
    expect(screen.getByText("Try again later")).toBeInTheDocument();
  });

  it("renders error code", () => {
    renderWithHarbor(<ErrorState code="500" />);
    expect(screen.getByText("500")).toBeInTheDocument();
  });

  it("renders Try again button when onRetry provided", () => {
    renderWithHarbor(<ErrorState onRetry={vi.fn()} />);
    expect(screen.getByText("Try again")).toBeInTheDocument();
  });

  it("fires onRetry when button is clicked", async () => {
    const onRetry = vi.fn();
    const { user } = renderWithHarbor(<ErrorState onRetry={onRetry} />);
    await user.click(screen.getByText("Try again"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("does not render Try again button when onRetry not provided", () => {
    renderWithHarbor(<ErrorState />);
    expect(screen.queryByText("Try again")).toBeNull();
  });

  it("renders actions slot", () => {
    renderWithHarbor(<ErrorState actions={<button>Report</button>} />);
    expect(screen.getByText("Report")).toBeInTheDocument();
  });

  it("renders custom icon", () => {
    renderWithHarbor(<ErrorState icon={<span>🔥</span>} />);
    expect(screen.getByText("🔥")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(<ErrorState className="my-err" />);
    expect(container.querySelector(".my-err")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<ErrorState />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
