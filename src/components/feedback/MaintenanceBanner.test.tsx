import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { MaintenanceBanner } from "./MaintenanceBanner";

describe("MaintenanceBanner", () => {
  it("renders with future scheduledAt", () => {
    const future = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
    const { container } = renderWithHarbor(
      <MaintenanceBanner scheduledAt={future} />,
    );
    expect(container.textContent).toContain("Maintenance starts in");
  });

  it("renders maintenance in progress when time has passed", () => {
    const past = new Date(Date.now() - 30 * 60 * 1000); // 30 min ago
    const { container } = renderWithHarbor(
      <MaintenanceBanner scheduledAt={past} duration={60 * 60 * 1000} />,
    );
    expect(container.textContent).toContain("Maintenance in progress");
  });

  it("renders complete when duration has passed", () => {
    const past = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
    const { container } = renderWithHarbor(
      <MaintenanceBanner scheduledAt={past} duration={60 * 60 * 1000} />,
    );
    expect(container.textContent).toContain("Maintenance window complete");
  });

  it("renders scope text", () => {
    const future = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const { container } = renderWithHarbor(
      <MaintenanceBanner scheduledAt={future} scope="API, Dashboard" />,
    );
    expect(container.textContent).toContain("API, Dashboard");
  });

  it("renders custom title", () => {
    const future = new Date(Date.now() + 2 * 60 * 60 * 1000);
    renderWithHarbor(
      <MaintenanceBanner scheduledAt={future} title="Custom title" />,
    );
    expect(screen.getByText("Custom title")).toBeInTheDocument();
  });

  it("renders children content", () => {
    const future = new Date(Date.now() + 2 * 60 * 60 * 1000);
    renderWithHarbor(
      <MaintenanceBanner scheduledAt={future}>
        Extra details here
      </MaintenanceBanner>,
    );
    expect(screen.getByText("Extra details here")).toBeInTheDocument();
  });

  it("renders close button when onClose provided", () => {
    const future = new Date(Date.now() + 2 * 60 * 60 * 1000);
    renderWithHarbor(
      <MaintenanceBanner scheduledAt={future} onClose={vi.fn()} />,
    );
    expect(screen.getByLabelText("Dismiss")).toBeInTheDocument();
  });

  it("fires onClose when dismiss clicked", async () => {
    const onClose = vi.fn();
    const future = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const { user } = renderWithHarbor(
      <MaintenanceBanner scheduledAt={future} onClose={onClose} />,
    );
    await user.click(screen.getByLabelText("Dismiss"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders actions slot", () => {
    const future = new Date(Date.now() + 2 * 60 * 60 * 1000);
    renderWithHarbor(
      <MaintenanceBanner
        scheduledAt={future}
        actions={<button>Schedule</button>}
      />,
    );
    expect(screen.getByText("Schedule")).toBeInTheDocument();
  });

  it("renders warning tone during maintenance window", () => {
    const past = new Date(Date.now() - 10 * 60 * 1000);
    const { container } = renderWithHarbor(
      <MaintenanceBanner scheduledAt={past} duration={60 * 60 * 1000} />,
    );
    expect(container.querySelector(".bg-amber-500\\/15")).toBeTruthy();
  });

  it("renders info tone before maintenance", () => {
    const future = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const { container } = renderWithHarbor(
      <MaintenanceBanner scheduledAt={future} />,
    );
    expect(container.querySelector(".bg-sky-500\\/15")).toBeTruthy();
  });

  it("applies forceSticky", () => {
    const future = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const { container } = renderWithHarbor(
      <MaintenanceBanner scheduledAt={future} forceSticky />,
    );
    expect(container.querySelector(".sticky")).toBeTruthy();
  });

  it("renders date/time window with duration", () => {
    const future = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const { container } = renderWithHarbor(
      <MaintenanceBanner scheduledAt={future} duration={60 * 60 * 1000} />,
    );
    // Should contain arrow between start and end time
    expect(container.textContent).toContain("→");
  });

  it("renders with string scheduledAt", () => {
    const future = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    const { container } = renderWithHarbor(
      <MaintenanceBanner scheduledAt={future} />,
    );
    expect(container.textContent).toContain("Maintenance");
  });

  it("applies custom className", () => {
    const future = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const { container } = renderWithHarbor(
      <MaintenanceBanner scheduledAt={future} className="my-maint" />,
    );
    expect(container.querySelector(".my-maint")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const future = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const { container } = renderWithHarbor(
      <MaintenanceBanner scheduledAt={future} onClose={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
