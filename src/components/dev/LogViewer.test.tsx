import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { LogViewer, type LogEntry } from "./LogViewer";

const entries: LogEntry[] = [
  { id: 1, time: "10:00:01", level: "info", source: "app", message: "Server started" },
  { id: 2, time: "10:00:02", level: "warn", source: "db", message: "Connection slow" },
  { id: 3, time: "10:00:03", level: "error", message: "Crash!" },
  { id: 4, time: "10:00:04", level: "debug", source: "auth", message: "Token refresh" },
];

describe("LogViewer", () => {
  it("renders log entry messages", () => {
    const { container } = renderWithHarbor(<LogViewer entries={entries} />);
    expect(container.textContent).toContain("Server started");
    expect(container.textContent).toContain("Connection slow");
    expect(container.textContent).toContain("Crash!");
    expect(container.textContent).toContain("Token refresh");
  });

  it("renders level filter buttons", () => {
    const { container } = renderWithHarbor(<LogViewer entries={entries} />);
    expect(container.textContent).toContain("debug");
    expect(container.textContent).toContain("info");
    expect(container.textContent).toContain("warn");
    expect(container.textContent).toContain("error");
  });

  it("renders filter input", () => {
    renderWithHarbor(<LogViewer entries={entries} />);
    expect(screen.getByPlaceholderText("Filter…")).toBeInTheDocument();
  });

  it("renders timestamps", () => {
    const { container } = renderWithHarbor(<LogViewer entries={entries} />);
    expect(container.textContent).toContain("10:00:01");
    expect(container.textContent).toContain("10:00:03");
  });

  it("renders source when provided", () => {
    const { container } = renderWithHarbor(<LogViewer entries={entries} />);
    expect(container.textContent).toContain("app");
    expect(container.textContent).toContain("db");
    expect(container.textContent).toContain("auth");
  });

  it("renders level counts", () => {
    const { container } = renderWithHarbor(<LogViewer entries={entries} />);
    // debug · 1, info · 1, warn · 1, error · 1
    expect(container.textContent).toContain("debug · 1");
    expect(container.textContent).toContain("info · 1");
    expect(container.textContent).toContain("warn · 1");
    expect(container.textContent).toContain("error · 1");
  });

  it("renders Follow/Pause button", () => {
    renderWithHarbor(<LogViewer entries={entries} />);
    expect(screen.getByText("Follow")).toBeInTheDocument();
  });

  it("renders 'No matching entries' for empty filtered results", () => {
    const { container } = renderWithHarbor(
      <LogViewer entries={[]} />,
    );
    expect(container.textContent).toContain("No matching entries");
  });

  it("renders with custom height", () => {
    const { container } = renderWithHarbor(
      <LogViewer entries={entries} height={500} />,
    );
    const scrollDiv = container.querySelector("[style*='height']");
    expect(scrollDiv?.getAttribute("style")).toContain("500");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <LogViewer entries={entries} className="my-logs" />,
    );
    expect(container.querySelector(".my-logs")).toBeTruthy();
  });

  it("renders Date timestamps using toLocaleTimeString", () => {
    const date = new Date(2024, 0, 1, 10, 30, 0);
    const dateEntries: LogEntry[] = [
      { id: 1, time: date, level: "info", message: "test" },
    ];
    const { container } = renderWithHarbor(
      <LogViewer entries={dateEntries} />,
    );
    expect(container.textContent).toContain("10:30:00");
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<LogViewer entries={entries} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
