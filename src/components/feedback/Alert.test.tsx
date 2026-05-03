import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders children text", () => {
    const { container } = renderWithHarbor(<Alert>Something happened</Alert>);
    expect(container.textContent).toContain("Something happened");
  });

  it("renders title", () => {
    renderWithHarbor(<Alert title="Warning!">Body</Alert>);
    expect(screen.getByText("Warning!")).toBeInTheDocument();
  });

  it("renders default info tone icon", () => {
    const { container } = renderWithHarbor(<Alert>Info alert</Alert>);
    expect(container.textContent).toContain("ⓘ");
  });

  it("renders success tone", () => {
    const { container } = renderWithHarbor(<Alert tone="success">OK</Alert>);
    expect(container.textContent).toContain("✓");
  });

  it("renders warning tone", () => {
    const { container } = renderWithHarbor(<Alert tone="warning">Careful</Alert>);
    expect(container.textContent).toContain("!");
  });

  it("renders danger tone", () => {
    const { container } = renderWithHarbor(<Alert tone="danger">Error!</Alert>);
    expect(container.textContent).toContain("⚠");
  });

  it("renders custom icon", () => {
    renderWithHarbor(
      <Alert icon={<span data-testid="ic">🔔</span>}>Custom</Alert>,
    );
    expect(screen.getByTestId("ic")).toBeInTheDocument();
  });

  it("renders actions slot", () => {
    renderWithHarbor(<Alert actions={<button>Retry</button>}>Error</Alert>);
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("renders close button when onClose provided", () => {
    const { container } = renderWithHarbor(<Alert onClose={vi.fn()}>Close me</Alert>);
    const closeBtn = container.querySelector("button");
    expect(closeBtn).toBeTruthy();
    expect(closeBtn?.textContent).toContain("×");
  });

  it("fires onClose when close button clicked", async () => {
    const onClose = vi.fn();
    const { user, container } = renderWithHarbor(<Alert onClose={onClose}>Closable</Alert>);
    await user.click(container.querySelector("button")!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not render close button when onClose not provided", () => {
    const { container } = renderWithHarbor(<Alert>No close</Alert>);
    expect(container.querySelector("button")).toBeNull();
  });

  it("applies sm size classes", () => {
    const { container } = renderWithHarbor(<Alert size="sm">Small</Alert>);
    const div = container.querySelector(".rounded-lg");
    expect(div).toBeTruthy();
  });

  it("applies md size by default", () => {
    const { container } = renderWithHarbor(<Alert>Default</Alert>);
    const div = container.querySelector(".rounded-xl");
    expect(div).toBeTruthy();
  });

  it("applies inline layout", () => {
    const { container } = renderWithHarbor(
      <Alert layout="inline" title="Inline">
        Single row
      </Alert>,
    );
    expect(container.querySelector(".items-center")).toBeTruthy();
  });

  it("applies danger border class", () => {
    const { container } = renderWithHarbor(<Alert tone="danger">Danger</Alert>);
    const alert = container.querySelector(".border-rose-400\\/45");
    expect(alert).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(<Alert className="my-alert">X</Alert>);
    expect(container.querySelector(".my-alert")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <Alert tone="warning" title="Heads up" onClose={vi.fn()}>
        Check this out
      </Alert>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
