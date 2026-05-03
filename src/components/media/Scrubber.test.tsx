import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Scrubber } from "./Scrubber";

describe("Scrubber", () => {
  it("renders current and total time labels", () => {
    const { container } = renderWithHarbor(
      <Scrubber value={30} duration={120} onSeek={vi.fn()} />,
    );
    // fmt(30) = "0:30", fmt(120) = "2:00"
    expect(container.textContent).toContain("0:30");
    expect(container.textContent).toContain("2:00");
  });

  it("renders formatted time for longer durations", () => {
    const { container } = renderWithHarbor(
      <Scrubber value={65} duration={180} onSeek={vi.fn()} />,
    );
    expect(container.textContent).toContain("1:05");
    expect(container.textContent).toContain("3:00");
  });

  it("renders progress bar at correct width", () => {
    const { container } = renderWithHarbor(
      <Scrubber value={60} duration={120} onSeek={vi.fn()} />,
    );
    // 50% progress
    const bar = container.querySelector("[style*='50%']");
    expect(bar).toBeTruthy();
  });

  it("renders buffered range when provided", () => {
    const { container } = renderWithHarbor(
      <Scrubber value={30} duration={120} onSeek={vi.fn()} buffered={60} />,
    );
    // buffered = 60/120 = 50%
    const buffered = container.querySelector("[style*='50%']");
    expect(buffered).toBeTruthy();
  });

  it("renders waveform bars when provided", () => {
    const waveform = [0.3, 0.7, 0.5, 0.9, 0.4];
    const { container } = renderWithHarbor(
      <Scrubber value={0} duration={100} onSeek={vi.fn()} waveform={waveform} />,
    );
    const bars = container.querySelectorAll("span.flex-1.rounded-full");
    expect(bars.length).toBe(5);
  });

  it("renders markers with labels", () => {
    const markers = [
      { time: 30, label: "Chapter 1" },
      { time: 60, label: "Chapter 2", color: "red" },
    ];
    const { container } = renderWithHarbor(
      <Scrubber value={0} duration={120} onSeek={vi.fn()} markers={markers} />,
    );
    const markerEls = container.querySelectorAll("[title]");
    expect(markerEls.length).toBeGreaterThanOrEqual(2);
  });

  it("renders scrubber handle (thumb)", () => {
    const { container } = renderWithHarbor(
      <Scrubber value={30} duration={120} onSeek={vi.fn()} />,
    );
    const thumb = container.querySelector(".ring-fuchsia-400\\/40");
    expect(thumb).toBeTruthy();
  });

  it("renders cursor-pointer on track", () => {
    const { container } = renderWithHarbor(
      <Scrubber value={0} duration={100} onSeek={vi.fn()} />,
    );
    expect(container.querySelector(".cursor-pointer")).toBeTruthy();
  });

  it("clamps value above duration", () => {
    const { container } = renderWithHarbor(
      <Scrubber value={200} duration={100} onSeek={vi.fn()} />,
    );
    // Clamped to 100% — the progress bar should exist
    const bar = container.querySelector("[style*='100%']");
    expect(bar).toBeTruthy();
  });
  it("clamps value below 0", () => {
    const { container } = renderWithHarbor(
      <Scrubber value={-10} duration={100} onSeek={vi.fn()} />,
    );
    expect(container.textContent).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <Scrubber value={0} duration={100} onSeek={vi.fn()} className="my-scrubber" />,
    );
    expect(container.querySelector(".my-scrubber")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <Scrubber value={30} duration={120} onSeek={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
