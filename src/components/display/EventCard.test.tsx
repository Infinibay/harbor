import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { EventCard } from "./EventCard";

describe("EventCard", () => {
  it("renders title", () => {
    const { container } = renderWithHarbor(
      <EventCard date="2025-03-15" title="Launch Day" />,
    );
    expect(container.textContent).toContain("Launch Day");
  });

  it("renders date components", () => {
    const { container } = renderWithHarbor(
      <EventCard date={new Date(2025, 2, 15)} title="Event" />,
    );
    expect(container.textContent).toContain("MAR");
    expect(container.textContent).toContain("15");
  });

  it("renders time and location", () => {
    const { container } = renderWithHarbor(
      <EventCard date="2025-03-15" title="E" time="3pm" location="NYC" />,
    );
    expect(container.textContent).toContain("3pm");
    expect(container.textContent).toContain("NYC");
  });

  it("renders description", () => {
    const { container } = renderWithHarbor(
      <EventCard date="2025-03-15" title="E" description="Big event" />,
    );
    expect(container.textContent).toContain("Big event");
  });

  it("renders attendee count", () => {
    const { container } = renderWithHarbor(
      <EventCard date="2025-03-15" title="E" attendees={42} />,
    );
    expect(container.textContent).toContain("42 going");
  });

  it("renders RSVP button when onToggleAttending provided", () => {
    renderWithHarbor(
      <EventCard date="2025-03-15" title="E" onToggleAttending={vi.fn()} />,
    );
    expect(screen.getByText("RSVP")).toBeInTheDocument();
  });

  it("renders Attending state", () => {
    renderWithHarbor(
      <EventCard
        date="2025-03-15"
        title="E"
        attending
        onToggleAttending={vi.fn()}
      />,
    );
    expect(screen.getByText("✓ Attending")).toBeInTheDocument();
  });

  it("fires onToggleAttending", async () => {
    const fn = vi.fn();
    const { user } = renderWithHarbor(
      <EventCard date="2025-03-15" title="E" onToggleAttending={fn} />,
    );
    await user.click(screen.getByText("RSVP"));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <EventCard date="2025-03-15" title="E" className="my-event" />,
    );
    expect(container.querySelector(".my-event")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <EventCard date="2025-03-15" title="Event" time="5pm" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
