import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import {
  Presence,
  PresenceUser,
  CollabCursor,
} from "./Presence";

describe("Presence", () => {
  it("renders presence users and person count", () => {
    renderWithHarbor(
      <Presence>
        <PresenceUser name="Ana" status="editing" />
        <PresenceUser name="Bruno" status="viewing" />
      </Presence>,
    );
    // Tooltip content rendered via portal; check the person count text
    expect(screen.getByText("2 people")).toBeInTheDocument();
  });

  it("renders singular 'person' for a single user", () => {
    renderWithHarbor(
      <Presence>
        <PresenceUser name="Ana" />
      </Presence>,
    );
    expect(screen.getByText("1 person")).toBeInTheDocument();
  });

  it("truncates users beyond max and shows +N overflow", () => {
    renderWithHarbor(
      <Presence max={2}>
        <PresenceUser name="Ana" />
        <PresenceUser name="Bruno" />
        <PresenceUser name="Cinto" />
        <PresenceUser name="Diego" />
      </Presence>,
    );
    // max=2, total=4 → extra=2
    expect(screen.getByText("+2")).toBeInTheDocument();
    // Still shows total count
    expect(screen.getByText("4 people")).toBeInTheDocument();
  });

  it("does not show overflow when within max", () => {
    renderWithHarbor(
      <Presence max={5}>
        <PresenceUser name="Ana" />
        <PresenceUser name="Bruno" />
      </Presence>,
    );
    expect(screen.queryByText(/^\+\d+$/)).toBeNull();
  });

  it("renders zero users gracefully", () => {
    renderWithHarbor(<Presence>{/* none */}</Presence>);
    expect(screen.getByText("0 people")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <Presence className="my-presence">
        <PresenceUser name="Ana" />
      </Presence>,
    );
    expect(container.querySelector(".my-presence")).toBeTruthy();
  });

  it("throws when PresenceUser used outside Presence", () => {
    // Suppress console.error for expected error
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => {
      renderWithHarbor(<PresenceUser name="Orphan" />);
    }).toThrow("<PresenceUser> must be rendered inside <Presence>.");
    spy.mockRestore();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <Presence>
        <PresenceUser name="Ana" status="editing" />
        <PresenceUser name="Bruno" status="idle" />
      </Presence>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("CollabCursor", () => {
  it("renders the cursor name label", () => {
    renderWithHarbor(<CollabCursor x={100} y={200} name="Ana" />);
    expect(screen.getByText("Ana")).toBeInTheDocument();
  });

  it("renders the cursor SVG arrow", () => {
    const { container } = renderWithHarbor(
      <CollabCursor x={0} y={0} name="Test" />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute("width")).toBe("18");
    expect(svg?.getAttribute("height")).toBe("22");
  });

  it("positions the cursor with translate", () => {
    const { container } = renderWithHarbor(
      <CollabCursor x={50} y={75} name="Moved" />,
    );
    const wrapper = container.querySelector("[style*='translate']");
    expect(wrapper).toBeTruthy();
    expect(wrapper?.getAttribute("style")).toContain("translate(50px, 75px)");
  });

  it("uses custom color", () => {
    renderWithHarbor(<CollabCursor x={0} y={0} name="Color" color="#ff0000" />);
    // jsdom converts hex colors to rgb() in style attributes
    const label = screen.getByText("Color");
    expect(label?.closest("span")?.getAttribute("style")).toContain("rgb(255, 0, 0)");
  });

  it("uses default purple color", () => {
    renderWithHarbor(<CollabCursor x={0} y={0} name="Default" />);
    const label = screen.getByText("Default");
    expect(label?.closest("span")?.getAttribute("style")).toContain("rgb(168, 85, 247)");
  });

  it("is pointer-events-none", () => {
    const { container } = renderWithHarbor(
      <CollabCursor x={0} y={0} name="NoClick" />,
    );
    const wrapper = container.querySelector(".pointer-events-none");
    expect(wrapper).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <CollabCursor x={10} y={20} name="A11y" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
