import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { LogTailer, type LogTailerHandle } from "./LogTailer";
import type { LogEntry } from "./LogViewer";

const entries: LogEntry[] = [
  { id: 1, time: "10:00:01", level: "info", source: "app", message: "Started" },
  { id: 2, time: "10:00:02", level: "warn", message: "Warning!" },
  { id: 3, time: "10:00:03", level: "error", source: "db", message: "Crash" },
];

describe("LogTailer", () => {
  it("renders log entry messages", () => {
    const { container } = renderWithHarbor(<LogTailer entries={entries} />);
    expect(container.textContent).toContain("Started");
    expect(container.textContent).toContain("Warning!");
    expect(container.textContent).toContain("Crash");
  });

  it("renders level filter buttons", () => {
    const { container } = renderWithHarbor(<LogTailer entries={entries} />);
    expect(container.textContent).toContain("debug");
    expect(container.textContent).toContain("info");
    expect(container.textContent).toContain("warn");
    expect(container.textContent).toContain("error");
  });

  it("renders search input with default placeholder", () => {
    renderWithHarbor(<LogTailer entries={entries} />);
    expect(
      screen.getByPlaceholderText("Search (regex supported)…"),
    ).toBeInTheDocument();
  });

  it("renders custom search placeholder", () => {
    renderWithHarbor(
      <LogTailer entries={entries} searchPlaceholder="Find…" />,
    );
    expect(screen.getByPlaceholderText("Find…")).toBeInTheDocument();
  });

  it("renders timestamps", () => {
    const { container } = renderWithHarbor(<LogTailer entries={entries} />);
    expect(container.textContent).toContain("10:00:01");
    expect(container.textContent).toContain("10:00:02");
  });

  it("renders source when provided", () => {
    const { container } = renderWithHarbor(<LogTailer entries={entries} />);
    expect(container.textContent).toContain("app");
    expect(container.textContent).toContain("db");
  });

  it("renders visible/total count", () => {
    const { container } = renderWithHarbor(<LogTailer entries={entries} />);
    // 3 visible / 3 total
    expect(container.textContent).toContain("3/3");
  });

  it("renders regex toggle button", () => {
    const { container } = renderWithHarbor(<LogTailer entries={entries} />);
    expect(container.textContent).toContain(".*");
  });

  it("renders 'No entries match' when all filtered out", () => {
    const { container } = renderWithHarbor(
      <LogTailer entries={entries} levels={[]} />,
    );
    expect(container.textContent).toContain("No entries match");
  });

  it("exposes imperative handle via ref", () => {
    const ref: React.RefObject<LogTailerHandle | null> = { current: null };
    renderWithHarbor(<LogTailer ref={ref} entries={entries} />);
    expect(ref.current).toBeTruthy();
    expect(ref.current?.following).toBe(true);
  });

  it("ref.clear() resets internal entries", () => {
    const ref: React.RefObject<LogTailerHandle | null> = { current: null };
    const { container } = renderWithHarbor(
      <LogTailer ref={ref} />,
    );
    // No controlled entries, internal is empty
    expect(container.textContent).toContain("No entries match");
    // clear should work without error
    ref.current?.clear();
  });

  it("renders with custom height", () => {
    const { container } = renderWithHarbor(
      <LogTailer entries={entries} height={500} />,
    );
    const scrollDiv = container.querySelector("[style*='height']");
    expect(scrollDiv?.getAttribute("style")).toContain("500");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <LogTailer entries={entries} className="my-tailer" />,
    );
    expect(container.querySelector(".my-tailer")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<LogTailer entries={entries} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
