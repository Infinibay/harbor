import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { LoadingOverlay } from "./LoadingOverlay";

describe("LoadingOverlay", () => {
  it("renders spinner by default", () => {
    const { container } = renderWithHarbor(<LoadingOverlay />);
    expect(container.querySelector(".animate-spin")).toBeTruthy();
  });

  it("renders label when provided", () => {
    const { container } = renderWithHarbor(<LoadingOverlay label="Loading…" />);
    expect(container.textContent).toContain("Loading…");
  });

  it("has role=status and aria-live=polite", () => {
    const { container } = renderWithHarbor(<LoadingOverlay label="Wait" />);
    const el = container.querySelector("[role='status']");
    expect(el).toBeTruthy();
    expect(el?.getAttribute("aria-live")).toBe("polite");
  });

  it("renders progress done/total", () => {
    const { container } = renderWithHarbor(
      <LoadingOverlay progress={{ done: 3, total: 12 }} />,
    );
    expect(container.textContent).toContain("3 / 12");
  });

  it("renders progress bar with gradient", () => {
    const { container } = renderWithHarbor(
      <LoadingOverlay progress={{ done: 5, total: 10 }} />,
    );
    const bar = container.querySelector("[style*='linear-gradient']");
    expect(bar).toBeTruthy();
  });

  it("renders progress bar at 50% width when half done", () => {
    const { container } = renderWithHarbor(
      <LoadingOverlay progress={{ done: 5, total: 10 }} />,
    );
    const bar = container.querySelector("[style*='linear-gradient']");
    expect(bar?.getAttribute("style")).toContain("50%");
  });

  it("clamps progress above 100%", () => {
    const { container } = renderWithHarbor(
      <LoadingOverlay progress={{ done: 20, total: 10 }} />,
    );
    const bar = container.querySelector("[style*='linear-gradient']");
    expect(bar?.getAttribute("style")).toContain("100%");
  });

  it("renders with custom size", () => {
    const { container } = renderWithHarbor(<LoadingOverlay size={40} />);
    expect(container.querySelector(".animate-spin")).toBeTruthy();
  });

  it("applies fill class", () => {
    const { container } = renderWithHarbor(<LoadingOverlay fill />);
    const el = container.querySelector(".min-h-\\[200px\\]");
    expect(el).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <LoadingOverlay className="my-overlay" />,
    );
    expect(container.querySelector(".my-overlay")).toBeTruthy();
  });

  it("does not render progress when no progress prop", () => {
    const { container } = renderWithHarbor(<LoadingOverlay />);
    expect(container.querySelector("[style*='linear-gradient']")).toBeNull();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <LoadingOverlay label="Loading" progress={{ done: 1, total: 5 }} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
