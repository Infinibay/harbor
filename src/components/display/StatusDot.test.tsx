import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { StatusDot, STATUS_META, type Status } from "./StatusDot";

const statuses: Status[] = ["online", "degraded", "offline", "provisioning", "maintenance", "unknown"];

describe("StatusDot", () => {
  it("renders dot for each status", () => {
    for (const s of statuses) {
      const { container, unmount } = renderWithHarbor(<StatusDot status={s} />);
      const dot = container.querySelector("span.rounded-full");
      expect(dot).toBeTruthy();
      unmount();
    }
  });

  it("renders default label when no label prop", () => {
    const { container } = renderWithHarbor(<StatusDot status="online" />);
    expect(container.textContent).toContain("Online");
  });

  it("renders custom label via labelOverride", () => {
    const { container } = renderWithHarbor(
      <StatusDot status="online" labelOverride="Custom" />,
    );
    expect(container.textContent).toContain("Custom");
  });

  it("renders label prop as ReactNode", () => {
    const { container } = renderWithHarbor(
      <StatusDot status="online" label={<span>My Label</span>} />,
    );
    expect(container.textContent).toContain("My Label");
    // Default label should NOT appear
    expect(container.textContent).not.toContain("Online");
  });

  it("hides label when label=null", () => {
    const { container } = renderWithHarbor(<StatusDot status="online" label={null} />);
    expect(container.textContent).not.toContain("Online");
  });

  it("pulses for online by default", () => {
    const { container } = renderWithHarbor(<StatusDot status="online" />);
    const ping = container.querySelector(".animate-ping");
    expect(ping).toBeTruthy();
  });

  it("does not pulse for offline by default", () => {
    const { container } = renderWithHarbor(<StatusDot status="offline" />);
    const ping = container.querySelector(".animate-ping");
    expect(ping).toBeNull();
  });

  it("forces pulse when pulse=true", () => {
    const { container } = renderWithHarbor(<StatusDot status="offline" pulse={true} />);
    const ping = container.querySelector(".animate-ping");
    expect(ping).toBeTruthy();
  });

  it("disables pulse when pulse=false", () => {
    const { container } = renderWithHarbor(<StatusDot status="online" pulse={false} />);
    const ping = container.querySelector(".animate-ping");
    expect(ping).toBeNull();
  });

  it("uses custom size", () => {
    const { container } = renderWithHarbor(<StatusDot status="online" size={20} />);
    const wrapper = container.querySelector("[style*='20']");
    expect(wrapper).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <StatusDot status="online" className="my-dot" />,
    );
    expect(container.querySelector(".my-dot")).toBeTruthy();
  });

  it("exports STATUS_META with all statuses", () => {
    for (const s of statuses) {
      expect(STATUS_META[s]).toBeTruthy();
      expect(STATUS_META[s].label).toBeTruthy();
      expect(STATUS_META[s].dot).toBeTruthy();
      expect(STATUS_META[s].text).toBeTruthy();
    }
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<StatusDot status="online" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
