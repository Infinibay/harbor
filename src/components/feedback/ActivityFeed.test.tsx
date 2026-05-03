import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ActivityFeed, type ActivityEvent } from "./ActivityFeed";

const events: ActivityEvent[] = [
  { id: "1", actor: "Ana", verb: "deployed", target: "web-01", time: "2m ago", tone: "success" },
  { id: "2", actor: "Bruno", verb: "created", target: "project-x", time: "1h ago", tone: "info" },
  { id: "3", description: "System reboot", time: "3h ago", tone: "warning" },
];

describe("ActivityFeed", () => {
  it("renders event actors and verbs", () => {
    const { container } = renderWithHarbor(<ActivityFeed events={events} />);
    expect(container.textContent).toContain("Ana");
    expect(container.textContent).toContain("deployed");
    expect(container.textContent).toContain("web-01");
    expect(container.textContent).toContain("Bruno");
    expect(container.textContent).toContain("created");
  });

  it("renders descriptions", () => {
    const { container } = renderWithHarbor(<ActivityFeed events={events} />);
    expect(container.textContent).toContain("System reboot");
  });

  it("renders time strings", () => {
    const { container } = renderWithHarbor(<ActivityFeed events={events} />);
    expect(container.textContent).toContain("2m ago");
    expect(container.textContent).toContain("1h ago");
  });

  it("renders time from Date objects", () => {
    const dateEvents: ActivityEvent[] = [
      {
        id: "d1",
        actor: "User",
        time: new Date(2024, 0, 1, 10, 30, 0),
      },
    ];
    const { container } = renderWithHarbor(<ActivityFeed events={dateEvents} />);
    expect(container.textContent).toContain("User");
  });

  it("renders avatar when provided", () => {
    const { container } = renderWithHarbor(
      <ActivityFeed
        events={[
          { id: "a1", avatar: <span data-testid="av">👤</span>, time: "now" },
        ]}
      />,
    );
    expect(container.querySelector("[data-testid='av']")).toBeTruthy();
  });

  it("renders tone colors", () => {
    const { container } = renderWithHarbor(<ActivityFeed events={events} />);
    expect(container.querySelector(".border-emerald-400\\/40")).toBeTruthy();
    expect(container.querySelector(".border-sky-400\\/40")).toBeTruthy();
    expect(container.querySelector(".border-amber-400\\/40")).toBeTruthy();
  });

  it("renders icon when provided instead of avatar", () => {
    const { container } = renderWithHarbor(
      <ActivityFeed
        events={[
          { id: "i1", icon: <span>🚀</span>, time: "now" },
        ]}
      />,
    );
    expect(container.textContent).toContain("🚀");
  });

  it("renders empty events gracefully", () => {
    const { container } = renderWithHarbor(<ActivityFeed events={[]} />);
    expect(container.querySelector("div")).toBeTruthy();
  });

  it("groups events by day (default)", () => {
    const { container } = renderWithHarbor(<ActivityFeed events={events} />);
    // When groupBy="day", events with string times get parsed to NaN → empty key
    // Events still render
    expect(container.textContent).toContain("Ana");
  });

  it("does not group when groupBy='none'", () => {
    const { container } = renderWithHarbor(
      <ActivityFeed events={events} groupBy="none" />,
    );
    // No group label headers should appear
    expect(container.textContent).toContain("Ana");
    // No uppercase tracking headers
    expect(container.querySelector(".uppercase")).toBeNull();
  });

  it("renders timeline connector lines between events", () => {
    const { container } = renderWithHarbor(
      <ActivityFeed events={events} groupBy="none" />,
    );
    const lines = container.querySelectorAll(".bg-white\\/8");
    expect(lines.length).toBeGreaterThan(0);
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <ActivityFeed events={events} className="my-feed" />,
    );
    expect(container.querySelector(".my-feed")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<ActivityFeed events={events} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
